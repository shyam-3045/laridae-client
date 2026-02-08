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
import { useRouter } from 'next/navigation';


const navFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function DefaultNavbar() {
  const { logout } = useUser();
   const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { openCart, cart } = useCartStore();

  const handleLogout = () => {
    router.push("/")
    logout();
    toastSuccess("Successfully Logged Out ");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/`} className="hover:text-[#eac90b]">
            <Image src="/logo.png" alt="Logo" width={125} height={100} />
          </Link>
        </div>

        <div className={`hidden md:flex gap-10 text-black ${navFont.className}`}>
          {["Home", "Shop", "Contact","Track Your Order"].map((label) => (
            <Link
              key={label}
              href={`/${
                label.toLowerCase() === "home" ? "" : label.replace(/\s+/g, "").toLowerCase() === "trackyourorder"?"trackyourorder" : label.toLowerCase()
              }`}
              className="hover:text-[#eac90b]"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 relative">
          {/* Cart button with hover tooltip */}
          <div className="relative group">
            <button
              onClick={() => {
                if (cart.length > 0) openCart();
              }}
              aria-label="Cart"
            >
              <ShoppingCart />
            </button>

            {cart.length === 0 && (
              <span
                className="
                  pointer-events-none
                  absolute top-full mt-2 left-1/2 -translate-x-1/2
                  whitespace-nowrap
                  bg-black text-white text-xs px-2 py-1 rounded
                  shadow-md
                  opacity-0 group-hover:opacity-100
                  transition
                "
              >
                No items in cart
              </span>
            )}
          </div>

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
              <DropdownMenuItem onClick={handleLogout}>
                  Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Hamburger */}
          <button
            className="block md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <Menu />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          className={`md:hidden bg-white border-t shadow-md px-4 py-3 space-y-2 ${navFont.className}`}
        >
          {["Home", "Shop", "Contact","Track Your Order"].map((label) => (
            <Link
              key={label}
              href={`/${
                label.toLowerCase() === "home" ? "" : label.replace(/\s+/g, "").toLowerCase() === "trackyourorder"?"trackyourorder": label.toLowerCase()
              }`}
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
