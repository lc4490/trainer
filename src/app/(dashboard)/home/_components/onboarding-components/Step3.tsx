import React from "react";
import { FormData } from "./types";

interface Step3Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Step3: React.FC<Step3Props> = ({ formData, setFormData }) => {
  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Your Preferences</h2>
      <div className="flex flex-col gap-4">
        {/* Activity Level */}
        <div>
          <label htmlFor="activityLevel" className="block mb-1">
            Physical Activity Level
          </label>
          <select
            id="activityLevel"
            value={formData.activityLevel}
            onChange={(e) =>
              handleSelectChange("activityLevel", e.target.value)
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select activity level</option>
            <option value="sedentary">Sedentary</option>
            <option value="lightly-active">Lightly active</option>
            <option value="moderately-active">Moderately active</option>
            <option value="very-active">Very active</option>
          </select>
        </div>

        {/* Fitness Goals */}
        <div>
          <label htmlFor="fitnessGoals" className="block mb-1">
            Fitness Goals
          </label>
          <select
            id="fitnessGoals"
            value={formData.fitnessGoals}
            onChange={(e) => handleSelectChange("fitnessGoals", e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select fitness goals</option>
            <option value="lose-weight">Lose weight</option>
            <option value="gain-muscle">Gain muscle</option>
            <option value="increase-endurance">Increase endurance</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Step3;
