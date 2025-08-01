import { Avatar } from "@heroui/react";
import { memo } from "react";
import Carousel from "./Carousel";

export type CardItem = {
  title: string;
  seller: {
    name: string;
    avatar: string;
  };
  price: string;
  rating: number;
  images: string[];
};

const Card = memo(function Card({ item }: { item: CardItem }) {
  return (
    <div className="w-full mx-auto rounded-t-2xl overflow-hidden bg-transparent">
      <div className="relative">
        <Carousel 
          images={item.images} 
          alt={item.title} 
          className="w-full h-80 rounded-2xl"
        />
        <button className="absolute top-3 right-3 p-1.5 rounded-full bg-background/60 backdrop-blur-md shadow-md border border-divider transition hover:bg-background/80 z-30">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-foreground">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-1 mt-1">
        <h3 className="text-base font-semibold text-foreground truncate">{item.title}</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar size="sm" src={item.seller.avatar} />
            <p className="text-foreground/70 font-semibold">{item.seller.name}</p>
          </div>
          <span className="flex items-center gap-0.5 text-sm text-foreground">
            {item.rating}
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 text-warning-500">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
          </span>
        </div>
        <div className="text-base font-semibold text-foreground mt-2">
          {item.price}
        </div>
      </div>
    </div>
  );
});

export default Card;
