import { CookieOptions } from "express";

export const cookieConfig: CookieOptions = {
  maxAge: 3600000,
  httpOnly: true,
  domain: `${process.env.HOST_NAME}`,
  sameSite: 'lax',
  secure: true
}