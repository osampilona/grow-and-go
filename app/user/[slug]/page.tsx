"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { IoChatboxOutline } from "react-icons/io5";

import ProductMedia from "@/components/ProductMedia";
import Card from "@/components/Card";
import BundleDeal from "@/components/BundleDeal";
import InfoTabs, { InfoTabItem } from "@/components/InfoTabs";
import ReviewCard, { ReviewCardSkeleton } from "@/components/ReviewCard";
import Pagination from "@/components/Pagination";
import { IconMessage } from "@/components/IconMessage";
import { mockFeed } from "@/data/mock/feed";
import { mockSellerProfiles } from "@/data/mock/sellers";

export default function UserPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  // Collect items for this userId (slug)
  const { items, user } = useMemo(() => {
    const items = mockFeed.filter((i) => i.user.userId === slug);
    const user = items[0]?.user;

    return { items, user };
  }, [slug]);

  // Listings pagination (10-by-10 show more, collapse to default on less)
  const INITIAL_USER_LISTINGS = 8;
  const [visibleListingCount, setVisibleListingCount] = useState(INITIAL_USER_LISTINGS);
  const visibleItems = useMemo(
    () => items.slice(0, visibleListingCount),
    [items, visibleListingCount]
  );

  useEffect(() => {
    setVisibleListingCount(INITIAL_USER_LISTINGS);
  }, [slug, items.length]);

  const aggregated = useMemo(() => {
    if (!items.length) return null;
    // Aggregate boolean flags (true if any item has them) and shipping methods union
    const flags = {
      bundleDeal: items.some((i) => i.bundleDeal),
      petFree: items.some((i) => i.petFree),
      smokeFree: items.some((i) => i.smokeFree),
      perfumeFree: items.some((i) => i.perfumeFree),
    };
    const shipping = Array.from(new Set(items.flatMap((i) => i.shippingMethods))).sort();

    return { flags, shipping };
  }, [items]);

  const sellerProfile = useMemo(() => mockSellerProfiles[slug], [slug]);
  const reviews = sellerProfile?.reviews ?? [];
  const stats = sellerProfile?.reviewStats;
  const INITIAL_REVIEW_COUNT = 3;
  const [visibleReviewCount, setVisibleReviewCount] = useState(INITIAL_REVIEW_COUNT);
  const visibleReviews = reviews.slice(0, visibleReviewCount);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Reset view when seller or review count changes
  useEffect(() => {
    setVisibleReviewCount(INITIAL_REVIEW_COUNT);
    // Show a brief skeleton while switching users or review count changes
    setReviewsLoading(true);
    const t = setTimeout(() => setReviewsLoading(false), 400);

    return () => clearTimeout(t);
  }, [slug, reviews.length]);

  // Find bundle items for this user (for conditional rendering of SellerBundleDeal)
  const bundleItems = useMemo(() => items.filter((i) => i.bundleDeal), [items]);

  // Derived counts for tabs (removed from labels per request)

  // Clamp About text to 3 lines with Read more/less
  const aboutRef = useRef<HTMLParagraphElement | null>(null);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [aboutTruncatable, setAboutTruncatable] = useState(false);
  const [aboutClampPx, setAboutClampPx] = useState<number | undefined>(undefined);

  const measureAbout = useCallback(() => {
    const el = aboutRef.current;

    if (!el) return;

    const cs = window.getComputedStyle(el);
    const lineH = parseFloat(cs.lineHeight || "0");
    const lh = isNaN(lineH) || lineH === 0 ? parseFloat(cs.fontSize || "16") * 1.4 : lineH;
    const needsClamp = Math.round(el.scrollHeight / lh) > 3;

    setAboutTruncatable(needsClamp);
    setAboutClampPx(needsClamp ? lh * 3 : undefined);
    if (!needsClamp) setAboutExpanded(false);
  }, []);

  useEffect(() => {
    let frame: number | null = null;
    const onMeasure = () => {
      frame && cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measureAbout);
    };
    const ro = new ResizeObserver(onMeasure);

    if (aboutRef.current) ro.observe(aboutRef.current);
    onMeasure();
    const delayed = setTimeout(onMeasure, 160);

    window.addEventListener("resize", onMeasure);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(delayed);
      ro.disconnect();
      window.removeEventListener("resize", onMeasure);
    };
  }, [measureAbout, user?.description]);

  // Build tab items for InfoTabs so pages can pick and choose
  const tabItems: InfoTabItem[] = useMemo(() => {
    const items: InfoTabItem[] = [];
    // About

    items.push({
      key: "about",
      label: "About",
      content: (
        <div className="space-y-3 p-2">
          <p
            ref={aboutRef}
            className="text-foreground/80 text-base leading-relaxed"
            style={
              !aboutExpanded && aboutTruncatable && aboutClampPx
                ? {
                    maxHeight: `${aboutClampPx}px`,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical" as any,
                  }
                : undefined
            }
          >
            {user?.description ||
              "Seller bio coming soon. This user hasn’t added a description yet."}
          </p>
          {aboutTruncatable && (
            <button
              className="text-sm font-medium text-primary hover:underline self-start"
              onClick={() => setAboutExpanded((v) => !v)}
            >
              {aboutExpanded ? "Read less" : "Read more"}
            </button>
          )}
          <div className="flex gap-3">
            <Button className="font-semibold" radius="full" size="sm" variant="light">
              Share
            </Button>
            <Button className="font-semibold" radius="full" size="sm" variant="light">
              Report
            </Button>
          </div>
        </div>
      ),
    });

    // Highlights
    items.push({
      key: "highlights",
      label: "Highlights",
      content: (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {aggregated?.flags.bundleDeal && (
              <span className="rounded-full bg-default-100 px-3 py-1 text-sm dark:bg-[#2A1A3C]">
                Bundle Deal
              </span>
            )}
            {aggregated?.flags.petFree && (
              <span className="rounded-full bg-default-100 px-3 py-1 text-sm dark:bg-[#2A1A3C]">
                Pet-Free
              </span>
            )}
            {aggregated?.flags.smokeFree && (
              <span className="rounded-full bg-default-100 px-3 py-1 text-sm dark:bg-[#2A1A3C]">
                Smoke-Free
              </span>
            )}
            {aggregated?.flags.perfumeFree && (
              <span className="rounded-full bg-default-100 px-3 py-1 text-sm dark:bg-[#2A1A3C]">
                Perfume-Free
              </span>
            )}
            {aggregated?.shipping.map((m) => (
              <span
                key={m}
                className="rounded-full bg-default-100 px-3 py-1 text-sm dark:bg-[#2A1A3C]"
              >
                {m === "pickup" ? "Pickup" : m === "local-delivery" ? "Local Delivery" : "Shipping"}
              </span>
            ))}
            {!aggregated && <span className="text-sm text-foreground/50">No badges yet.</span>}
          </div>
        </div>
      ),
    });

    // Shipping
    items.push({
      key: "shipping",
      label: "Shipping",
      content: (
        <div className="space-y-3">
          {aggregated?.shipping.length ? (
            <ul className="space-y-2">
              {aggregated.shipping.map((method) => {
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
          ) : (
            <span className="text-sm text-foreground/50">No shipping info yet.</span>
          )}
          {(aggregated?.shipping.includes("pickup") ||
            aggregated?.shipping.includes("local-delivery")) && (
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
    });

    return items;
  }, [
    aggregated?.flags.bundleDeal,
    aggregated?.flags.petFree,
    aggregated?.flags.smokeFree,
    aggregated?.flags.perfumeFree,
    aggregated?.shipping,
    aboutClampPx,
    aboutExpanded,
    aboutTruncatable,
    user?.description,
  ]);

  return (
    <div className="w-full bg-transparent rounded-3xl flex flex-col gap-4 justify-between py-6">
      {/* Responsive profile header using product page grid template */}
      {/* On small screens: order = avatar block (1), details (2). On lg+: two columns. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Left column wrapper */}
        <div className="contents lg:flex lg:flex-col lg:gap-8">
          {/* 1) Avatar / identity block */}
          <div className="order-1 lg:order-none flex flex-col items-center gap-4 w-full">
            {user?.avatar && (
              <ProductMedia
                className="p-2 sm:p-3"
                frameColorClass="bg-yellow-300 dark:bg-yellow-400"
                images={[user.avatar]}
                innerColorClass="bg-yellow-200 dark:bg-yellow-300"
                productId={user.userId}
                productTitle={user.name}
                showFavorite={false}
              />
            )}
          </div>
        </div>

        {/* Right column wrapper */}
        <div className="contents lg:flex lg:flex-col lg:gap-8">
          {/* 2) Details with product-like tabs */}
          <div className="order-2 lg:order-none flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  {user?.name || `User ${slug}`}
                </h1>
                {user && (
                  <div className="mt-1 flex items-center gap-1 font-semibold text-yellow-500">
                    {user.rating.toFixed(1)}
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  </div>
                )}
              </div>
              {user && (
                <Button
                  className="font-semibold"
                  color="secondary"
                  radius="sm"
                  size="sm"
                  variant="light"
                >
                  <span className="flex items-center gap-2">
                    <IoChatboxOutline className="w-5 h-5" />
                    Chat with {user.name}
                  </span>
                </Button>
              )}
            </div>

            {user && <InfoTabs items={tabItems} tabColor="#FEFCE8" tabTextColor="#111827" />}
          </div>
        </div>
      </div>

      {/* Bundle Section (if any) */}
      {bundleItems.length > 0 && <BundleDeal product={bundleItems[0]} />}

      {/* Listings Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {user?.name
              ? items.length === 0
                ? `${user.name} has no listings yet`
                : `${user.name} has ${items.length} ${items.length === 1 ? "listing" : "listings"}`
              : items.length > 0
                ? `${items.length} ${items.length === 1 ? "listing" : "listings"}`
                : "Listings"}
          </h2>
        </div>
        {items.length === 0 && (
          <IconMessage
            className="text-foreground/70"
            iconSrc="/duck.svg"
            message="No listings yet."
          />
        )}
        {items.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-6 mx-0">
              {visibleItems.map((it) => (
                <Card
                  key={it.id}
                  item={{
                    id: it.id,
                    title: it.title,
                    price: it.price,
                    rating: it.sellerRating,
                    condition: it.condition,
                    images: it.images.slice(0, 4),
                    user: { userId: it.user.userId, name: it.user.name, avatar: it.user.avatar },
                  }}
                />
              ))}
            </div>
            {items.length > INITIAL_USER_LISTINGS && (
              <Pagination
                initial={INITIAL_USER_LISTINGS}
                label="listings"
                setVisible={setVisibleListingCount}
                step={10}
                total={items.length}
                visible={visibleItems.length}
              />
            )}
          </>
        )}
      </section>

      {/* Reviews Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          {stats && (
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <span className="font-semibold text-yellow-500">{stats.average.toFixed(1)}</span>
              <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
              </svg>
              <span>
                · {stats.count} {stats.count === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>
        {reviewsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <IconMessage
            className="text-foreground/70"
            iconSrc="/reading.svg"
            message="No reviews yet."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleReviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
            {reviews.length > INITIAL_REVIEW_COUNT && (
              <Pagination
                initial={INITIAL_REVIEW_COUNT}
                label="reviews"
                setVisible={setVisibleReviewCount}
                step={10}
                total={reviews.length}
                visible={visibleReviews.length}
              />
            )}
          </>
        )}
      </section>
      {/* Explore other sellers CTA */}
      <div className="mt-4 text-center text-sm text-foreground/50">
        Looking for more? Browse the{" "}
        <Link className="text-primary hover:underline" href="/">
          main feed
        </Link>
        .
      </div>
    </div>
  );
}
