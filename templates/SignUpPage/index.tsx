"use client";

import { useState, useMemo } from "react";
import { useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Login from "@/components/Login";
import Field from "@/components/Field";
import { splashImages } from "@/constants/splashImages";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import setUpUserProfile from "./SetupUserProfile";
import Image from "@/components/Image";

const SignUpPage = () => {
  const { colorMode, setColorMode } = useColorMode();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Randomly select an image on component mount
  const selectedImage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * splashImages.length);
    return splashImages[randomIndex];
  }, []);

  const handleCreateAccount = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError(null);

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        const photoURL = user.photoURL || "";

        try {
          await setUpUserProfile(
            user.uid,
            firstName,
            lastName,
            email,
            photoURL
          );
          console.log("User profile set up successfully");
          router.push("/"); // Redirect to home page after successful sign-up
        } catch (profileError) {
          console.error("Error setting up user profile:", profileError);
          setError(
            "An error occurred while setting up your profile. Please try again."
          );
        }
      }
    } catch (createAccountError) {
      console.error("Error during account creation:", createAccountError);
      if (createAccountError instanceof Error) {
        setError(createAccountError.message);
      } else {
        setError(
          "An error occurred during account creation. Please try again."
        );
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const displayName = user?.displayName || "";
      const photoURL = user?.photoURL || "";
      const email = user?.email || "";

      const [firstName, lastName] = displayName.split(" ");

      try {
        await setUpUserProfile(user.uid, firstName, lastName, email, photoURL);
        console.log("User profile set up successfully");
        router.push("/"); // Redirect to home page after successful Google sign-in
      } catch (error) {
        console.error("Error setting up user profile:", error);
        setError(
          "An error occurred while setting up your profile. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setError("An error occurred during Google sign-in. Please try again.");
    }
  };

  return (
    <Login
      title="Sign Up"
      description="Elevate your content with intelligent AI-powered analysis and optimization"
      image={selectedImage}
    >
      <div className="mb-5 text-base-2">Sign up with Google</div>
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
      <form onSubmit={handleCreateAccount}>
        <Field
          className="mb-3"
          placeholder="Enter your first name"
          icon="user-closed-triangle"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Field
          className="mb-3"
          placeholder="Enter your last name"
          icon="signature"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <Field
          className="mb-3"
          placeholder="Enter your email"
          icon="envelope"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          className="mb-6"
          placeholder="Enter your password"
          icon="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn-primary w-full mb-3" type="submit">
          Create Account & Start Review
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="text-caption-1 text-theme-secondary">
        By signing up, you agree to the{" "}
        <Link
          className="text-theme-primary transition-colors hover:text-primary-1"
          href="https://www.cvs.com/retail/help/terms_of_use"
        >
          Terms of Use
        </Link>
        ,{" "}
        <Link
          className="text-theme-primary transition-colors hover:text-primary-1"
          href="https://www.cvs.com/retail/help/privacy_policy"
        >
          Privacy Notice
        </Link>
        , and{" "}
        <Link
          className="text-theme-primary transition-colors hover:text-primary-1"
          href="https://www.cvs.com/retail/help/privacy_policy#sec8"
        >
          Cookie Notice
        </Link>
        .
      </div>
    </Login>
  );
};

export default SignUpPage;
