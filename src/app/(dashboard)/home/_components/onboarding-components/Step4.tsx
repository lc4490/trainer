import React from "react";
import { FormData } from "./types"; // Adjust the path as needed

interface Step4Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Step4: React.FC<Step4Props> = ({ formData, setFormData }) => {
  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day) // Remove day if already selected
        : [...prev.availability, day], // Add day if not selected
    }));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Your Availability</h2>
      <p>Select the days you are available to work out:</p>
      <div className="grid grid-cols-7 gap-2 mt-4">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className={`p-2 rounded-md ${
              formData.availability.includes(day)
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step4;
