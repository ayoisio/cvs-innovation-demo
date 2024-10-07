"use client";
import React, { useState, useMemo, ChangeEvent } from "react";
import { useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Login from "@/components/Login";
import Field from "@/components/Field";
import { splashImages } from "@/constants/splashImages";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import Image from "@/components/Image";

const SignInPage = () => {
  const { colorMode } = useColorMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Randomly select an image on component mount
  const selectedImage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * splashImages.length);
    return splashImages[randomIndex];
  }, []);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign-in successful");
      router.push("/"); // Redirect to home page after successful sign-in
    } catch (signInError) {
      console.error("Error during sign-in:", signInError);
      if (signInError instanceof Error) {
        setError(signInError.message);
      } else {
        setError("An error occurred during sign-in. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      await signInWithPopup(auth, provider);
      console.log("Google sign-in successful");
      router.push("/"); // Redirect to home page after successful Google sign-in
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during Google sign-in. Please try again.");
      }
    }
  };

  const handleEmailChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(e.target.value);
  };

  return (
    <Login
      title="AI-Powered Content Review"
      description="Enhance content quality with intelligent AI-driven analysis."
      image={selectedImage}
      signIn
    >
      <div className="mb-5 text-base-2">Sign in with Google</div>
      <div className="flex mb-8 pb-8 border-b-2 border-theme-stroke space-x-2">
        <button
          className="btn-stroke flex-1 rounded-xl"
          onClick={handleGoogleSignIn}
        >
          <Image src="/images/google.svg" width={24} height={24} alt="" />
          <span className="ml-4">Continue with Google</span>
        </button>
      </div>
      <div className="mb-5 text-base-2">Or continue with email address</div>
      <form onSubmit={handleSignIn}>
        <Field
          className="mb-3"
          placeholder="Enter your email"
          icon="envelope"
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <Field
          className="mb-3"
          placeholder="Enter your password"
          icon="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <button className="btn-primary w-full mb-3" type="submit">
          Start content review
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </Login>
  );
};

export default SignInPage;
