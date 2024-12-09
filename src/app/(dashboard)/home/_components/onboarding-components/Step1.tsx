import React from "react";
import { FormData } from "./types";

interface Step1Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Step1: React.FC<Step1Props> = ({ formData, setFormData }) => {
  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Tell us about yourself</h2>
      <div className="flex flex-col gap-4">
        {/* Sex */}
        <div>
          <label className="block mb-1">Sex</label>
          <select
            value={formData.sex}
            onChange={(e) => handleSelectChange("sex", e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Step1;
