"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useImageUpload } from "@/hooks/use-image-upload";
import { SignOutButton } from "@clerk/nextjs";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";

export function ProfilePage() {
  const user = useQuery(api.functions.user.get);
  const onboard = useMutation(api.functions.user.onboard);
  const imageUpload = useImageUpload();
  const addProfilePic = useMutation(api.functions.user.addProfilePicture);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFormData({
      sex: user?.sex || "",
      age: user?.age || "",
      weight: user?.weight || "",
      height: user?.height || "",
      activityLevel: user?.activity || "",
      fitnessGoals: user?.goals || "",
      healthIssues: user?.issues || "",
      availability: user?.availability || [],
    });
    imageUpload.reset();
  }, [open]);

  const [formData, setFormData] = useState<{
    sex: string;
    age: string;
    weight: string;
    height: string;
    activityLevel: string;
    fitnessGoals: string;
    healthIssues: string;
    availability: string[];
  }>({
    sex: user?.sex || "",
    age: user?.age || "",
    weight: user?.weight || "",
    height: user?.height || "",
    activityLevel: user?.activity || "",
    fitnessGoals: user?.goals || "",
    healthIssues: user?.issues || "",
    availability: user?.availability || [],
  });

  const createOnboarding = async (formData: {
    sex?: string | undefined;
    age?: string | undefined;
    weight?: string | undefined;
    height?: string | undefined;
    availability?: Array<string> | undefined;
    activityLevel?: string | undefined;
    fitnessGoals?: string | undefined;
    healthIssues?: string | undefined;
  }) => {
    try {
      await onboard(formData);
    } catch (error) {
      toast.error("Failed to onboard", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createOnboarding(formData);
      await addProfilePic({ profilePicture: imageUpload.storageId });
      imageUpload.reset();
      setOpen(false);
      toast.success("Updated successfully!");
    } catch (error) {
      toast.error("Failed to create onboarding", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Always keep the value as a string
    }));
  };

  const handleSelectChange = (
    field: keyof typeof formData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Avatar className="size-12 rounded-full overflow-hidden">
            <AvatarImage
              src={user?.image}
              className="w-full h-full object-cover"
            />
            <AvatarFallback>{user?.username[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form className="contents" onSubmit={handleSubmit}>
          <div className="flex flex-row justify-center p-2">
            <Button
              type="button"
              size="icon"
              className="p-5"
              onClick={() => {
                imageUpload.open();
              }}
            >
              <Avatar className="w-20 h-20 rounded-full overflow-hidden">
                <AvatarImage
                  src={
                    imageUpload.previewUrl
                      ? imageUpload.previewUrl
                      : user?.image
                  }
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>{user?.username[0]}</AvatarFallback>
              </Avatar>
            </Button>
            <input {...imageUpload.inputProps} />
          </div>

          {/* Sex */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="sex">Sex</Label>
            <Select
              value={formData.sex}
              onValueChange={(value) => handleSelectChange("sex", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
            />
          </div>

          {/* Weight */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
            />
          </div>

          {/* Height */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
            />
          </div>

          {/* Activity Level */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="activity-level">
              Current Physical Activity Level
            </Label>
            <Select
              value={formData.activityLevel}
              onValueChange={(value) =>
                handleSelectChange("activityLevel", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="lightly-active">Lightly active</SelectItem>
                <SelectItem value="moderately-active">
                  Moderately active
                </SelectItem>
                <SelectItem value="very-active">Very active</SelectItem>
                <SelectItem value="extremely-active">
                  Extremely active
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fitness Goals */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="fitness-goals">Fitness Goals</Label>
            <Select
              value={formData.fitnessGoals}
              onValueChange={(value) =>
                handleSelectChange("fitnessGoals", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fitness goals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose-weight">Lose weight</SelectItem>
                <SelectItem value="gain-muscle">Gain muscle</SelectItem>
                <SelectItem value="increase-endurance">
                  Increase endurance
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Health Issues */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="health-issues">Pre-existing Health Issues</Label>
            <Input
              id="health-issues"
              name="healthIssues" // Match the name with the key in formData
              value={formData.healthIssues} // Bind the value to formData.healthIssues
              onChange={handleInputChange} // Use handleInputChange for state updates
              placeholder="Enter any health issues or type 'None'"
            />
          </div>

          {/* Availability */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="availability">
              What days are you available to work out?
            </Label>
            <div className="flex flex-wrap gap-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={day}
                    name="availability"
                    value={day}
                    checked={formData.availability.includes(day)}
                    onChange={(event) => {
                      const { value, checked } = event.target;
                      setFormData((prev) => {
                        const updatedAvailability = checked
                          ? [...prev.availability, value] // Add day if checked
                          : prev.availability.filter((d) => d !== value); // Remove day if unchecked
                        return { ...prev, availability: updatedAvailability };
                      });
                    }}
                    className="checkbox" // Optional: Tailwind class for styling
                  />
                  <Label htmlFor={day}>{day}</Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <SignOutButton>
              <Button type="button" variant="outline">
                Sign Out
              </Button>
            </SignOutButton>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
