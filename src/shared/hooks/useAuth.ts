import { useState, useEffect } from "react";
import { 
  signInAnonymously, 
  onAuthStateChanged, 
  User,
  signOut as firebaseSignOut 
} from "firebase/auth";
import { auth } from "../firebase/firebaseClient";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
          setError(null);
        } else {
          // No user, try to sign in anonymously
          try {
            setLoading(true);
            const result = await signInAnonymously(auth);
            setUser(result.user);
            setError(null);
          } catch (err: any) {
            console.error("Anonymous sign-in error:", err);
            setError(err.message || "Failed to sign in anonymously");
            setUser(null);
          } finally {
            setLoading(false);
          }
        }
      },
      (err) => {
        console.error("Auth state change error:", err);
        setError(err.message || "Authentication error");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      console.error("Sign out error:", err);
      setError(err.message || "Failed to sign out");
    }
  };

  return {
    user,
    loading,
    error,
    signOut,
  };
}
