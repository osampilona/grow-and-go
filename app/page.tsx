"use client";
import { Avatar } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex flex-row items-top justify-between lg:justify-start min-h-screen w-full gap-2">
      <h1 className="text-2xl font-bold">Hello, Raphael</h1>
      <Avatar
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        alt="User Avatar"
        size="md"
      />
    </div>
  );
}
