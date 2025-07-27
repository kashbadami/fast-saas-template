"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "~/lib/utils";
import { content } from "~/lib/config";

import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { navbar, brand } = content;

  return (
    <section className="top-5 lg:top-12 left-1/2 z-50 fixed bg-background/70 backdrop-blur-md border rounded-full w-[min(calc(100%-3rem),1000px)] -translate-x-1/2">
      <div className="flex justify-between items-center px-6 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative w-10 h-8">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-contain"
            />
          </div>
          <span className="hidden sm:inline font-semibold text-lg">{brand.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="max-lg:hidden">
          <NavigationMenuList>
            {navbar.links.map((link) =>
              link.dropdownItems ? (
                <NavigationMenuItem key={link.label} className="">
                  <NavigationMenuTrigger className="!bg-transparent hover:!bg-[#f97316]/10 hover:!text-[#f97316] data-[state=open]:!bg-[#f97316]/10 data-[state=open]:!text-[#f97316] focus:!bg-[#f97316]/10 focus:!text-[#f97316] px-3">
                    {link.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="space-y-2 p-4 w-[400px]">
                      {link.dropdownItems.map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <a
                              href={item.href}
                              className="group flex gap-4 hover:!bg-[#f97316]/10 focus:!bg-[#f97316]/10 p-3 rounded-md outline-hidden no-underline leading-none transition-colors hover:!text-[#f97316] focus:!text-[#f97316] select-none"
                            >
                              <div className="transition-transform group-hover:translate-x-1 duration-300">
                                <div className="mb-1 font-medium text-sm leading-none">
                                  {item.title}
                                </div>
                                <p className="text-muted-foreground group-hover:text-[#f97316]/80 group-focus:text-[#f97316]/80 text-sm line-clamp-2 leading-snug">
                                  {item.description}
                                </p>
                              </div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={link.label} className="">
                  <a
                    href={link.href}
                    className={cn(
                      "relative bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground hover:text-[#f97316] transition-colors rounded-md hover:bg-[#f97316]/10",
                    )}
                  >
                    {link.label}
                  </a>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2.5">
          <Link href={navbar.cta.secondary.href} className="max-lg:hidden">
            <Button variant="outline">
              <span className="z-10 relative">{navbar.cta.secondary.text}</span>
            </Button>
          </Link>
          <Link href={navbar.cta.primary.href}>
            <Button className="bg-[#f97316] hover:bg-[#f97316]/90">
              <span className="z-10 relative">{navbar.cta.primary.text}</span>
            </Button>
          </Link>

          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            className="lg:hidden relative flex size-8 text-muted-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <div className="block top-1/2 left-1/2 absolute w-[18px] -translate-x-1/2 -translate-y-1/2">
              <span
                aria-hidden="true"
                className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? "rotate-45" : "-translate-y-1.5"}`}
              ></span>
              <span
                aria-hidden="true"
                className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                aria-hidden="true"
                className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? "-rotate-45" : "translate-y-1.5"}`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/*  Mobile Menu Navigation */}
      <div
        className={cn(
          "fixed right-4 top-[calc(100%+1rem)] w-[min(calc(100vw-2rem),320px)] flex flex-col rounded-2xl border bg-background p-4 transition-all duration-300 ease-in-out lg:hidden shadow-xl",
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0",
        )}
      >
        <nav className="flex flex-col flex-1 divide-y divide-border">
          {navbar.links.map((link) =>
            link.dropdownItems ? (
              <div key={link.label} className="py-4 first:pt-0 last:pb-0">
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === link.label ? null : link.label,
                    )
                  }
                  className="flex justify-between items-center w-full font-medium text-foreground text-base"
                >
                  {link.label}
                  <ChevronRight
                    className={cn(
                      "size-4 transition-transform duration-200",
                      openDropdown === link.label ? "rotate-90" : "",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openDropdown === link.label
                      ? "mt-4 max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0",
                  )}
                >
                  <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                    {link.dropdownItems.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="group block hover:bg-[#1e40af] hover:text-white p-2 rounded-md transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setOpenDropdown(null);
                        }}
                      >
                        <div className="transition-transform group-hover:translate-x-1 duration-200">
                          <div className="font-medium group-hover:text-white">
                            {item.title}
                          </div>

                          <p className="mt-1 text-muted-foreground group-hover:text-white/80 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "py-4 text-base font-medium text-foreground transition-colors first:pt-0 last:pb-0 hover:text-[#1e40af]",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
        
        {/* Mobile Auth Buttons */}
        <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border">
          <Link href={navbar.cta.secondary.href} onClick={() => setIsMenuOpen(false)}>
            <Button variant="outline" className="w-full">
              {navbar.cta.secondary.text}
            </Button>
          </Link>
          <Link href={navbar.cta.primary.href} onClick={() => setIsMenuOpen(false)}>
            <Button className="bg-[#f97316] hover:bg-[#f97316]/90 w-full">
              {navbar.cta.primary.text}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export { Navbar };