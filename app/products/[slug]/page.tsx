"use client";

import { Avatar, Button } from "@heroui/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoChatboxOutline } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import { Dialog, Tab } from "@headlessui/react";
import Image from "next/image";

import SwiperCarousel from "@/components/SwiperCarousel";
import { mockFeed, FeedItem } from "@/data/mock/feed";
// import { useLikeStore } from "@/stores/likeStore";
// import { ENABLE_FAVORITES_SYNC } from "@/utils/featureFlags";
import FavoriteToggleButton from "@/components/FavoriteToggleButton";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug;
  const product: FeedItem | undefined = mockFeed.find((item: FeedItem) => item.id === slug);
  const [modalOpen, setModalOpen] = useState(false);
  const modalSwiperApi = useRef<{ update: () => void } | null>(null);
  // Favorites store still initialized via providers; toggling handled by FavoriteToggleButton

  // "Read more" states and refs
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [descTruncatable, setDescTruncatable] = useState(false);
  const [descClampPx, setDescClampPx] = useState<number | undefined>(undefined);

  // Chips measurement ref
  const chipsRef = useRef<HTMLDivElement | null>(null);

  // Seller description clamp
  const sellerDescRef = useRef<HTMLParagraphElement | null>(null);
  const [sellerDescExpanded, setSellerDescExpanded] = useState(false);
  const [sellerDescTruncatable, setSellerDescTruncatable] = useState(false);
  const [sellerDescClampPx, setSellerDescClampPx] = useState<number | undefined>(undefined);

  // Track selected tab to re-measure when Seller tab becomes visible
  const [selectedTab, setSelectedTab] = useState(0);

  const measureSellerDesc = () => {
    if (sellerDescRef.current) {
      const el = sellerDescRef.current;
      const cs = window.getComputedStyle(el);
      const lineH = parseFloat(cs.lineHeight || "0");
      const lh = isNaN(lineH) || lineH === 0 ? parseFloat(cs.fontSize || "16") * 1.4 : lineH;
      const lines = Math.round(el.scrollHeight / lh);
      const needsClamp = lines > 3;

      setSellerDescTruncatable(needsClamp);
      setSellerDescClampPx(needsClamp ? lh * 3 : undefined);
      if (!needsClamp) setSellerDescExpanded(false);
    }
  };

  useEffect(() => {
    if (selectedTab === 2) {
      const t0 = setTimeout(measureSellerDesc, 0);
      const t1 = setTimeout(measureSellerDesc, 150);

      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
      };
    }
  }, [selectedTab]);

  // When modal opens, defer an update to ensure correct sizing & pagination
  useEffect(() => {
    if (modalOpen) {
      const t1 = setTimeout(() => modalSwiperApi.current?.update(), 120);
      const t2 = setTimeout(() => modalSwiperApi.current?.update(), 350); // second pass after potential transitions

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [modalOpen]);

  // Measure description lines and chips rows to determine if truncation is needed
  useEffect(() => {
    const measure = () => {
      // Description lines
      if (descRef.current) {
        const el = descRef.current;
        const cs = window.getComputedStyle(el);
        const lineH = parseFloat(cs.lineHeight || "0");
        // fallback: approximate from font-size if line-height is 'normal'
        const lh = isNaN(lineH) || lineH === 0 ? parseFloat(cs.fontSize || "16") * 1.4 : lineH;
        const lines = Math.round(el.scrollHeight / lh);
        const needsClamp = lines > 3;

        setDescTruncatable(needsClamp);
        setDescClampPx(needsClamp ? lh * 3 : undefined);
        if (!needsClamp) setDescExpanded(false);
      }

      // Chips rows by unique top positions relative to the container (with small tolerance)
      if (chipsRef.current) {
        const c = chipsRef.current;
        const children = Array.from(c.children) as HTMLElement[];
        const tol = 2; // px tolerance for grouping rows
        const cRect = c.getBoundingClientRect();
        const items = children.map((ch) => {
          const r = ch.getBoundingClientRect();

          return { el: ch, top: Math.round(r.top - cRect.top), height: Math.round(r.height) };
        });
        // group top values within tolerance to handle sub-pixel/layout quirks
        const tops: number[] = [];

        for (const it of items) {
          const i = tops.findIndex((v) => Math.abs(v - it.top) <= tol);

          if (i === -1) tops.push(it.top);
        }
        tops.sort((a, b) => a - b);
        const rows = tops.length;
        const needsClamp = rows > 2; // show exactly 2 rows, clamp when there are more than 2 rows

        if (needsClamp) {
          // We could compute clampTo here, but we avoid storing in state; left as a placeholder for future.
        } else {
          // nothing to do; no clamp applied
        }
      }

      // Seller description lines
      if (sellerDescRef.current) {
        const el = sellerDescRef.current;
        const cs = window.getComputedStyle(el);
        const lineH = parseFloat(cs.lineHeight || "0");
        const lh = isNaN(lineH) || lineH === 0 ? parseFloat(cs.fontSize || "16") * 1.4 : lineH;
        const lines = Math.round(el.scrollHeight / lh);
        const needsClamp = lines > 3;

        setSellerDescTruncatable(needsClamp);
        setSellerDescClampPx(needsClamp ? lh * 3 : undefined);
        if (!needsClamp) setSellerDescExpanded(false);
      }
    };

    // defer to ensure layout is ready and then re-check after potential reflows
    const t0 = setTimeout(measure, 0);
    const t1 = setTimeout(measure, 150);
    const t2 = setTimeout(measure, 400);

    window.addEventListener("resize", measure);

    // Observe chips container size changes (wraps due to width changes or fonts)
    let ro: ResizeObserver | undefined;

    if (typeof ResizeObserver !== "undefined" && chipsRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(chipsRef.current);
    }

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
      if (ro && chipsRef.current) ro.disconnect();
    };
  }, [product]);

  return (
    <>
      {/* Modal for full-size carousel */}
      {product && (
        <Dialog className="fixed inset-0 z-50" open={modalOpen} onClose={() => setModalOpen(false)}>
          {/* Backdrop (click to close) */}
          <button
            aria-label="Close modal"
            className="absolute inset-0 bg-black/70"
            type="button"
            onClick={() => setModalOpen(false)}
          />
          <Dialog.Panel className="relative w-full h-full flex items-center justify-center bg-transparent">
            {/* Close button fixed top-right */}
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
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* Full-screen style carousel */}
            <div className="w-full h-full">
              <SwiperCarousel
                className="flex items-center justify-center w-screen h-screen bg-blue-500/30 dark:bg-[#24032c] backdrop-blur-sm p-4 md:p-8"
                imageClassName="aspect-[4/3] w-[80vw] h-auto max-w-3xl max-h-[80vh] object-cover mx-auto"
                images={product.images.map((src, idx) => ({
                  src,
                  alt: product.title
                    ? `${product.title} image ${idx + 1}`
                    : `Product image ${idx + 1}`,
                }))}
                onReady={(api) => {
                  modalSwiperApi.current = { update: api.update };
                }}
              />
            </div>
          </Dialog.Panel>
        </Dialog>
      )}
      <div className="w-full h-[90vh] bg-transparent rounded-3xl flex flex-col gap-4 justify-between py-6">
        {/* Top section: main product info */}
        <div className="flex flex-col lg:flex-row gap-8 h-auto lg:h-[70%]">
          {/* Left: Product image area */}
          <div className="flex items-center justify-center bg-blue-500 rounded-3xl w-full lg:w-1/2 h-full p-4 sm:p-8">
            <div className="relative w-full h-80 lg:h-[28rem] aspect-square rounded-2xl overflow-hidden flex items-center justify-center bg-blue-500">
              {/* Heart button in top right (same as Card) */}
              <FavoriteToggleButton
                stopPropagation
                ariaLabel="Toggle like"
                className="absolute top-3 right-3 z-30"
                itemId={product?.id ?? ""}
              />
              {/* Prepare images for SwiperCarousel */}
              {(() => {
                const images = (
                  product?.images || ["https://via.placeholder.com/400x400?text=Product+Image"]
                ).map((src, idx) => ({
                  src,
                  alt: product?.title
                    ? `${product.title} image ${idx + 1}`
                    : `Product image ${idx + 1}`,
                }));

                return (
                  <SwiperCarousel
                    className="w-full h-full rounded-2xl"
                    images={images}
                    onImageClick={() => setModalOpen(true)}
                  />
                );
              })()}
            </div>
          </div>
          {/* Right: Product info area */}
          <div className="flex flex-col w-full lg:w-1/2 h-full gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-bold leading-tight">
                  {product?.title || "Product Title"}
                </h2>
              </div>
              {/* Price and actions */}
              <div className="flex flex-col gap-3">
                <h4 className="text-2xl font-bold">{product?.price || "123DKK"}</h4>
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
            {/* Tabs: Description / Attributes (extensible) */}
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
                      {product?.description ||
                        "Ideal choice for those who want to combine cozy comfort with urban elegance"}
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
                  {product && (
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
                  )}
                </Tab.Panel>
                <Tab.Panel>
                  {product && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar alt={product.user.name} size="lg" src={product.user.avatar} />
                        <div>
                          <div className="font-semibold text-lg">{product.user.name}</div>
                          <div className="text-yellow-500 font-semibold flex items-center gap-1">
                            {product.user.rating?.toFixed(1)}
                            <svg
                              className="w-4 h-4 inline-block"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
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
                          {product.user.description ||
                            `Hi, I’m ${product.user.name}. Reliable seller.`}
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
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
        {/* Bottom section: suggestions */}
        <div className="flex flex-col lg:flex-row gap-8 w-full h-auto lg:h-[30%]">
          {/* Left suggestion */}
          <div className="bg-white rounded-3xl flex flex-col justify-center p-8 w-full lg:w-1/2 h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full border flex items-center justify-center">
                {/* Custom icon placeholder */}
                <svg fill="none" height="48" viewBox="0 0 48 48" width="48">
                  <circle cx="24" cy="24" fill="#F3F4F6" r="24" />
                  <path
                    d="M12 24h24M24 12v24"
                    stroke="#222"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold">With this product buy</h3>
            </div>
            <p className="text-gray-600">
              Styled a sleek urban look with a denim jacket, black jeans, ankle boots, and a leather
              crossbody bag — perfect for autumn city adventures
            </p>
          </div>
          {/* Right suggestion */}
          <div className="bg-purple-100 rounded-3xl flex items-center gap-8 p-8 w-full lg:w-1/2 h-full">
            <Image
              unoptimized
              alt="Air Force purple"
              className="w-32 h-32 rounded-full object-cover"
              height={128}
              src="https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80"
              width={128}
            />
            <div className="flex flex-col gap-2">
              <h4 className="text-xl font-bold">Air Force purple №3212</h4>
              <span className="text-gray-700">Size: 32-42</span>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">123$</span>
                <span className="text-lg line-through text-gray-400">236$</span>
              </div>
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-full font-semibold flex items-center gap-2 mt-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v13.5A2.25 2.25 0 009.75 22.5h4.5A2.25 2.25 0 0016.5 20.25v-3.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15.75l3-3m0 0l-3-3m3 3H9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
