"use client";

import { useParams } from "next/navigation";

export default function UserPage() {
  const params = useParams();
  const slug = params?.slug;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User: {slug}</h1>
      <p>This is a dynamic user page for <b>{slug}</b>.</p>
    </div>
  );
}
