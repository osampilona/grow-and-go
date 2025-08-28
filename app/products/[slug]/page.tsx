"use client";

import { Dialog } from "@headlessui/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Button } from "@heroui/react";
import Link from "next/link";
import { IoChatboxOutline, IoCheckmark } from "react-icons/io5";

import BundleDeal from "@/components/BundleDeal";
import ProductMedia from "@/components/ProductMedia";
import SellerSuggestions from "@/components/SellerSuggestions";
import SwiperCarousel from "@/components/SwiperCarousel";
import InfoTabs, { InfoTabItem } from "@/components/InfoTabs";
import { IconMessage } from "@/components/IconMessage";
import { FeedItem, mockFeed } from "@/data/mock/feed";
import { mockTips } from "@/data/mock/tips";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product: FeedItem | undefined = mockFeed.find((it) => it.id === slug);

  const [modalOpen, setModalOpen] = useState(false);
  const modalSwiperApi = useRef<{ update: () => void } | null>(null);

  // Tabs state and measurement for clamped text
  const [selectedTab, setSelectedTab] = useState(0);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [descTruncatable, setDescTruncatable] = useState(false);
  const [descClampPx, setDescClampPx] = useState<number | undefined>(undefined);

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

  useEffect(() => {
    let frame: number | null = null;
    const measureAll = () => {
      if (frame) cancelAnimationFrame(frame);
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
        if (selectedTab === 0) {
          measureSellerDesc();
        }
      });
    };

    const ro = new ResizeObserver(measureAll);

    if (descRef.current) ro.observe(descRef.current);
    if (selectedTab === 0 && sellerDescRef.current) ro.observe(sellerDescRef.current);
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

  const tabItems: InfoTabItem[] = useMemo(() => {
    if (!product) return [];

    return [
      {
        key: "seller",
        label: "Seller",
        content: (
          <div className="flex flex-col gap-4">
            {/* Header row: avatar+name on the left, chat action on the right */}
            <div className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
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
                        fontWeight: 400,
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
            {/* Chat action moved to header row above */}
          </div>
        ),
      },
      {
        key: "description",
        label: "Description",
        content: (
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
        ),
      },
      {
        key: "shipping",
        label: "Shipping",
        content: (
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
                    className="flex items-center justify-between rounded-full p-2 bg-default-100 dark:bg-[#2A1A3C]"
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
                className="self-start text-sm font-semibold text-primary hover:underline px-2"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Hannemanns Alle 4A")}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                See on map
              </a>
            )}
          </div>
        ),
      },
      {
        key: "tricks-tips",
        label: "Tricks and Tips",
        content: (
          <div className="flex flex-col gap-3">
            {(() => {
              const uid = product.user.userId;
              const tips = mockTips[uid] ?? [];

              if (!tips.length) {
                return (
                  <IconMessage
                    className="bg-default-100 dark:bg-[#2A1A3C] rounded-2xl p-4"
                    iconSrc="/empty-box.svg"
                    message="No tricks or tips yet. Check back later."
                  />
                );
              }

              return (
                <ul className="list-none pl-0 space-y-2">
                  {tips.map((t, i) => (
                    <li key={i} className="text-foreground/90 flex items-start gap-2">
                      <IoCheckmark aria-hidden className="mt-0.5 h-5 w-5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              );
            })()}
          </div>
        ),
      },
    ];
  }, [
    product,
    descExpanded,
    descTruncatable,
    descClampPx,
    sellerDescExpanded,
    sellerDescTruncatable,
    sellerDescClampPx,
  ]);

  useEffect(() => {
    if (modalOpen) {
      const t1 = setTimeout(() => modalSwiperApi.current?.update(), 120);
      const t2 = setTimeout(() => modalSwiperApi.current?.update(), 350);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [modalOpen]);

  if (!product) return null;

  return (
    <>
      {/* Fullscreen modal gallery */}
      <Dialog className="fixed inset-0 z-50" open={modalOpen} onClose={() => setModalOpen(false)}>
        <button
          aria-label="Close modal"
          className="absolute inset-0 bg-black/70"
          type="button"
          onClick={() => setModalOpen(false)}
        />
        <Dialog.Panel className="relative w-full h-full flex items-center justify-center bg-transparent">
          <button
            aria-label="Close"
            className="fixed top-6 right-8 z-[100] text-white hover:text-black hover:bg-white/80 rounded-full p-2 shadow transition-colors"
            onClick={() => setModalOpen(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="w-full h-full">
            <SwiperCarousel
              className="flex items-center justify-center w-screen h-screen bg-blue-500/30 dark:bg-[#24032c] backdrop-blur-sm p-4 md:p-8"
              imageClassName="aspect-[4/3] w-[80vw] h-auto max-w-3xl max-h-[80vh] object-cover mx-auto"
              images={product.images.map((src, idx) => ({
                src,
                alt: `${product.title} image ${idx + 1}`,
              }))}
              onReady={(api) => {
                modalSwiperApi.current = { update: api.update };
              }}
            />
          </div>
        </Dialog.Panel>
      </Dialog>

      <div className="w-full bg-transparent rounded-3xl flex flex-col gap-4 justify-between py-6">
        {/* On small screens: order = image, right-upper, left-bottom, right-bottom.
            On lg+: two columns, each stacking independently. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Left column wrapper: contents on small so children can reorder, flex column on lg+ */}
          <div className="contents lg:flex lg:flex-col lg:gap-8">
            {/* 1) Image block */}
            <ProductMedia
              className="order-1 lg:order-none"
              images={product.images}
              productId={product.id}
              productTitle={product.title}
              onImageClick={() => setModalOpen(true)}
            />
          </div>

          {/* Right column wrapper: contents on small, flex column on lg+ */}
          <div className="contents lg:flex lg:flex-col lg:gap-8">
            {/* 2) Right upper: details */}
            <div className="order-2 lg:order-none flex flex-col gap-4 lg:min-h-[32rem]">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-bold leading-tight">{product.title}</h2>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-2xl font-bold">{product.price}</h4>
                  <div className="flex items-center gap-4 mt-2">
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
              <InfoTabs
                items={tabItems}
                selectedIndex={selectedTab}
                tabColor="#EEF6FF"
                tabTextColor="#111827"
                onChange={setSelectedTab}
              />
            </div>
          </div>

          {/* Full-width seller suggestions (spans both columns on lg) */}
          <div className="flex flex-col gap-4 order-3 lg:col-span-2 rounded-3xl w-full">
            <BundleDeal product={product} variant="blue" />
            <SellerSuggestions product={product} />
          </div>
        </div>
      </div>
    </>
  );
}
