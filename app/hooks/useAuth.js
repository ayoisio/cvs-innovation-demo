"use client";

// Import necessary dependencies
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

/**
 * Custom hook for handling Firebase authentication state and navigation
 * 
 * This hook provides:
 * - Real-time authentication state monitoring
 * - Automatic navigation based on auth state
 * - Loading state for auth-dependent UI
 * 
 * @returns {Object} Authentication state object
 * @returns {Object} user - The current Firebase user object or null if not authenticated
 * @returns {boolean} loading - Indicates whether the auth state is still being determined
 */
export const useAuth = () => {
  // State for storing the current user
  const [user, setUser] = useState(null);
  
  // State for tracking the loading status of auth state
  const [loading, setLoading] = useState(true);
  
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
        router.push('/sign-in');
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