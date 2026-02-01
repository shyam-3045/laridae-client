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
import { useCartStore } from "@/store/cartStore";
import { Plus_Jakarta_Sans } from "next/font/google";

const navFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600"],
});
export default function DefaultNavbar() {
  const { logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const { openCart } = useCartStore()
  


  const handleLogout = () => {
    logout();
    toastSuccess("Successfully Logged Out ");
  };

 
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={125} height={100} />
        </div>

        <div className={`hidden md:flex gap-10 text-black ${navFont.className}`}>
          {["Home", "Shop", "Contact"].map((label) => (
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
          <button onClick={openCart}>
            <ShoppingCart />
          </button>
          

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="/avatar.png" />
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
        <div className={`md:hidden bg-white border-t shadow-md px-4 py-3 space-y-2 ${navFont.className}`}>
          {["Home", "Shop", "Contact"].map((label) => (
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
