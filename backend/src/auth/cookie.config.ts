import { CookieOptions } from "express";

export const cookieConfig: CookieOptions = {
  maxAge: 3600000,
  httpOnly: true,
  domain: 'localhost',
  sameSite: 'lax',
  secure: true
}