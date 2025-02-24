"use client";

import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FiPhone,
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(10);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, logoutUser } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userIconRef = useRef<HTMLButtonElement>(null);

  const handleMenuToggle = () => setIsOpen(!isOpen);
  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 3000,
    });
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex-shrink-0 flex items-center">
            <FiPhone className="h-8 w-8 text-primary" />
            <span className="ml-2 text-lg font-heading text-foreground">
              PhoneStore
            </span>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              Phones
            </Link>
            <Link
              href="/accessories"
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              Accessories
            </Link>
            <Link
              href="/deals"
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              Deals
            </Link>
            <Link
              href="/compare"
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              Compare
            </Link>
          </div>
          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search phones..."
                className="w-64 px-4 py-2 rounded-md bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <FiSearch className="absolute right-3 top-2.5 text-accent" />
            </div>

            <button
              className="relative text-foreground hover:text-primary transition-colors duration-200"
              onMouseEnter={() => setShowCartDropdown(true)}
              onMouseLeave={() => setShowCartDropdown(false)}
            >
              <FiShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
              {showCartDropdown && (
                <div className="absolute top-12 -right-4 w-72 bg-card rounded-md shadow-lg py-2 border border-gray-500 z-50 before:content-[''] before:absolute before:-top-12 before:-right-4 before:w-72 before:h-12 before:bg-transparent">
                  {cartItems.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-center text-primary">
                      Your cart is empty
                    </p>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-4 py-2"
                      >
                        <div className="flex items-center space-x-2">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                          <span className="text-sm text-foreground">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-sm text-foreground">
                          ${item.price}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </button>

            <div className="relative">
              <button
                ref={userIconRef}
                onClick={handleDropdownToggle}
                className="text-foreground hover:text-primary transition-colors duration-200"
              >
                {user ? (
                  <Image
                    src={"/image.png"}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  "Login"
                )}
              </button>
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-8 mt-2 w-48 rounded-md shadow-lg py-1 bg-card ring-1 ring-black ring-opacity-5 z-10"
                >
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-secondary"
                      >
                        Profile Settings
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-secondary"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-secondary"
                      >
                        Account Management
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-secondary"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={handleMenuToggle}
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-foreground hover:bg-secondary rounded-md"
            >
              Home
            </Link>
            <Link
              href="/phones"
              className="block px-3 py-2 text-foreground hover:bg-secondary rounded-md"
            >
              Phones
            </Link>
            <Link
              href="/accessories"
              className="block px-3 py-2 text-foreground hover:bg-secondary rounded-md"
            >
              Accessories
            </Link>
            <Link
              href="/deals"
              className="block px-3 py-2 text-foreground hover:bg-secondary rounded-md"
            >
              Deals
            </Link>
            <Link
              href="/compare"
              className="block px-3 py-2 text-foreground hover:bg-secondary rounded-md"
            >
              Compare
            </Link>
          </div>
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center space-x-4">
              <FiShoppingCart className="h-6 w-6 text-foreground" />
              <FiUser className="h-6 w-6 text-foreground" />
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Search phones..."
                className="w-full px-4 py-2 rounded-md bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
