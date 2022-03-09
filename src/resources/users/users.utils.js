const NUMBER_MILLISECONDS_IN_SECOND = 1000;
const NUMBER_SECONDS_IN_MINUTE = 60;

const convertFromMSToMinutes = (ms) => {
  return ms / NUMBER_MILLISECONDS_IN_SECOND / NUMBER_SECONDS_IN_MINUTE;
};

export const isCodeExpired = (codeCreatedAt) => {
  const otpCreatedSinceMS = new Date() - codeCreatedAt;
  const otpCreatedSinceMinutes = convertFromMSToMinutes(otpCreatedSinceMS);
  return otpCreatedSinceMinutes >= process.env.OTP_EXPIRATION_TIME_IN_MINUTES;
};
