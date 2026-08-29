import bcrypt from "bcryptjs";
import { SendOtpInput, VerifyOtpInput, AdminLoginInput } from "@karigar-wala/shared";
import { HttpError } from "../../utils/http-error";
import { signAccessToken, signRefreshToken, verifyRefreshToken, signAdminAccessToken } from "../../utils/jwt";
import { otpRepository } from "./otp.repository";
import { usersRepository } from "../users/users.repository";
import { smsQueue } from "../../jobs/queues";
import { adminRepository } from "./admin.repository";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const authService = {
  async sendOtp({ phone }: SendOtpInput) {
    const code = generateOtp();
    await otpRepository.save(phone, code);
    // Queued (not sent inline) so a slow/down SMS provider can't block the
    // request, and BullMQ retries transient failures automatically.
    await smsQueue.add(
      "otp",
      { phone, otp: code },
      { attempts: 3, backoff: { type: "exponential", delay: 2000 } },
    );
    return { message: "OTP sent" };
  },

  async verifyOtp({ phone, otp }: VerifyOtpInput) {
    const attempts = await otpRepository.getAttempts(phone);
    if (attempts >= otpRepository.maxAttempts) {
      await otpRepository.clear(phone);
      throw new HttpError(429, "Too many incorrect attempts, request a new OTP");
    }

    const storedCode = await otpRepository.getCode(phone);
    if (!storedCode) {
      throw new HttpError(400, "OTP expired or not requested");
    }

    if (storedCode !== otp) {
      await otpRepository.incrementAttempts(phone);
      throw new HttpError(400, "Incorrect OTP");
    }

    await otpRepository.clear(phone);

    // Lazy auth: verifying the OTP either logs an existing user in or creates
    // a new one on the spot (memberSince = now, via the schema default).
    const user = (await usersRepository.findByPhone(phone)) ?? (await usersRepository.create(phone));

    const accessToken = signAccessToken({ id: user.id, phone: user.phone });
    const refreshToken = signRefreshToken({ id: user.id });

    return { user, accessToken, refreshToken };
  },

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) throw new HttpError(401, "No refresh token");

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new HttpError(401, "Invalid or expired refresh token");
    }

    const user = await usersRepository.findById(payload.id);
    if (!user) throw new HttpError(401, "User no longer exists");

    return { accessToken: signAccessToken({ id: user.id, phone: user.phone }) };
  },

  async adminLogin({ email, password }: AdminLoginInput) {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) throw new HttpError(401, "Invalid email or password");

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatches) throw new HttpError(401, "Invalid email or password");

    const accessToken = signAdminAccessToken({ id: admin.id, role: admin.role });
    return {
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      accessToken,
    };
  },

  async getAdminMe(id: string) {
    const admin = await adminRepository.findById(id);
    if (!admin) throw new HttpError(401, "Admin no longer exists");
    return { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
  },
};
