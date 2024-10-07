import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import User from "@/components/User";
import Image from "@/components/Image";

type HeaderProps = {
  title: string;
  visible?: boolean;
  showMenu?: boolean;
  onClickBurger?: () => void;
  showTitle?: boolean;
  showNavActionButton?: boolean;
  onNavActionButtonClick?: () => void;
  navActionButtonText?: string;
};

const Header = ({
  title,
  visible,
  showMenu,
  onClickBurger,
  showTitle = true,
  showNavActionButton = false,
  onNavActionButtonClick,
  navActionButtonText = "Start",
}: HeaderProps) => {
  const router = useRouter();
  const [visibleModalSearch, setVisibleModalSearch] = useState<boolean>(false);
  const [visibleModalTrade, setVisibleModalTrade] = useState<boolean>(false);
  const { colorMode } = useColorMode();

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-10 bg-theme-n-8 md:z-30 md:transition-colors ${
          showMenu ? "md:!bg-theme-on-surface-1" : ""
        }`}
      >
        <div className="mx-auto px-10">
          <div
            className={`flex items-center justify-between h-24 md:h-16 md:bg-theme-on-surface-1 md:rounded-2xl md:transition-shadow ${
              showMenu
                ? "shadow-depth-1 dark:shadow-[inset_0_0_0_0.125rem_#272B30]"
                : ""
            }`}
          >
            <div className="flex items-center">
              <Link className="md:block" href="/">
                <Image
                  className="w-9 opacity-100"
                  src={
                    colorMode === "light"
                      ? "/images/logo-dark.png"
                      : "/images/logo-light.png"
                  }
                  width={36}
                  height={36}
                  alt=""
                />
              </Link>
            </div>

            {showTitle && (
              <div className="flex-grow flex justify-center md:hidden">
                <button
                  className="group inline-flex items-center text-h5"
                  onClick={() => router.back()}
                >
                  <div className="flex justify-center items-center w-10 h-10 mr-3.5 lg:mr-1">
                    <Icon
                      className="fill-theme-primary transition-transform group-hover:-translate-x-0.5"
                      name="arrow-left"
                    />
                  </div>
                  {title}
                </button>
              </div>
            )}

            <div className="flex items-center space-x-6">
              {showNavActionButton && (
                <button
                  className="btn-primary md:hidden"
                  onClick={
                    onNavActionButtonClick || (() => setVisibleModalTrade(true))
                  }
                >
                  {navActionButtonText}
                </button>
              )}
              <button
                className={`hidden rounded-full transition-shadow md:block ${
                  showMenu ? "shadow-[0_0_0_0.125rem_#0C68E9]" : ""
                }`}
                onClick={onClickBurger}
              >
                <Image
                  className="w-8 h-8 object-cover rounded-full opacity-100"
                  src="/images/light-blue-circle.png"
                  width={32}
                  height={32}
                  alt=""
                />
              </button>
              <User className="md:hidden" />
            </div>
          </div>
        </div>
      </div>
      <Modal
        classWrap="max-w-[40rem] !p-0 rounded-3xl overflow-hidden"
        visible={visibleModalSearch}
        onClose={() => setVisibleModalSearch(false)}
      >
        <></>
      </Modal>
      <Modal
        classWrap="p-8 md:!px-4 md:!py-6"
        visible={visibleModalTrade}
        onClose={() => setVisibleModalTrade(false)}
      >
        <></>
      </Modal>
    </>
  );
};

export default Header;
