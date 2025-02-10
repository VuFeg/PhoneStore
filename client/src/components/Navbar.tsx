"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiPhone,
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(10);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [showAccessoryDropdown, setShowAccessoryDropdown] = useState(false);

  const handleMenuToggle = () => setIsOpen(!isOpen);

  const phoneCategories = [
    { name: "Smartphones", path: "/phones/smartphones" },
    { name: "Feature Phones", path: "/phones/feature" },
    { name: "Refurbished", path: "/phones/refurbished" },
  ];

  const accessoryCategories = [
    { name: "Cases", path: "/accessories/cases" },
    { name: "Chargers", path: "/accessories/chargers" },
    { name: "Screen Protectors", path: "/accessories/screen-protectors" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
            <div
              className="relative"
              onMouseEnter={() => setShowPhoneDropdown(true)}
              onMouseLeave={() => setShowPhoneDropdown(false)}
            >
              <button className="text-foreground hover:text-primary transition-colors duration-200">
                Phones
              </button>
              {showPhoneDropdown && (
                <div className="absolute top-full left-0 w-48 bg-card rounded-md shadow-lg py-2 z-50">
                  {phoneCategories.map((category) => (
                    <Link
                      key={category.path}
                      href={category.path}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setShowAccessoryDropdown(true)}
              onMouseLeave={() => setShowAccessoryDropdown(false)}
            >
              <button className="text-foreground hover:text-primary transition-colors duration-200">
                Accessories
              </button>
              {showAccessoryDropdown && (
                <div className="absolute top-full left-0 w-48 bg-card rounded-md shadow-lg py-2 z-50">
                  {accessoryCategories.map((category) => (
                    <Link
                      key={category.path}
                      href={category.path}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
            <button className="text-foreground hover:text-primary transition-colors duration-200">
              <FiUser className="h-6 w-6" />
            </button>
            <button className="relative text-foreground hover:text-primary transition-colors duration-200">
              <FiShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </button>
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
              <FiUser className="h-6 w-6 text-foreground" />
              <FiShoppingCart className="h-6 w-6 text-foreground" />
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
