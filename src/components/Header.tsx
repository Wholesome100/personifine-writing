"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-page-bg border-b border-page-text-muted/20">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="font-serif text-2xl text-accent1">Personifine</h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-accent2 transition-colors">
            Home
          </Link>
          <Link
            href="/catalog"
            className="hover:text-accent2 transition-colors"
          >
            Catalog
          </Link>
          <Link
            href="/authorship"
            className="hover:text-accent2 transition-colors"
          >
            Authorship
          </Link>
          <Link href="/about" className="hover:text-accent2 transition-colors">
            About
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="md:hidden flex flex-col space-y-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-page-text"></span>
          <span className="block w-6 h-0.5 bg-page-text"></span>
          <span className="block w-6 h-0.5 bg-page-text"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-page-bg border-t border-page-text-muted/20 px-4 py-3 space-y-2">
          <Link
            href="/"
            className="block hover:text-accent2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/catalog"
            className="block hover:text-accent2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Catalog
          </Link>
          <Link
            href="/authorship"
            className="block hover:text-accent2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Authorship
          </Link>
          <Link
            href="/about"
            className="block hover:text-accent2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </nav>
      )}
    </header>
  );
}
