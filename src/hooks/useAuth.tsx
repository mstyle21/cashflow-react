import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

const TOKEN_KEY = "user_token";

export interface IUser {
  id: number;
  email: string;
  token: string;
  role: string;
}

type TTokenPayload = {
  userId: number;
  email: string;
  role: string;
  date: Date;
  exp: number;
};

export type TTokenStatus = "valid" | "expired" | "expire-soon";

/**
 * Decode the token and split it to get the payload data
 * @param token
 * @returns TTokenPayload
 */
const getTokenPayload = (token: string): TTokenPayload => {
  return JSON.parse(atob(token.split(".")[1]));
};

/**
 * Get user details from token
 * @param token
 * @returns IUser
 */
const getUserFromToken = (token: string): IUser => {
  const tokenPayload = getTokenPayload(token);
  return {
    id: tokenPayload.userId,
    email: tokenPayload.email,
    token: token,
    role: tokenPayload.role,
  };
};

export const useAuth = () => {
  const { getItem, setItem, removeItem } = useLocalStorage();
  const [user, setUser] = useState<IUser | null>(() => {
    const token = getItem(TOKEN_KEY);

    if (token) {
      return getUserFromToken(token);
    }

    return null;
  });
  const [loginRedirect, setLoginRedirect] = useState<string | null>(null);

  const login = (token: string): void => {
    const user = getUserFromToken(token);
    setUser(user);
    setItem(TOKEN_KEY, token);
  };

  const logout = (redirectPath: string | null = null): void => {
    setLoginRedirect(redirectPath);

    setUser(null);
    removeItem(TOKEN_KEY);
  };

  const getTokenStatus = (): TTokenStatus => {
    if (!user || !user.token) {
      return "expired";
    }
    const tokenPayload = getTokenPayload(user.token);

    const now = Math.floor(Date.now() / 1000);

    if (now > tokenPayload.exp) {
      return "expired";
    }

    //if expire time is within 10 minutes (600 seconds), refresh token
    if (now < tokenPayload.exp && now + 6000 > tokenPayload.exp) {
      return "expire-soon";
    }

    return "valid";
  };

  return { user, loginRedirect, login, logout, getTokenStatus };
};
