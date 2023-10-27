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

const getTokenPayload = (token: string): TTokenPayload => {
  return JSON.parse(atob(token.split(".")[1]));
};

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

  const login = (token: string) => {
    const user = getUserFromToken(token);
    setUser(user);
    setItem(TOKEN_KEY, token);

    // const tokenPayload = getTokenPayload(user.token);
    // const expiration = tokenPayload.exp * 1000 - Date.now();
    // setTimeout(() => {
    //   logout();
    // }, expiration);
  };

  const logout = (redirectPath: string | null = null) => {
    setLoginRedirect(redirectPath);

    setUser(null);
    removeItem(TOKEN_KEY);
  };

  const isTokenValid = (): boolean => {
    if (!user || !user.token) {
      return false;
    }
    const tokenPayload = getTokenPayload(user.token);
    const isTokenExpired = tokenPayload.exp * 1000 < Date.now();

    if (isTokenExpired) {
      return false;
    }

    return true;
  };

  return { user, loginRedirect, login, logout, isTokenValid };
};
