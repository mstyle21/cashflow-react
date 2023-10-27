import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SignOutButton() {
  const { logout } = useContext(AuthContext);

  return <button onClick={() => logout()}>Sign out</button>;
}
