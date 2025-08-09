"use client";

import { Avatar, Button } from "@heroui/react";
import { useParams } from "next/navigation";
import { mockFeed, FeedItem } from "@/data/mock/feed";
import SwiperCarousel from "@/components/SwiperCarousel";
import { IoChatboxOutline } from "react-icons/io5";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug;
  const product: FeedItem | undefined = mockFeed.find((item: FeedItem) => item.id === slug);

  return (
      <div className="w-full h-[90vh] bg-transparent rounded-3xl flex flex-col justify-between py-6">
        {/* Top section: main product info */}
        <div className="flex flex-col lg:flex-row gap-8 h-auto lg:h-[70%]">
          {/* Left: Product image area */}
          <div className="flex items-center justify-center bg-blue-500 rounded-3xl w-full lg:w-1/2 h-full p-4 sm:p-8">
            <div className="w-full h-80 lg:h-[27rem] aspect-square rounded-2xl overflow-hidden flex items-center justify-center bg-blue-500">
              {/* Prepare images for SwiperCarousel */}
              {(() => {
                const images = (product?.images || ["https://via.placeholder.com/400x400?text=Product+Image"]).map((src, idx) => ({
                  src,
                  alt: product?.title ? `${product.title} image ${idx + 1}` : `Product image ${idx + 1}`
                }));
                return (
                  <SwiperCarousel images={images} className="w-full h-full rounded-2xl" />
                );
              })()}
            </div>
          </div>
          {/* Right: Product info area */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 h-full gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-6xl font-bold leading-tight">{product?.title || "Product Title"}</h2>
            <button className="border border-gray-400 rounded-full p-3 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-black">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
              </svg>
            </button>
            </div>
            {/* User avatar, name, and rating */}
          <div className="flex items-center gap-4 justify-between mb-2 w-full">
            <div className="flex items-center gap-4">
              <Avatar size="md" src={product?.user.avatar} alt={product?.user.name} />
              <span className="font-semibold text-lg">{product?.user.name}</span>
              <span className="text-yellow-500 font-semibold flex items-center gap-1">
                {product?.user.rating?.toFixed(1)}
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 inline-block"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z"/></svg>
              </span>
            </div>
            <Button radius="sm" size="md" className="bg-lime-400 text-black font-semibold hover:bg-lime-500">
              <span className="flex items-center gap-2">
                <IoChatboxOutline className="w-5 h-5" />
                Chat with {product?.user.name}
              </span>
            </Button>
          </div>
            <p className="text-gray-600 text-lg">{product?.description || "Ideal choice for those who want to combine cozy comfort with urban elegance"}</p>
            {/* Price and actions */}
            <div className="flex items-center gap-6 mt-2">
              <span className="text-2xl font-bold">{product?.price || '123DKK'}</span>
              <span className="text-lg line-through text-gray-400">{'236DKK'}</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <button className="border-2 border-yellow-300 text-yellow-700 px-8 py-3 rounded-full font-bold text-lg bg-white">ADD TO CART</button>
              <button className="bg-yellow-300 text-black px-8 py-3 rounded-full font-bold text-lg">BUY NOW</button>
            </div>
          </div>
        </div>
        {/* Bottom section: suggestions */}
        <div className="flex flex-col lg:flex-row gap-8 w-full h-auto lg:h-[30%] mt-8">
          {/* Left suggestion */}
          <div className="bg-white rounded-3xl flex flex-col justify-center p-8 w-full lg:w-1/2 h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full border flex items-center justify-center">
                {/* Custom icon placeholder */}
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#F3F4F6"/><path d="M12 24h24M24 12v24" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <h3 className="text-3xl font-bold">With this product buy</h3>
            </div>
            <p className="text-gray-600">Styled a sleek urban look with a denim jacket, black jeans, ankle boots, and a leather crossbody bag — perfect for autumn city adventures</p>
          </div>
          {/* Right suggestion */}
          <div className="bg-purple-100 rounded-3xl flex items-center gap-8 p-8 w-full lg:w-1/2 h-full">
            <img src="https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&w=400&q=80" alt="Air Force purple" className="w-32 h-32 rounded-full object-cover" />
            <div className="flex flex-col gap-2">
              <h4 className="text-xl font-bold">Air Force purple №3212</h4>
              <span className="text-gray-700">Size: 32-42</span>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">123$</span>
                <span className="text-lg line-through text-gray-400">236$</span>
              </div>
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-full font-semibold flex items-center gap-2 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v13.5A2.25 2.25 0 009.75 22.5h4.5A2.25 2.25 0 0016.5 20.25v-3.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75l3-3m0 0l-3-3m3 3H9" /></svg>
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
