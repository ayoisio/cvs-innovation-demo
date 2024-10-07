import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    completedOnboarding: boolean;
    lastUpdated: any;
    photoURL?: string;
}

async function setUpUserProfile(
    userID: string,
    firstName: string,
    lastName: string,
    email: string,
    photoURL?: string | null
): Promise<void> {
    // Provide default values for firstName and lastName if they are undefined
    firstName = firstName || "First";
    lastName = lastName || "Last";

    // Get a Firestore instance
    const db = getFirestore();
    const userRef = doc(db, "users", userID);

    // Check if the profile already exists
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        console.log("User profile already exists.");
        return;
    }

    // Prepare the profile data
    const profileData: ProfileData = {
        firstName,
        lastName,
        email,
        completedOnboarding: false,
        lastUpdated: serverTimestamp(),
    };

    if (photoURL) {
        profileData.photoURL = photoURL;
    }

    try {
        // Add or merge profile data to the user document
        await setDoc(userRef, profileData, { merge: true });

        // Optionally, update the display name of the Firebase auth user
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`,
            });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Error setting up user profile: ${error.message}`);
        } else {
            throw new Error("Error setting up user profile: unknown error");
        }
    }
}

export default setUpUserProfile;
