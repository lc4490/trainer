"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function Onboarding() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState<{
    sex: string;
    age: string;
    weight: string;
    height: string;
    activityLevel: string;
    fitnessGoals: string;
    healthIssues: string[];
    availability: string[];
  }>({
    sex: "",
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
    fitnessGoals: "",
    healthIssues: [],
    availability: [],
  });

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      // Uncomment when using a mutation
      // await createOnboarding(formData);
      toast.success("Onboarding completed successfully!");
      console.log(formData);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create onboarding", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  //   const toggleHealthIssues = (value: string) => {
  //     setFormData((prev) => ({
  //       ...prev,
  //       healthIssues: prev.healthIssues.includes(value)
  //         ? prev.healthIssues.filter((issue) => issue !== value)
  //         : [...prev.healthIssues, value],
  //     }));
  //   };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to trAIner</DialogTitle>
          <DialogDescription>Tell us about yourself.</DialogDescription>
        </DialogHeader>
        <form className="contents" onSubmit={handleSubmit}>
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
              What days are you available for tracking?
            </Label>
            <Select
              value="" // Set to empty since multiple selections won't display as a single string
              onValueChange={(value) => {
                setFormData((prev) => {
                  const updatedAvailability = prev.availability.includes(value)
                    ? prev.availability.filter((day) => day !== value) // Remove if already selected
                    : [...prev.availability, value]; // Add if not selected
                  return { ...prev, availability: updatedAvailability };
                });
              }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    formData.availability.length > 0
                      ? formData.availability.join(", ")
                      : "Select availability"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monday">Monday</SelectItem>
                <SelectItem value="Tuesday">Tuesday</SelectItem>
                <SelectItem value="Wednesday">Wednesday</SelectItem>
                <SelectItem value="Thursday">Thursday</SelectItem>
                <SelectItem value="Friday">Friday</SelectItem>
                <SelectItem value="Saturday">Saturday</SelectItem>
                <SelectItem value="Sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
