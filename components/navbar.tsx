"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { useDisclosure } from "@heroui/use-disclosure";
import NextLink from "next/link";
import { TbCategory } from "react-icons/tb";
import { CiMenuBurger } from "react-icons/ci";
import { Button } from "@heroui/button";
import { memo, useCallback } from "react";

import { ThemeSwitch } from "@/components/theme-switch";
import CategoriesList from "./CategoriesList";

export const Navbar = memo(function Navbar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onOpenChange: onMenuOpenChange } = useDisclosure();

  // Memoized close handlers to prevent unnecessary re-renders
  const onClose = useCallback(() => {
    onOpenChange();
  }, [onOpenChange]);

  const onMenuClose = useCallback(() => {
    onMenuOpenChange();
  }, [onMenuOpenChange]);

  // Memoized button handlers
  const handleCategoryOpen = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const handleMenuOpen = useCallback(() => {
    onMenuOpen();
  }, [onMenuOpen]);

  return (
    <>
      <HeroUINavbar maxWidth="2xl" position="sticky" className="bg-white/70 dark:bg-[#373737]/70 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 pt-2">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink className="flex justify-start items-center" href="/">
              <img src="/logo.png" alt="Grow&Go Logo" className="h-16 w-16 object-contain" />
              <p className="font-bold text-inherit hidden lg:flex">Grow&Go</p>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        {/* Categories for large screens */}
        <NavbarContent className="hidden lg:flex basis-1/5 sm:basis-full justify-center">
          <NavbarItem>
            <CategoriesList />
          </NavbarItem>
        </NavbarContent>

        {/* Categories button for smaller screens */}
        <NavbarContent className="flex lg:hidden basis-1/5 sm:basis-full justify-center">
          <NavbarItem>
            <button 
              onClick={handleCategoryOpen}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-default-100 transition-colors"
            >
              <TbCategory size={20} />
              <span className="text-sm font-medium">Categories & Filters</span>
            </button>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
          <NavbarItem>
            <button 
              onClick={handleMenuOpen}
              className="flex items-center p-2 rounded-lg hover:bg-default-100 transition-colors"
            >
              <CiMenuBurger size={24} />
            </button>
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      {/* Top Drawer for Categories */}
      <Drawer 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top"
        size="md"
        isDismissable={true}
        backdrop="opaque"
      >
        <DrawerContent className="bg-white dark:bg-[#333]">
          <DrawerHeader className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Categories & Filters</h2>
          </DrawerHeader>
          <DrawerBody className="pb-6">
            <CategoriesList />
          </DrawerBody>
          <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Apply
                </Button>
              </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Right Drawer for Menu */}
      <Drawer 
        isOpen={isMenuOpen} 
        onOpenChange={onMenuOpenChange}
        placement="right"
        size="sm"
        isDismissable={true}
        backdrop="opaque"
      >
        <DrawerContent className="bg-white dark:bg-[#333]">
          <DrawerHeader className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Menu</h2>
          </DrawerHeader>
          <DrawerBody className="pb-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Theme</span>
                <ThemeSwitch />
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button color="primary" onPress={onMenuClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
});
