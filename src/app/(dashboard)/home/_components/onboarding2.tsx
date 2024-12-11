"use client";

import { useState } from "react";
import { toast } from "sonner";
import Step1 from "./onboarding-components/Step1";
import Step2 from "./onboarding-components/Step2";
import Step3 from "./onboarding-components/Step3";
import Step4 from "./onboarding-components/Step4";
import { FormData } from "./onboarding-components/types";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export default function Onboarding({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const onboard = useMutation(api.functions.user.onboard);
  const [formData, setFormData] = useState<FormData>({
    sex: "",
    age: "",
    weight: "70",
    height: "170",
    activityLevel: "",
    fitnessGoals: "",
    healthIssues: "",
    availability: [],
  });
  const createServer = useMutation(api.functions.server.create);
  const setServer = useMutation(api.functions.user.setServer);

  const steps: JSX.Element[] = [
    <Step1 key="step1" formData={formData} setFormData={setFormData} />,
    <Step2 key="step2" formData={formData} setFormData={setFormData} />,
    <Step3 key="step3" formData={formData} setFormData={setFormData} />,
    <Step4 key="step4" formData={formData} setFormData={setFormData} />,
  ];

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
      const { serverId } = await createServer({
        name: "trAIner",
      });
      await setServer({ server: serverId });

      toast.success("Onboarding completed successfully!");
    } catch (error) {
      toast.error("Failed to onboard", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      await createOnboarding(formData);
      onClose();
    } catch (error) {
      toast.error("Failed to onboard", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Onboarding</h1>
        <p className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        {steps[currentStep]}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className={`px-4 py-2 rounded-md ${
            currentStep === steps.length - 1
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white transition-colors`}
        >
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
