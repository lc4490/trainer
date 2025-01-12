import Groq from "groq-sdk";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const run = internalAction({
  args: {
    dmOrChannelId: v.union(v.id("directMessages"), v.id("channels")),
    user: v.id("users"),
  },
  handler: async (ctx, { dmOrChannelId, user }) => {
    const messages = await ctx.runQuery(internal.functions.chat.getMessages, {
      dmOrChannelId,
    });
    if (!messages) {
      return;
    }

    // Add a system prompt
    const systemPrompt = {
      role: "system",
      content:
        "You are a helpful assistant. Provide concise and accurate responses. Your name is Jarvis.",
    };

    // Combine system prompt with messages
    const formattedMessages = [
      systemPrompt,
      ...messages.map((message) => ({
        role: message.ai ? "asssistant" : "user",
        content: message.content,
      })),
    ];
    const result = await groq.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages.map((message) => ({
        role: message.role === user ? "user" : "assistant",
        content: message.content,
      })),
    });
    const value = result.choices[0].message.content
      ? result.choices[0].message.content
      : "";
    await ctx.runMutation(internal.functions.chat.sendMessage, {
      dmOrChannelId,
      value,
      user,
    });
  },
});

export const getMessages = internalQuery({
  args: {
    dmOrChannelId: v.union(v.id("directMessages"), v.id("channels")),
  },
  handler: async (ctx, { dmOrChannelId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_dmOrChannelId", (q) =>
        q.eq("dmOrChannelId", dmOrChannelId)
      )
      .collect();
  },
});

export const sendMessage = internalMutation({
  args: {
    dmOrChannelId: v.union(v.id("directMessages"), v.id("channels")),
    value: v.string(),
    user: v.id("users"),
  },
  handler: async (ctx, { dmOrChannelId, value, user }) => {
    await ctx.db.insert("messages", {
      content: value,
      dmOrChannelId,
      sender: user,
      ai: true,
    });
  },
});
