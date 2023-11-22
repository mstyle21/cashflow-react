import { createContext } from "react";
import { IUser } from "../hooks/useAuth";

type AuthContext = {
  user: IUser | null;
  loginRedirect: string | null;
  login: (token: string) => void;
  logout: (redirectPath?: string) => void;
};
export const AuthContext = createContext<AuthContext>({
  user: null,
  loginRedirect: null,
  login: () => {},
  logout: () => {},
});
