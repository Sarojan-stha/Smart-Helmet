import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {
  UserButton,
  SignInButton,
  SignUpButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { Menu, Home, Settings, Info, Phone } from "lucide-react";

export default function LandingNavbar() {
  const { signOut } = useAuth();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", to: "/", icon: Home },
    { name: "About Us", to: "/aboutUs", icon: Info },
    { name: "Settings", to: "/settings", icon: Settings },
    { name: "Contact Us", to: "/contact", icon: Phone },
  ];

  return (
    <nav className="bg-background border-b border-border px-4 py-2 flex justify-between items-center">
      {/* Logo */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Home size={28} className="text-primary" />{" "}
        {/* Can replace with helmet icon */}
        <span className="text-2xl font-bold text-foreground">Smart Helmet</span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-4">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.to}
              className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
            >
              <Icon size={16} />
              <span>{link.name}</span>
            </Link>
          );
        })}

        {/* Auth Buttons */}
        {!isSignedIn && (
          <>
            <SignInButton>
              <Button size="sm" variant="outline">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm" variant="secondary">
                Sign Up
              </Button>
            </SignUpButton>
          </>
        )}

        {isSignedIn && (
          <>
            <Button size="sm" variant="destructive" onClick={() => signOut()}>
              Logout
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-4 space-y-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  className="flex items-center space-x-2 text-foreground hover:text-primary"
                >
                  <Icon size={16} />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {!isSignedIn && (
              <>
                <SignInButton>
                  <Button size="sm" variant="outline" className="w-full">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm" variant="secondary" className="w-full">
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            )}

            {isSignedIn && (
              <>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => signOut()}
                  className="w-full"
                >
                  Logout
                </Button>
                <UserButton afterSignOutUrl="/" />
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
