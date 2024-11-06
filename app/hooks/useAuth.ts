"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

interface AuthState {
  user: User | null;
  loading: boolean;
}

/**
 * Custom hook for handling Firebase authentication state and navigation
 *
 * This hook provides:
 * - Real-time authentication state monitoring
 * - Automatic navigation based on auth state
 * - Loading state for auth-dependent UI
 *
 * @returns {AuthState} Authentication state object containing user and loading status
 */
export const useAuth = (): AuthState => {
  // State for storing the current user
  const [user, setUser] = useState<User | null>(null);

  // State for tracking the loading status of auth state
  const [loading, setLoading] = useState<boolean>(true);

  // Next.js router for programmatic navigation
  const router = useRouter();

  useEffect(() => {
    // Get Firebase auth instance
    const auth = getAuth();

    // Set up real-time listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
        // Redirect to sign-in page when user is not authenticated
        router.push("/sign-in");
      }

      // Authentication state has been determined, so we're no longer loading
      setLoading(false);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [router]); // Re-run effect if router changes

  // Return authentication state and loading status
  return { user, loading };
};
