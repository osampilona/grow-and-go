"use client";

import type { FeedItem } from "@/data/mock/feed";

import { useCallback, useEffect, useRef, useState } from "react";
import { Tab } from "@headlessui/react";
import { Avatar, Button } from "@heroui/react";
import Link from "next/link"; // used for seller avatar/name link
import { IoChatboxOutline } from "react-icons/io5";

type Props = {
  product: FeedItem;
  className?: string;
};

// Hoisted tab config so the array identity stays stable across renders
const PRODUCT_TABS: { key: string; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "shipping", label: "Shipping" },
  { key: "seller", label: "Seller" },
];

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

  const measureSellerDesc = useCallback(() => {
    const el = sellerDescRef.current;

    if (!el) return;

    const cs = window.getComputedStyle(el);
    const lineH = parseFloat(cs.lineHeight || "0");
    const lh = isNaN(lineH) || lineH === 0 ? parseFloat(cs.fontSize || "16") * 1.4 : lineH;
    const lines = Math.round(el.scrollHeight / lh);
    const needsClamp = lines > 3;

    setSellerDescTruncatable(needsClamp);
    setSellerDescClampPx(needsClamp ? lh * 3 : undefined);
    if (!needsClamp) setSellerDescExpanded(false);
  }, []);

  // Unified measurement using ResizeObserver for both description blocks
  useEffect(() => {
    let frame: number | null = null;
    const measureAll = () => {
      frame && cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const descEl = descRef.current;

        if (descEl) {
          const cs = window.getComputedStyle(descEl);
          const lh = parseFloat(cs.lineHeight || "0") || parseFloat(cs.fontSize || "16") * 1.4;
          const needs = Math.round(descEl.scrollHeight / lh) > 3;

          setDescTruncatable(needs);
          setDescClampPx(needs ? lh * 3 : undefined);
          if (!needs) setDescExpanded(false);
        }
        // Only measure seller description when the tab is active to avoid layout thrash
        if (selectedTab === 2) {
          measureSellerDesc();
        }
      });
    };

    // Observe size changes
    const ro = new ResizeObserver(measureAll);

    if (descRef.current) ro.observe(descRef.current);

    if (selectedTab === 2 && sellerDescRef.current) ro.observe(sellerDescRef.current);

    // Initial + delayed measure (delayed handles async content like images/fonts)
    measureAll();
    const delayed = setTimeout(measureAll, 160);

    window.addEventListener("resize", measureAll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(delayed);
      ro.disconnect();
      window.removeEventListener("resize", measureAll);
    };
  }, [product, selectedTab, measureSellerDesc]);

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
          {PRODUCT_TABS.map((t) => (
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
              <Link
                prefetch
                aria-label={`See ${product.user.name}’s profile`}
                className="group flex items-center gap-4 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                href={`/user/${product.user.userId}`}
              >
                <Avatar
                  alt={product.user.name}
                  className="group-hover:opacity-90 transition-opacity"
                  size="lg"
                  src={product.user.avatar}
                />
                <div>
                  <div className="font-semibold text-lg group-hover:underline underline-offset-2">
                    {product.user.name}
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-yellow-500">
                    {product.user.rating?.toFixed(1)}
                    <svg className="inline-block h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  </div>
                </div>
              </Link>
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
