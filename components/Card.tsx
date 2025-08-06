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
  condition: 'brand-new' | 'like-new' | 'very-good' | 'good' | 'fair';
  images: string[];
};

const Card = memo(function Card({ item }: { item: CardItem }) {
  const getConditionLabel = (condition: CardItem['condition']) => {
    switch (condition) {
      case 'brand-new':
        return 'Brand New';
      case 'like-new':
        return 'Like New';
      case 'very-good':
        return 'Very Good';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      default:
        return condition;
    }
  };

  const getConditionColor = (condition: CardItem['condition']) => {
    switch (condition) {
      case 'brand-new':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'like-new':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'very-good':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'good':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'fair':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="w-full mx-auto rounded-t-2xl overflow-hidden bg-transparent">
      <div className="relative">
        <Carousel 
          images={item.images} 
          alt={item.title} 
          className="w-full h-80 rounded-2xl"
        />
        {/* Condition badge in top left */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md z-30 ${getConditionColor(item.condition)}`}>
          {getConditionLabel(item.condition)}
        </div>
        {/* Heart button in top right */}
        <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/60 backdrop-blur-md shadow-md border border-divider transition hover:bg-white/80 z-30">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-black">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {/* Title */}
        <h3 className="text-base font-semibold text-foreground truncate">{item.title}</h3>
        
        {/* Seller info */}
        <div className="flex items-center gap-2">
          <Avatar size="sm" src={item.seller.avatar} />
          <p className="text-foreground/70 text-sm font-medium">{item.seller.name}</p>
        </div>
        
        {/* Price - moved to bottom */}
        <div className="text-xl font-bold text-foreground">
          {item.price}
        </div>
      </div>
    </div>
  );
});

export default Card;
