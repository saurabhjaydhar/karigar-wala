import { redis } from "../../utils/redis";

const OTP_TTL_SECONDS = 5 * 60;
const MAX_ATTEMPTS = 5;

const otpKey = (phone: string) => `otp:${phone}`;
const attemptsKey = (phone: string) => `otp:${phone}:attempts`;

export const otpRepository = {
  maxAttempts: MAX_ATTEMPTS,

  async save(phone: string, code: string) {
    await redis.set(otpKey(phone), code, "EX", OTP_TTL_SECONDS);
    await redis.set(attemptsKey(phone), "0", "EX", OTP_TTL_SECONDS);
  },

  getCode(phone: string) {
    return redis.get(otpKey(phone));
  },

  async getAttempts(phone: string) {
    const value = await redis.get(attemptsKey(phone));
    return value ? Number(value) : 0;
  },

  incrementAttempts(phone: string) {
    return redis.incr(attemptsKey(phone));
  },

  clear(phone: string) {
    return redis.del(otpKey(phone), attemptsKey(phone));
  },
};
