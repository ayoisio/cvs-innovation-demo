import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useAuth } from "app/hooks/useAuth";

type LayoutProps = {
  title: string;
  children: React.ReactNode;
  requireAuth?: boolean;
  showTitle?: boolean;
  showNavActionButton?: boolean;
  onNavActionButtonClick?: () => void;
  navActionButtonText?: string;
};

const Layout = ({
  title,
  children,
  requireAuth = true,
  showTitle = true,
  showNavActionButton = true,
  onNavActionButtonClick,
  navActionButtonText = "Start",
}: LayoutProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router, requireAuth]);

  if (requireAuth && !user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header
        title={title}
        onClickBurger={() => setShowMenu(!showMenu)}
        showMenu={showMenu}
        showTitle={showTitle}
        showNavActionButton={showNavActionButton}
        onNavActionButtonClick={onNavActionButtonClick}
        navActionButtonText={navActionButtonText}
      />
      <div className="max-w-[80rem] mx-auto px-10 lg:px-6 md:px-4">
        <div className="pt-24 md:pt-20 pb-10 md:pb-8">
          {title && (
            <div className="hidden md:flex items-center h-16 mb-2 px-4 bg-theme-on-surface-1 rounded-2xl text-h5 w-full">
              {title}
            </div>
          )}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
