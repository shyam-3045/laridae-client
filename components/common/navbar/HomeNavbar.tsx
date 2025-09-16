"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  function toCamelCase(str: string) {
    return str
      .replace(/\s(.)/g, (match, group1) => group1.toUpperCase())
      .replace(/\s+/g, "")
      .replace(/^./, (char) => char.toLowerCase());
  }

  const profileLinks = ["View Orders", "Logout"];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 600);   
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full overflow-hidden w-10 h-10 me-3">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <span className="font-bold text-lg text-[#eac90b]">
            <Link href={"/"}>Laridae</Link>
          </span>
        </div>

        <div className="hidden md:flex gap-15">
          {["Home", "Shop", "B2B", "Contact"].map((label) => (
            <Link
              key={label}
              href={`/${
                label.toLowerCase() === "home" ? "" : label.toLowerCase()
              }`}
              className={`${
                scrolled ? "text-black" : "text-[#eac90b]"
              } hover:text-black transition hover:underline-offset-2 font-medium`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex space-x-9 items-center">
          <Link href={"/cart"}>
            <ShoppingCart />
          </Link>

          <div className="mt-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="text-[#eac90b]">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profileLinks.map((item) => (
                  <DropdownMenuItem key={item} className="text-[#eac90b]">
                    <Link
                      href={
                        item === "View Orders" ? "/orders" : toCamelCase(item)
                      }
                    >
                      {item}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
}