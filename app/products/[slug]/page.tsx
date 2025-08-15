"use client";

import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import ProductDetailsTabs from "@/components/ProductDetailsTabs";
import ProductMedia from "@/components/ProductMedia";
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
            {/* 3) Left-bottom suggestion */}
            <div className="order-3 lg:order-none bg-white rounded-3xl flex flex-col justify-center w-full">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border flex items-center justify-center">
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
                Styled a sleek urban look with a denim jacket, black jeans, ankle boots, and a
                leather crossbody bag — perfect for autumn city adventures
              </p>
            </div>
          </div>

          {/* Right column wrapper: contents on small, flex column on lg+ */}
          <div className="contents lg:flex lg:flex-col lg:gap-8">
            {/* 2) Right upper: min-height matches left image + padding on lg+ (28rem + 4rem) */}
            <div className="order-2 lg:order-none flex flex-col gap-4 lg:min-h-[32rem]">
              <ProductDetailsTabs product={product} />
            </div>

            {/* 4) Right bottom suggestion */}
            <div className="order-4 lg:order-none bg-purple-100 rounded-3xl flex items-center gap-8 p-8 w-full">
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
      </div>
    </>
  );
}
