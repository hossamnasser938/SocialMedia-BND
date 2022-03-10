import { generate } from "otp-generator";
import { OTP_LENGTH } from "../../utils/constants";

export const generateRandomVerificationCode = () => {
  const otpLength = OTP_LENGTH;
  const options = {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  };

  return generate(otpLength, options);
};
