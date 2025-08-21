"use client";

import { Dialog } from "@headlessui/react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import ProductDetailsTabs from "@/components/ProductDetailsTabs";
import ProductMedia from "@/components/ProductMedia";
import SellerSuggestions from "@/components/SellerSuggestions";
import SwiperCarousel from "@/components/SwiperCarousel";
import { FeedItem, mockFeed } from "@/data/mock/feed";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product: FeedItem | undefined = mockFeed.find((it) => it.id === slug);

  const [modalOpen, setModalOpen] = useState(false);
  const modalSwiperApi = useRef<{ update: () => void } | null>(null);

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
              <ProductDetailsTabs product={product} />
            </div>
          </div>

          {/* Full-width seller suggestions (spans both columns on lg) */}
          <div className="order-3 lg:col-span-2 rounded-3xl w-full">
            <SellerSuggestions product={product} />
          </div>
        </div>
      </div>
    </>
  );
}
