"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "#accueil", label: "Accueil" },
  { href: "#gite", label: "Le Gîte" },
  { href: "#services", label: "Services" },
  { href: "/calendrier", label: "Disponibilités" },
  { href: "#tourisme", label: "Tourisme" },
  { href: "#avis", label: "Avis" },
  { href: "#contact", label: "Contact" },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-cream/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="#accueil" className="flex-shrink-0">
            <span className={`font-serif text-2xl font-bold transition-colors ${isScrolled ? "text-slate" : "text-white"
              }`}>
              L'Écrin du Vignobl
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-gold ${isScrolled ? "text-slate" : "text-white"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="#devis"
            className="hidden md:inline-flex items-center px-6 py-2.5 bg-gold text-cream text-sm font-medium tracking-wide rounded-full hover:bg-gold-dark transition-colors"
          >
            Réserver / Devis
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 ${isScrolled ? "text-slate" : "text-white"}`}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-cream/95 backdrop-blur-md rounded-2xl mt-2 p-6 shadow-lg">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate font-medium py-2 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#devis"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 text-center px-6 py-3 bg-gold text-cream font-medium rounded-full hover:bg-gold-dark transition-colors"
              >
                Réserver / Devis
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
