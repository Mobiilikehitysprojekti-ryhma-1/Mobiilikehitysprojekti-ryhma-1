import { useAuthSession } from "../../features/auth/state/authSession";
import { logout } from "../../features/auth/state/authActions";

/**
 * Auth hook for the app. Uses the real session (email/password + unlock).
 * Returns user with uid only; admin and other features use user?.uid.
 */
export function useAuth() {
  const { user, unlocked } = useAuthSession();

  return {
    user: user ?? null,
    loading: false,
    error: null,
    signOut: logout,
  };
}
