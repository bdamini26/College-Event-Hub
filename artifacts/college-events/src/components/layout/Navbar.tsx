import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, LogIn, LogOut, UserCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img
                src={`${import.meta.env.BASE_URL}logo.ico`}
                alt="PSCMR-CET Logo"
                className="h-10 w-10 rounded-lg object-contain"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight text-primary">PSCMR-CET</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Event Management</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-2",
                  location === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {link.label}
                {location === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  {isAdmin
                    ? <ShieldCheck className="w-4 h-4 text-accent" />
                    : <UserCircle className="w-4 h-4 text-primary" />
                  }
                  <span className="font-medium max-w-[120px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/login"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-primary border border-primary/30 hover:bg-primary/10 transition-colors">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link href="/register"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            {!user && (
              <Link href="/login" className="text-sm font-medium text-primary px-3 py-1.5 border border-primary/30 rounded-lg">
                Login
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground/80 hover:text-primary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="pt-2 border-t border-border mt-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <UserCircle className="w-4 h-4" />
                  <span className="font-medium">{user.name}</span>
                  {isAdmin && <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">Admin</span>}
                </div>
                <button onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-border mt-2 space-y-1">
                <Link href="/register" onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-semibold bg-primary text-primary-foreground text-center">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
