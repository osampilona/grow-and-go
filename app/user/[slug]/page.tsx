"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

import ReviewCard from "../../../components/ReviewCard";

import ProductMedia from "@/components/ProductMedia";
import Card from "@/components/Card";
import BundleDeal from "@/components/BundleDeal";
import { mockFeed } from "@/data/mock/feed";
import { IconMessage } from "@/components/IconMessage";
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
  const [showAllReviews, setShowAllReviews] = useState(false);
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, INITIAL_REVIEW_COUNT);

  // Reset view when seller or review count changes
  useEffect(() => {
    setShowAllReviews(false);
  }, [slug, reviews.length]);

  // Find bundle items for this user (for conditional rendering of SellerBundleDeal)
  const bundleItems = useMemo(() => items.filter((i) => i.bundleDeal), [items]);

  return (
    <div className="w-full bg-transparent rounded-3xl flex flex-col gap-4 justify-between py-6">
      {/* Responsive profile header using product page grid template */}
      {/* On small screens: order = avatar block (1), details (2). On lg+: two columns. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
          {/* 2) Details / about / badges / actions */}
          <div className="order-2 lg:order-none flex flex-col gap-6 flex-1">
            <section className="space-y-3">
              <div className="flex align-items-center gap-3">
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
              <h2 className="text-xl font-semibold">About</h2>
              <p className="text-foreground/80 text-base leading-relaxed">
                {user?.description ||
                  "Seller bio coming soon. This user hasn’t added a description yet."}
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {aggregated?.flags.bundleDeal && (
                  <span className="rounded-full bg-default-100 px-3 py-1 text-sm dark:bg-slate-800/60">
                    Bundle Deal
                  </span>
                )}
                {aggregated?.flags.petFree && (
                  <span className="rounded-full bg-default-100 px-3 py-1 text-sm dark:bg-slate-800/60">
                    Pet-Free
                  </span>
                )}
                {aggregated?.flags.smokeFree && (
                  <span className="rounded-full bg-default-100 px-3 py-1 text-sm dark:bg-slate-800/60">
                    Smoke-Free
                  </span>
                )}
                {aggregated?.flags.perfumeFree && (
                  <span className="rounded-full bg-default-100 px-3 py-1 text-sm dark:bg-slate-800/60">
                    Perfume-Free
                  </span>
                )}
                {aggregated?.shipping.map((m) => (
                  <span
                    key={m}
                    className="rounded-full bg-default-100 px-3 py-1 text-sm dark:bg-slate-800/60"
                  >
                    {m === "pickup"
                      ? "Pickup"
                      : m === "local-delivery"
                        ? "Local Delivery"
                        : "Shipping"}
                  </span>
                ))}
                {!aggregated && <span className="text-sm text-foreground/50">No badges yet.</span>}
              </div>
            </section>
            {/* Shipping options (aggregated from seller's listings) */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Shipping options</h2>
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
                        className="flex items-center justify-between rounded-full px-4 py-2 bg-default-100 dark:bg-slate-800/60"
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
            </section>
            <div className="flex gap-3">
              <Button className="cta-outline font-semibold" radius="full" size="sm">
                Message
              </Button>
              <Button className="font-semibold" radius="full" size="sm" variant="light">
                Share
              </Button>
              <Button className="font-semibold" radius="full" size="sm" variant="light">
                Report
              </Button>
            </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-6 mx-0">
            {items.map((it) => (
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
        )}
      </section>

      {/* Reviews Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Reviews</h2>
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
        {reviews.length === 0 ? (
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
              <div className="mt-2 flex flex-col items-center gap-2">
                <span className="text-sm text-foreground/60">
                  Showing {visibleReviews.length} of {reviews.length}
                </span>
                <Button
                  radius="full"
                  size="sm"
                  variant="bordered"
                  onPress={() => setShowAllReviews((v) => !v)}
                >
                  {showAllReviews ? "Show less reviews" : "Show more reviews"}
                </Button>
              </div>
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
