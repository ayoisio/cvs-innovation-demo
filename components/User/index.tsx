import React, { useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import Switch from "@/components/Switch";
import NavLink from "./NavLink";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

type UserProps = {
  className?: string;
};

const User: React.FC<UserProps> = ({ className }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isLightMode = colorMode === "light";
  const router = useRouter();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    photoURL: "/images/light-blue-circle.png",
  });

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: user.email || "",
            photoURL: data.photoURL || "/images/light-blue-circle.png",
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      router.push("/sign-in"); // Redirect to sign-in page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Menu as="div" className={`relative ${className || ""}`}>
      {({ open }) => (
        <>
          <Menu.Button className="group">
            <Image
              className="w-12 h-12 rounded-full opacity-100"
              src={userData.photoURL}
              width={48}
              height={48}
              alt="User avatar"
            />
          </Menu.Button>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items
              static
              className="absolute top-full -right-4 w-[19.75rem] mt-2 p-3 rounded-2xl border border-theme-stroke bg-theme-surface-pure shadow-depth-1 lg:right-0"
            >
              <div className="flex items-center mb-2 p-3 rounded-xl bg-theme-n-8">
                <Image
                  className="w-16 h-16 rounded-full opacity-100"
                  src={userData.photoURL}
                  width={64}
                  height={64}
                  alt="User avatar"
                />
                <div className="grow pl-4.5">
                  <div className="text-title-1s">{`${userData.firstName} ${userData.lastName}`}</div>
                  <div className="text-body-1m text-theme-secondary">
                    {userData.email}
                  </div>
                </div>
              </div>

              <div className="mb-2 space-y-1">
                <div className="group flex items-center h-12 px-4 rounded-xl transition-colors hover:bg-theme-on-surface-2">
                  <Icon
                    className="shrink-0 mr-4 fill-theme-secondary transition-colors group-hover:fill-theme-primary"
                    name={isLightMode ? "moon" : "sun"}
                  />
                  <div className="mr-auto text-base-1s text-theme-secondary transition-colors group-hover:text-theme-primary">
                    {isLightMode ? "Dark" : "Light"}
                  </div>
                  <Switch
                    value={colorMode === "dark"}
                    setValue={() => toggleColorMode()}
                    small
                    theme
                  />
                </div>
                <NavLink
                  title="News"
                  icon="news"
                  url="https://www.cvshealth.com/news/press-releases.html"
                  openInNewTab={true}
                />
              </div>

              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`flex items-center w-full h-12 px-4 rounded-xl transition-colors ${
                      active ? "bg-theme-on-surface-2" : ""
                    }`}
                    onClick={handleLogout}
                  >
                    <Icon
                      className="shrink-0 mr-4 fill-theme-secondary transition-colors group-hover:fill-theme-primary"
                      name="logout"
                    />
                    <div className="mr-auto text-base-1s text-theme-secondary transition-colors group-hover:text-theme-primary">
                      Log out
                    </div>
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default User;
