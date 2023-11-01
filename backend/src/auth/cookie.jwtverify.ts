import { JwtService } from "@nestjs/jwt";
import { Handshake } from "socket.io/dist/socket";

const jwtService = new JwtService;
export function getTokenFromWsHandshake(handshake: Handshake) {
  const cookies = handshake.headers.cookie?.split(';').map((cook) => cook.trim());
  const tokenstr = cookies?.find((cookie) => cookie.startsWith('token='));
  if (tokenstr) {
    return tokenstr.split('=')[1];
  }
  return null;
}

export async function verifyJwtFromHandshake(handshake: Handshake): Promise<number | null> {
  const token = getTokenFromWsHandshake(handshake);
  if (!token)
    return null;
  let payload: any;
  try {
    payload = await jwtService.verifyAsync(token,{secret: process.env.JWT_SECRET});
    if (payload.verified === false)
      return null;
  } catch (error) {
    return null;
    // throw new UnauthorizedException();
  }
  return payload.id;
}