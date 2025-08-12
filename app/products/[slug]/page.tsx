"use client";

import { Avatar, Button } from "@heroui/react";
import { Chip } from "@heroui/chip";
import { useParams } from "next/navigation";
import { mockFeed, FeedItem } from "@/data/mock/feed";
import SwiperCarousel from "@/components/SwiperCarousel";
import { IoChatboxOutline } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { categories, subcategoryMap } from "@/stores/categoryStore";
import { getFilterGroupColor } from "@/utils/colors";
import { useLikeStore } from "@/stores/likeStore";
import { ENABLE_FAVORITES_SYNC } from "@/utils/featureFlags";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug;
  const product: FeedItem | undefined = mockFeed.find((item: FeedItem) => item.id === slug);
  const [modalOpen, setModalOpen] = useState(false);
  const modalSwiperApi = useRef<{ update: () => void } | null>(null);
  const liked = useLikeStore((s) => (product ? !!s.likedIds[product.id] : false));
  const toggleLike = useLikeStore((s) => s.toggleLike);

  // "Read more" states and refs
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [descTruncatable, setDescTruncatable] = useState(false);
  const [descClampPx, setDescClampPx] = useState<number | undefined>(undefined);

  const chipsRef = useRef<HTMLDivElement | null>(null);
  const [chipsExpanded, setChipsExpanded] = useState(false);
  const [chipsTruncatable, setChipsTruncatable] = useState(false);
  const [chipsClampPx, setChipsClampPx] = useState<number | undefined>(undefined);

  // When modal opens, defer an update to ensure correct sizing & pagination
  useEffect(() => {
    if (modalOpen) {
      const t1 = setTimeout(() => modalSwiperApi.current?.update(), 120);
      const t2 = setTimeout(() => modalSwiperApi.current?.update(), 350); // second pass after potential transitions
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [modalOpen]);

  // Measure description lines and chips rows to determine if truncation is needed
  useEffect(() => {
  const measure = () => {
      // Description lines
      if (descRef.current) {
        const el = descRef.current;
        const cs = window.getComputedStyle(el);
        const lineH = parseFloat(cs.lineHeight || '0');
        // fallback: approximate from font-size if line-height is 'normal'
        const lh = isNaN(lineH) || lineH === 0 ? parseFloat(cs.fontSize || '16') * 1.4 : lineH;
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
        const items = children.map(ch => {
          const r = ch.getBoundingClientRect();
          return { el: ch, top: Math.round(r.top - cRect.top), height: Math.round(r.height) };
        });
        // group top values within tolerance to handle sub-pixel/layout quirks
        const tops: number[] = [];
        for (const it of items) {
          const i = tops.findIndex(v => Math.abs(v - it.top) <= tol);
          if (i === -1) tops.push(it.top);
        }
        tops.sort((a, b) => a - b);
        const rows = tops.length;
        const needsClamp = rows > 2; // show exactly 2 rows, clamp when there are more than 2 rows
        setChipsTruncatable(needsClamp);
        if (needsClamp) {
          // Clamp to the minimum of (bottom of row 2) and (just before row 3)
          const secondRowTop = tops[1];
          const thirdRowTop = tops[2];
          const secondRowItems = items.filter(it => Math.abs(it.top - secondRowTop) <= tol);
          const secondRowMaxH = secondRowItems.length ? Math.max(...secondRowItems.map(it => it.height)) : (items[0]?.height || 0);
          const bottomRow2 = Math.ceil(secondRowTop + secondRowMaxH);
          const justBeforeRow3 = Math.max(0, thirdRowTop - 2); // subtract a couple of px as a guard
          const clampTo = Math.min(bottomRow2, justBeforeRow3);
          setChipsClampPx(clampTo);
        } else {
          setChipsClampPx(undefined);
          setChipsExpanded(false);
        }
      }
    };

    // defer to ensure layout is ready and then re-check after potential reflows
    const t0 = setTimeout(measure, 0);
    const t1 = setTimeout(measure, 150);
    const t2 = setTimeout(measure, 400);
    window.addEventListener('resize', measure);

    // Observe chips container size changes (wraps due to width changes or fonts)
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined' && chipsRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(chipsRef.current);
    }
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', measure);
      if (ro && chipsRef.current) ro.disconnect();
    };
  }, [product]);

  return (
    <>
      {/* Modal for full-size carousel */}
      {product && (
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed inset-0 z-50">
          {/* Backdrop (click to close) */}
          <div
            className="absolute inset-0 bg-black/70"
            aria-hidden="true"
            onClick={() => setModalOpen(false)}
          />
          <Dialog.Panel className="relative w-full h-full flex items-center justify-center bg-transparent">
            {/* Close button fixed top-right */}
            <button
              onClick={() => setModalOpen(false)}
              aria-label="Close"
              className="fixed top-6 right-8 z-[100] text-white hover:text-black hover:bg-white/80 rounded-full p-2 shadow transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Full-screen style carousel */}
            <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
              <SwiperCarousel
                images={product.images.map((src, idx) => ({ src, alt: product.title ? `${product.title} image ${idx + 1}` : `Product image ${idx + 1}` }))}
                className="flex items-center justify-center w-screen h-screen bg-blue-500/30 dark:bg-slate-900/40 backdrop-blur-sm p-4 md:p-8"
                imageClassName="aspect-[4/3] w-[80vw] h-auto max-w-3xl max-h-[80vh] object-cover mx-auto"
                onReady={(api) => { modalSwiperApi.current = { update: api.update }; }}
              />
            </div>
          </Dialog.Panel>
        </Dialog>
      )}
      <div className="w-full h-[90vh] bg-white rounded-3xl flex flex-col gap-4 justify-between py-6">
        {/* Top section: main product info */}
        <div className="flex flex-col lg:flex-row gap-8 h-auto lg:h-[70%]">
          {/* Left: Product image area */}
          <div className="flex items-center justify-center bg-blue-500 rounded-3xl w-full lg:w-1/2 h-full p-4 sm:p-8">
            <div className="relative w-full h-80 lg:h-[28rem] aspect-square rounded-2xl overflow-hidden flex items-center justify-center bg-blue-500">
              {/* Heart button in top right (same as Card) */}
              <button
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/60 backdrop-blur-md shadow-md border border-divider transition hover:bg-white/80 z-30"
                aria-label="Toggle like"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!product) return;
                  const wasLiked = liked;
                  toggleLike(product.id); // optimistic
                  try {
                    if (ENABLE_FAVORITES_SYNC) {
                      await fetch('/api/favorites', {
                        method: wasLiked ? 'DELETE' : 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: product.id }),
                      });
                    }
                  } catch {
                    // revert
                    toggleLike(product.id);
                  }
                }}
              >
                {liked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                    <path d="M11.645 20.91l-.007-.003-.022-.01a15.247 15.247 0 01-.383-.173 25.18 25.18 0 01-4.244-2.533C4.688 16.27 2.25 13.614 2.25 10.5 2.25 7.42 4.67 5 7.75 5c1.6 0 3.204.658 4.25 1.856A5.748 5.748 0 0116.25 5c3.08 0 5.5 2.42 5.5 5.5 0 3.114-2.438 5.77-4.739 7.69a25.175 25.175 0 01-4.244 2.533 15.247 15.247 0 01-.383.173l-.022.01-.007.003a.75.75 0 01-.586 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
                  </svg>
                )}
              </button>
              {/* Prepare images for SwiperCarousel */}
              {(() => {
                const images = (product?.images || ["https://via.placeholder.com/400x400?text=Product+Image"]).map((src, idx) => ({
                  src,
                  alt: product?.title ? `${product.title} image ${idx + 1}` : `Product image ${idx + 1}`
                }));
                return (
                  <SwiperCarousel images={images} className="w-full h-full rounded-2xl" onImageClick={() => setModalOpen(true)} />
                );
              })()}
            </div>
          </div>
          {/* Right: Product info area */}
          <div className="flex flex-col justify-between w-full lg:w-1/2 h-full gap-3">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-bold leading-tight">{product?.title || "Product Title"}</h2>
              </div>
              {/* User avatar, name, and rating */}
              <div className="flex items-center gap-4 justify-between w-full">
                <div className="flex items-center gap-4">
                  <Avatar size="md" src={product?.user.avatar} alt={product?.user.name} />
                  <span className="font-semibold text-lg">{product?.user.name}</span>
                  <span className="text-yellow-500 font-semibold flex items-center gap-1">
                    {product?.user.rating?.toFixed(1)}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 inline-block"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z"/></svg>
                  </span>
                </div>
                <Button radius="sm" size="sm" variant="light" color="secondary" className="font-semibold">
                  <span className="flex items-center gap-2">
                    <IoChatboxOutline className="w-5 h-5" />
                    Chat with {product?.user.name}
                  </span>
                </Button>
              </div>
            </div>
            {/* TODO: SHOULD THIS BE SCROLABLE IF THERE IS A LOT OF TEXT */}
            <div className="flex flex-col gap-3">
              {/* Description */}
              <div>
                <p
                  ref={descRef}
                  className="text-gray-600 text-lg"
                  style={!descExpanded && descTruncatable && descClampPx ? { maxHeight: `${descClampPx}px`, overflow: 'hidden' } : undefined}
                >
                  {product?.description || "Ideal choice for those who want to combine cozy comfort with urban elegance"}
                </p>
                {descTruncatable && (
                  <button
                    className="mt-1 text-sm font-medium text-primary hover:underline"
                    onClick={() => setDescExpanded(v => !v)}
                  >
                    {descExpanded ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>
              {/* All Filters / Metadata (dev view) */}
              {product && (
                <>
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Attributes (Dev Preview)</h3>
                  <div
                    ref={chipsRef}
                    className="flex flex-wrap gap-2"
                    style={!chipsExpanded && chipsTruncatable && chipsClampPx ? {
                      maxHeight: `${chipsClampPx}px`,
                      overflow: 'hidden',
                    } : undefined}
                  >
                    {/* Category */}
                    {(() => {
                      const catName = categories.find(c => c.id === product.categoryId)?.name || product.categoryId;
                      return <Chip size="sm" variant="flat" color="primary">Cat: {catName}</Chip>;
                    })()}
                    {/* Subcategories */}
                    {(product.subcategoryIds || []).map(scId => {
                      // Flatten subcategoryMap for name lookup
                      const group = Object.values(subcategoryMap).flat();
                      const sc = group.find(s => s.id === scId);
                      return <Chip key={scId} size="sm" variant="flat" color="primary">Sub: {sc?.name || scId}</Chip>;
                    })}
                    {/* Gender */}
                    {(product.gender || []).map(g => (
                      <Chip key={g} size="sm" variant="flat" color={getFilterGroupColor('gender')}>{g}</Chip>
                    ))}
                    {/* Age Range */}
                    <Chip size="sm" variant="flat" color="success">Age: {product.ageMonthsRange[0]}-{product.ageMonthsRange[1]}m</Chip>
                    {/* Sizes */}
                    {(product.sizes || []).map(sz => <Chip key={sz} size="sm" variant="flat" color="success">Size {sz}</Chip>)}
                    {/* Brand */}
                    {product.brand && <Chip size="sm" variant="flat" color="secondary">Brand: {product.brand}</Chip>}
                    {/* Condition */}
                    <Chip size="sm" variant="flat" color="warning">{product.condition.replace('-', ' ')}</Chip>
                    {/* Stock / Sale */}
                    {!product.inStock ? <Chip size="sm" variant="flat" color="default">Out of Stock</Chip> : <Chip size="sm" variant="flat" color="success">In Stock</Chip>}
                    {product.onSale && <Chip size="sm" variant="flat" color="warning">On Sale</Chip>}
                    {/* Shipping Methods */}
                    {product.shippingMethods.map(m => <Chip key={m} size="sm" variant="flat" color="secondary">Ship: {m}</Chip>)}
                    {/* Environment */}
                    {product.petFree && <Chip size="sm" variant="flat" color="success">Pet Free</Chip>}
                    {product.smokeFree && <Chip size="sm" variant="flat" color="success">Smoke Free</Chip>}
                    {product.perfumeFree && <Chip size="sm" variant="flat" color="success">Perfume Free</Chip>}
                    {/* Deal */}
                    {product.bundleDeal && <Chip size="sm" variant="flat" color="secondary">Bundle Deal</Chip>}
                    {/* Seller Rating */}
                    <Chip size="sm" variant="flat" color="warning">Seller {product.sellerRating.toFixed(1)}</Chip>
                  </div>
                </div>
        {chipsTruncatable && (
                  <button
          className="mt-1 self-start text-sm font-medium text-primary hover:underline"
                    onClick={() => setChipsExpanded(v => !v)}
                  >
                    {chipsExpanded ? 'Read less' : 'Read more'}
                  </button>
                )}
                </>
              )}
            </div>
            {/* Price and actions */}
            <div className="flex flex-col gap-3">
              <h4 className="text-2xl font-bold">{product?.price || '123DKK'}</h4>
              <div className="flex items-center gap-4 mt-2">
                <Button radius="full" size="lg" variant="bordered" color="secondary" className="font-bold px-8">
                  ADD TO CART
                </Button>
                <Button radius="full" size="lg" color="secondary" className="font-bold px-8">
                  BUY NOW
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom section: suggestions */}
        <div className="flex flex-col lg:flex-row gap-8 w-full h-auto lg:h-[30%]">
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
    </>
  );
}
