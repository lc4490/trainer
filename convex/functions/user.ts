import { internal } from "../_generated/api";
import {
  internalMutation,
  MutationCtx,
  query,
  QueryCtx,
} from "../_generated/server";
import { v } from "convex/values";
import { authenticatedMutation } from "./helpers";

export const get = query({
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsert = internalMutation({
  args: {
    username: v.string(),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkId);
    if (user) {
      await ctx.db.patch(user._id, {
        username: args.username,
        image: args.image,
      });
    } else {
      await ctx.db.insert("users", {
        username: args.username,
        image: args.image,
        clerkId: args.clerkId,
      });
    }
  },
});

export const remove = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await getUserByClerkId(ctx, clerkId);
    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

export const onboard = authenticatedMutation({
  args: {
    activityLevel: v.optional(v.string()),
    age: v.optional(v.string()),
    availability: v.optional(v.array(v.string())),
    fitnessGoals: v.optional(v.string()),
    healthIssues: v.optional(v.string()),
    height: v.optional(v.string()),
    sex: v.optional(v.string()),
    weight: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the current user
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) {
      throw new Error("User not found or not authenticated");
    }

    await ctx.db.patch(currentUser._id, {
      activity: args.activityLevel || currentUser.activity,
      age: args.age ?? currentUser.age,
      availability: args.availability || currentUser.availability,
      goals: args.fitnessGoals || currentUser.goals,
      issues: args.healthIssues || currentUser.issues,
      height: args.height ?? currentUser.height,
      sex: args.sex || currentUser.sex,
      weight: args.weight ?? currentUser.weight,
    });
  },
});

export const getCurrentUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  return await getUserByClerkId(ctx, identity.subject);
};

const getUserByClerkId = async (
  ctx: QueryCtx | MutationCtx,
  clerkId: string
) => {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
};
