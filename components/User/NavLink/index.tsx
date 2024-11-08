import Link from "next/link";
import Icon from "@/components/Icon";

type NavLinkProps = {
  url: string;
  icon: string;
  title: string;
  openInNewTab?: boolean; // New optional prop
};

const NavLink = ({ url, icon, title, openInNewTab = false }: NavLinkProps) => (
  <Link
    className="group flex items-center h-12 px-4 rounded-xl text-base-1s text-theme-secondary transition-colors hover:bg-theme-on-surface-2 hover:text-theme-primary"
    href={url}
    target={openInNewTab ? "_blank" : undefined}
    rel={openInNewTab ? "noopener noreferrer" : undefined}
  >
    <Icon
      className="shrink-0 mr-4 fill-theme-secondary transition-colors group-hover:fill-theme-primary"
      name={icon}
    />
    {title}
  </Link>
);

export default NavLink;
