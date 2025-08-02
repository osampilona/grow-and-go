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
import { Button } from "@heroui/button"; // Add this import

import { ThemeSwitch } from "@/components/theme-switch";
import CategoriesList from "./CategoriesList";
export const Navbar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Add onClose handler for Drawer buttons
  const onClose = () => onOpenChange();

  return (
    <>
      <HeroUINavbar maxWidth="2xl" position="sticky" className="bg-fffafa dark:bg-[#282828] backdrop-blur-md pt-2">
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
              onClick={onOpen}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-default-100 transition-colors"
            >
              <TbCategory size={20} />
              <span className="text-sm font-medium">Categories & Filters</span>
            </button>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
          <NavbarItem>
            <ThemeSwitch />
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
        <DrawerContent>
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
    </>
  );
};
