"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import NextLink from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import CategoriesList from "./CategoriesList";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="2xl" position="sticky" className="bg-fffafa dark:bg-[#282828] backdrop-blur-md">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <img src="/logo.png" alt="Grow&Go Logo" className="h-16 w-16 object-contain" />
            <p className="font-bold text-inherit">Grow&Go</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full justify-center">
        <NavbarItem>
          <CategoriesList />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
