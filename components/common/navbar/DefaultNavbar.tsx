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
import { useCartStore } from "@/store/cartStore";
import { useUser } from "@/store/userStore";
import { ShoppingCart } from "lucide-react";
import { toastSuccess } from "@/utils/toast";

export default function DefaultNavbar() {
  const {logout}=useUser()
  const handleLogout=()=>
  {
    logout()
    toastSuccess("Successfully Logged Out ")
  }
  return (
    <header className="sticky top-0 z-100 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/favicon.ico" alt="Logo" width={40} height={40} />
          <span className="font-bold text-lg text-[#eac90b]">
            <Link href="/">Laridae</Link>
          </span>
        </div>

        <div className="hidden md:flex gap-10 text-black">
          {["Home", "Shop", "B2B", "Contact"].map((label) => (
            <Link key={label} href={`/${label.toLowerCase() === "home" ? "" : label.toLowerCase()}`}>
              {label}
            </Link>
          ))}
        </div>

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
              <DropdownMenuLabel className="text-[#eac90b]">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/orders">View Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={handleLogout}>Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
