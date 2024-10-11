"use client";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import React, { useState } from "react";
const PasswordStrength = () => {
  const [password, setPassword] = useState<string>("");
  const [progressValue, setProgressValue] = useState<number>(0);

  function containsSpecialChar(password: string): boolean {
    // Define a regular expression for special characters
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharPattern.test(password);
  }
  function calculateStrength(password: string): number {
    let strength = 0;

    if (password.length >= 6) strength += 33;
    if (/[A-Z]/.test(password)) strength += 33;
    if (containsSpecialChar(password)) strength += 34;
    return strength;
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    setProgressValue(calculateStrength(value));
  };

  return (
    <div>
      <Progress color="red-500" value={progressValue} />
      <Input
        value={password}
        onChange={handleInputChange}
        placeholder="Enter Your Password"
      />
      <h1>Your password must conatin</h1>
      <div className="LargerThen6">
        {password.length >= 6 ? (
          <Check size={20} className="text-green-500" />
        ) : (
          <X size={20} className="text-grey-400" />
        )}
        <p
          className={password.length >= 6 ? "text-green-500" : "text-grey-400"}
        >
          Password is at least 6 characters:
        </p>
      </div>

      <div className="UpperCase">
        {/[A-Z]/.test(password) ? (
          <Check size={20} className="text-green-500" />
        ) : (
          <X size={20} className="text-grey-400" />
        )}
        <p
          className={
            /[A-Z]/.test(password) ? "text-green-500" : "text-grey-400"
          }
        >
          Contains one Upper Case Letter
        </p>
      </div>

      <div className="SpecialCharacter">
        {containsSpecialChar(password) ? (
          <Check size={20} className="text-green-500" />
        ) : (
          <X size={20} className="text-grey-400" />
        )}
        <p
          className={
            containsSpecialChar(password) ? "text-green-500" : "text-grey-400"
          }
        >
          Contains one Upper Case Letter
        </p>
      </div>
    </div>
  );
};

export default PasswordStrength;
