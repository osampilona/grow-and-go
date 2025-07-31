"use client";
import {Avatar, Card, CardFooter, CardHeader, Image, Button} from "@heroui/react";

export default function Home() {
  const cardList = [
    {
      title: "What to watch",
      subtitle: "Stream the Acme event",
      img: "https://heroui.com/images/card-example-4.jpeg",
    },
    {
      title: "Plant a tree",
      subtitle: "Contribute to the planet",
      img: "https://heroui.com/images/card-example-3.jpeg",
    },
    {
      title: "Supercharged",
      subtitle: "Creates beauty like a beast",
      img: "https://heroui.com/images/card-example-2.jpeg",
      footer: {
        icon: "https://heroui.com/images/breathing-app-icon.jpeg",
        app: "Breathing App",
        desc: "Get a good night's sleep.",
        button: "Get App",
      },
    },
    {
      title: "Explore Nature",
      subtitle: "Discover new places",
      img: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&w=400&q=80",
    },
    {
      title: "Healthy Living",
      subtitle: "Tips for a better life",
      img: "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&w=400&q=80",
    },
    {
      title: "Fresh Fruits",
      subtitle: "Enjoy the taste",
      img: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400&q=80",
    },
    {
      title: "Mountain Escape",
      subtitle: "Find your peace",
      img: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&w=400&q=80",
    },
    {
      title: "Ocean View",
      subtitle: "Relax by the sea",
      img: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&w=400&q=80",
    },
    {
      title: "City Lights",
      subtitle: "Experience the nightlife",
      img: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&w=400&q=80",
    },
    {
      title: "Wildlife",
      subtitle: "See the animals",
      img: "https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&w=400&q=80",
    },
    {
      title: "Adventure",
      subtitle: "Try something new",
      img: "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&w=400&q=80",
    },
    {
      title: "Art & Culture",
      subtitle: "Visit museums",
      img: "https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg?auto=compress&w=400&q=80",
    },
    {
      title: "Fitness",
      subtitle: "Stay active",
      img: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400&q=80",
    },
    {
      title: "Cooking",
      subtitle: "Learn new recipes",
      img: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400&q=80",
    },
    {
      title: "Gardening",
      subtitle: "Grow your own food",
      img: "https://images.pexels.com/photos/296230/pexels-photo-296230.jpeg?auto=compress&w=400&q=80",
    },
  ];
  return (
    <div>
      <div className="flex gap-4 overflow-x-auto py-2">
        {cardList.map((card, idx) => (
          <Card key={idx} className="min-w-[260px] h-[300px] relative">
            <CardHeader className="absolute z-10 top-1 flex-col items-start!">
              <p className="text-tiny text-white/60 uppercase font-bold">{card.title}</p>
              <h4 className="text-white font-medium text-large">{card.subtitle}</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src={card.img}
            />
            {card.footer && (
              <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                <div className="flex grow gap-2 items-center">
                  <Image
                    alt="Breathing app icon"
                    className="rounded-full w-10 h-11 bg-black"
                    src={card.footer.icon}
                  />
                  <div className="flex flex-col">
                    <p className="text-tiny text-white/60">{card.footer.app}</p>
                    <p className="text-tiny text-white/60">{card.footer.desc}</p>
                  </div>
                </div>
                <Button radius="full" size="sm">
                  {card.footer.button}
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
