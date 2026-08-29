import twilio from "twilio";
import { logger } from "../../utils/logger";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendOtpSms(phone: string, otp: string) {
  if (!client || !fromNumber) {
    logger.warn(
      { phone, otp },
      "Twilio not configured (TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_FROM_NUMBER) — logging OTP instead of sending SMS",
    );
    return;
  }

  await client.messages.create({
    to: phone,
    from: fromNumber,
    body: `Your Karigar Saathi verification code is ${otp}. It expires in 5 minutes.`,
  });
}
