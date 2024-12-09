import React from "react";
import { FormData } from "./types";

interface Step2Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Step2: React.FC<Step2Props> = ({ formData, setFormData }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Your Physical Metrics</h2>
      <div className="flex flex-col gap-4">
        {/* Weight */}
        <div>
          <label htmlFor="weight" className="block mb-1">
            Weight (kg)
          </label>
          <input
            id="weight"
            type="range"
            min="40"
            max="150"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className="w-full"
          />
          <p className="text-sm text-gray-600">{formData.weight} kg</p>
        </div>

        {/* Height */}
        <div>
          <label htmlFor="height" className="block mb-1">
            Height (cm)
          </label>
          <input
            id="height"
            type="range"
            min="140"
            max="220"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            className="w-full"
          />
          <p className="text-sm text-gray-600">{formData.height} cm</p>
        </div>
      </div>
    </div>
  );
};

export default Step2;
