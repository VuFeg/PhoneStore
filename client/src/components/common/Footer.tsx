"use client";

import React from "react";
import Link from "next/link";
import { FiPhone } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-card shadow-sm border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center">
              <FiPhone className="h-6 w-6 text-primary" />
              <span className="ml-2 font-heading text-foreground">
                PhoneStore
              </span>
            </div>
            <p className="mt-4 text-accent text-sm">
              Your trusted destination for the latest smartphones and
              accessories.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-accent hover:text-primary text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-accent hover:text-primary text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-accent hover:text-primary text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-accent hover:text-primary text-sm"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shipping"
                  className="text-accent hover:text-primary text-sm"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-accent hover:text-primary text-sm"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-accent hover:text-primary text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/warranty"
                  className="text-accent hover:text-primary text-sm"
                >
                  Warranty
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-accent text-sm">
              © 2024 PhoneStore. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-accent hover:text-primary text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-accent hover:text-primary text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/sitemap"
                className="text-accent hover:text-primary text-sm"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
