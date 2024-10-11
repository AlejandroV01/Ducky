"use client";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import React, { useState } from "react";
const PasswordStrength = () => {
  const [password, setPassword] = useState<string>("");
  const [progressValue, setProgressValue] = useState<number>(0);

  function containsSpecialChar(password: string): boolean {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharPattern.test(password);
  }
  function calculateStrength(password: string): number {
    let strength = 0;

    if (password.length >= 6) strength += 33;
    if (/[0-9]/.test(password)) strength += 33;
    if (containsSpecialChar(password)) strength += 34;
    return strength;
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    setProgressValue(calculateStrength(value));
  };
  function strengthLevel(strength: number): {
    level: string;
    textColor: string;
  } {
    if (strength < 33) {
      return { level: "Weak", textColor: "text-red-500" };
    } else if (strength < 66) {
      return { level: "Moderate", textColor: "text-yellow-500" };
    } else {
      return { level: "Strong", textColor: "text-green-500" };
    }
  }
  const { level, textColor } = strengthLevel(progressValue);

  return (
    <div>
      <Progress className="[&>*]:bg-[#8B6ED4]" value={progressValue} />
      <Input
        value={password}
        onChange={handleInputChange}
        placeholder="Enter Your Password"
      />
      <h1 className={`md:font-bold ${textColor}`}>
        Password Strength: {level}
      </h1>
      <h1 className="md:font-bold">Your password must conatin</h1>
      <div className="flex">
        {password.length >= 6 ? (
          <Check size={20} className="text-green-500" />
        ) : (
          <X size={20} className="text-neutral-700" />
        )}
        <p
          className={
            password.length >= 6 ? "text-green-500" : "text-neutral-700"
          }
        >
          Password is at least 6 characters:
        </p>
      </div>

      <div className="flex">
        {/[0-9]/.test(password) ? (
          <Check size={20} className="text-green-500" />
        ) : (
          <X size={20} className="text-neutral-700" />
        )}
        <p
          className={
            /[0-9]/.test(password) ? "text-green-500" : "text-neutral-700"
          }
        >
          Contains one Number
        </p>
      </div>

      <div className="flex">
        {containsSpecialChar(password) ? (
          <Check size={20} className="text-green-500" />
        ) : (
          <X size={20} className="text-neutral-700" />
        )}
        <p
          className={
            containsSpecialChar(password)
              ? "text-green-500"
              : "text-neutral-700"
          }
        >
          Contains one Upper Case Letter
        </p>
      </div>
    </div>
  );
};

export default PasswordStrength;
