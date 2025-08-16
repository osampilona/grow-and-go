"use client";

import type { FeedItem } from "@/data/mock/feed";

import { useEffect, useRef, useState } from "react";
import { Tab } from "@headlessui/react";
import { Avatar, Button } from "@heroui/react";
import Link from "next/link";
import { IoChatboxOutline } from "react-icons/io5";

type Props = {
  product: FeedItem;
  className?: string;
};

export default function ProductDetailsTabs({ product, className }: Props) {
  const [selectedTab, setSelectedTab] = useState(0);

  // Description clamp (product description)
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [descTruncatable, setDescTruncatable] = useState(false);
  const [descClampPx, setDescClampPx] = useState<number | undefined>(undefined);

  // Seller description clamp
  const sellerDescRef = useRef<HTMLParagraphElement | null>(null);
  const [sellerDescExpanded, setSellerDescExpanded] = useState(false);
  const [sellerDescTruncatable, setSellerDescTruncatable] = useState(false);
  const [sellerDescClampPx, setSellerDescClampPx] = useState<number | undefined>(undefined);

  const measureSellerDesc = () => {
    if (!sellerDescRef.current) return;
    const el = sellerDescRef.current;
    const cs = window.getComputedStyle(el);
    const lineH = parseFloat(cs.lineHeight || "0");
    const lh = isNaN(lineH) || lineH === 0 ? parseFloat(cs.fontSize || "16") * 1.4 : lineH;
    const lines = Math.round(el.scrollHeight / lh);
    const needsClamp = lines > 3;

    setSellerDescTruncatable(needsClamp);
    setSellerDescClampPx(needsClamp ? lh * 3 : undefined);
    if (!needsClamp) setSellerDescExpanded(false);
  };

  useEffect(() => {
    const measure = () => {
      if (descRef.current) {
        const el = descRef.current;
        const cs = window.getComputedStyle(el);
        const lh = parseFloat(cs.lineHeight || "0") || parseFloat(cs.fontSize || "16") * 1.4;
        const needs = Math.round(el.scrollHeight / lh) > 3;

        setDescTruncatable(needs);
        setDescClampPx(needs ? lh * 3 : undefined);
        if (!needs) setDescExpanded(false);
      }

      if (sellerDescRef.current) measureSellerDesc();
    };

    const t0 = setTimeout(measure, 0);
    const t1 = setTimeout(measure, 200);

    window.addEventListener("resize", measure);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      window.removeEventListener("resize", measure);
    };
  }, [product]);

  useEffect(() => {
    if (selectedTab === 2) {
      const t0 = setTimeout(measureSellerDesc, 0);
      const t1 = setTimeout(measureSellerDesc, 150);
      const t2 = setTimeout(measureSellerDesc, 350);

      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [selectedTab]);

  return (
    <div className={className}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold leading-tight">{product.title}</h2>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-2xl font-bold">{product.price}</h4>
          <div className="flex items-center gap-4 mt-2 mb-4">
            <Button
              disableAnimation
              disableRipple
              className="font-bold px-8 cta-outline"
              color="default"
              radius="full"
              size="lg"
            >
              ADD TO CART
            </Button>
            <Button
              disableAnimation
              disableRipple
              className="font-bold px-8 cta-solid"
              color="default"
              radius="full"
              size="lg"
            >
              BUY NOW
            </Button>
          </div>
        </div>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex gap-8 border-b border-default-200 dark:border-slate-700">
          {[
            { key: "description", label: "Description" },
            { key: "shipping", label: "Shipping" },
            { key: "seller", label: "Seller" },
          ].map((t) => (
            <Tab
              key={t.key}
              className={({ selected }) =>
                `-mb-px py-2 text-sm font-semibold uppercase outline-none border-b-2 cursor-pointer select-none ${selected ? "border-foreground text-foreground" : "border-transparent text-foreground/60 hover:text-foreground"}`
              }
            >
              {t.label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <div>
              <p
                ref={descRef}
                className="text-gray-600 text-lg dark:text-white"
                style={
                  !descExpanded && descTruncatable && descClampPx
                    ? { maxHeight: `${descClampPx}px`, overflow: "hidden" }
                    : undefined
                }
              >
                {product.description}
              </p>
              {descTruncatable && (
                <button
                  className="mt-1 text-sm font-medium text-primary hover:underline"
                  onClick={() => setDescExpanded((v) => !v)}
                >
                  {descExpanded ? "Read less" : "Read more"}
                </button>
              )}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="flex flex-col gap-4">
              <ul className="space-y-2">
                {product.shippingMethods.map((method) => {
                  const label =
                    method === "pickup"
                      ? "Pickup"
                      : method === "local-delivery"
                        ? "Local delivery"
                        : "Shipping";
                  const info =
                    method === "pickup"
                      ? "Pick up at seller’s location"
                      : method === "local-delivery"
                        ? "Delivered locally by the seller"
                        : "Ships via courier or postal service";

                  return (
                    <li
                      key={method}
                      className="flex items-center justify-between rounded-full px-4 py-2 bg-default-100 dark:bg-slate-800/60"
                    >
                      <span className="font-medium">{label}</span>
                      <span className="text-foreground/70 text-sm">{info}</span>
                    </li>
                  );
                })}
              </ul>
              {(product.shippingMethods.includes("pickup") ||
                product.shippingMethods.includes("local-delivery")) && (
                <a
                  className="self-start text-sm font-semibold text-primary hover:underline"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Hannemanns Alle 4A")}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  See on map
                </a>
              )}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar alt={product.user.name} size="lg" src={product.user.avatar} />
                <div>
                  <div className="font-semibold text-lg">{product.user.name}</div>
                  <div className="text-yellow-500 font-semibold flex items-center gap-1">
                    {product.user.rating?.toFixed(1)}
                    <svg className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <p
                  ref={sellerDescRef}
                  className="text-foreground/80 text-lg"
                  style={
                    !sellerDescExpanded && sellerDescTruncatable && sellerDescClampPx
                      ? {
                          maxHeight: `${sellerDescClampPx}px`,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical" as any,
                        }
                      : undefined
                  }
                >
                  {product.user.description || `Hi, I’m ${product.user.name}. Reliable seller.`}
                </p>
                {sellerDescTruncatable && (
                  <button
                    className="text-sm font-medium text-primary hover:underline self-start"
                    onClick={() => setSellerDescExpanded((v) => !v)}
                  >
                    {sellerDescExpanded ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Button
                  className="font-semibold"
                  color="secondary"
                  radius="sm"
                  size="sm"
                  variant="light"
                >
                  <span className="flex items-center gap-2">
                    <IoChatboxOutline className="w-5 h-5" />
                    Chat with {product.user.name}
                  </span>
                </Button>
                <Link
                  className="text-sm font-semibold text-primary hover:underline"
                  href={`/user/${product.user.userId}`}
                >
                  See profile
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.smokeFree && (
                  <span className="rounded-full text-sm px-3 py-1 bg-default-100 dark:bg-slate-800/60">
                    Smoke-free home
                  </span>
                )}
                {product.petFree && (
                  <span className="rounded-full text-sm px-3 py-1 bg-default-100 dark:bg-slate-800/60">
                    Pet-free home
                  </span>
                )}
                {product.perfumeFree && (
                  <span className="rounded-full text-sm px-3 py-1 bg-default-100 dark:bg-slate-800/60">
                    Perfume-free
                  </span>
                )}
                {product.bundleDeal && (
                  <span className="rounded-full text-sm px-3 py-1 bg-default-100 dark:bg-slate-800/60">
                    Bundle deal available
                  </span>
                )}
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
