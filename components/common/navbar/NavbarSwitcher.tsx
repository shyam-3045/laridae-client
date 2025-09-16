"use client";

import { usePathname } from "next/navigation";
import HomeNavbar from "./HomeNavbar";
import DefaultNavbar from "./DefaultNavbar";


export default function NavbarSwitcher() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return isHome ? <HomeNavbar /> : <DefaultNavbar />;
}
