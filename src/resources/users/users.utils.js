const convertFromMSToMinutes = (ms) => {
  return ms / 1000 / 60;
};

export const isCodeExpired = (codeCreatedAt) => {
  const otpCreatedSinceMS = new Date() - codeCreatedAt;
  const otpCreatedSinceMinutes = convertFromMSToMinutes(otpCreatedSinceMS);
  return otpCreatedSinceMinutes >= process.env.OTP_EXPIRATION_TIME_IN_MINUTES;
};
