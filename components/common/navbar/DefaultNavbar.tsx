"use client";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/store/userStore";
import { ShoppingCart, Menu } from "lucide-react";
import { toastSuccess } from "@/utils/toast";
import { useState } from "react";

export default function DefaultNavbar() {
  const { logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toastSuccess("Successfully Logged Out ");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/favicon.ico" alt="Logo" width={40} height={40} />
          <span className="font-bold text-lg text-[#eac90b]">
            <Link href="/">Laridae</Link>
          </span>
        </div>

        {/* Desktop Menu (only visible md and above) */}
        <div className="hidden md:flex gap-10 text-black">
          {["Home", "Shop", "B2B","FlavoredTeas", "Contact"].map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase() === "home" ? "" : label.toLowerCase()}`}
              className="hover:text-[#eac90b]"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <ShoppingCart />
          </Link>

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
              <DropdownMenuItem>
                <Link href="/orders">View Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={handleLogout}>Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Hamburger (only visible below md) */}
          <button
            className="block md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <Menu />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown (only below md) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-4 py-3 space-y-2">
          {["Home", "Shop", "B2B", "Contact"].map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase() === "home" ? "" : label.toLowerCase()}`}
              className="block py-2 hover:text-[#eac90b]"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
