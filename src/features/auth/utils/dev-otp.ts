export const isDevOtpEnabled = () =>
  process.env.NODE_ENV !== "production" &&
  process.env.ENABLE_DEV_OTP === "true";
