import { generate } from "otp-generator";

export const generateRandomVerificationCode = () => {
  const otpLength = process.env.OTP_LENGTH;
  const options = {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  };

  return generate(otpLength, options);
};
