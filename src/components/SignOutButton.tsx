import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SignOutButton() {
  const { logout } = useContext(AuthContext);

  return (
    <button className="sign-out" onClick={() => logout()}>
      Sign out
    </button>
  );
}
