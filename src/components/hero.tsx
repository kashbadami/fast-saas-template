"use client";

import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo } from "react";
import { useCallback } from "react";

import { cn } from "~/lib/utils";
import { useIsMobile } from "~/hooks/use-mobile";
import { content } from "~/lib/config";
import { Headline } from "~/components/ui/headline";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";

const Hero = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const isMobile = useIsMobile();
  const { hero } = content;

  const getRotation = useCallback(
    (index: number) => {
      if (index === current)
        return "md:-rotate-45 md:translate-x-40 md:scale-75 md:relative";
      if (index === current + 1) return "md:rotate-0 md:z-10 md:relative";
      if (index === current + 2)
        return "md:rotate-45 md:-translate-x-40 md:scale-75 md:relative";
    },
    [current],
  );

  const scrollbarBars = useMemo(
    () =>
      [...Array(40)].map((_, item) => (
        <motion.div
          key={item}
          initial={{
            opacity: item % 5 === 0 ? 0.2 : 0.2,
            filter: "blur(1px)",
          }}
          animate={{
            opacity: item % 5 === 0 ? 1 : 0.2,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.2,
            delay: item % 5 === 0 ? (item / 5) * 0.05 : 0,
            ease: "easeOut",
          }}
          className={cn(
            "w-[1px] bg-gradient-to-b from-[#f97316] to-[#1e40af]",
            item % 5 === 0 ? "h-[15px]" : "h-[10px]",
          )}
        />
      )),
    [],
  );

  return (
    <section className="bg-background py-32">
      <div className="container max-w-6xl mx-auto px-6 md:px-12 lg:px-16 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="max-w-4xl text-4xl font-medium tracking-tight text-foreground md:text-6xl">
          <Headline config={hero.headline} />
        </h1>
        <p className="text-base max-w-xl text-muted-foreground md:text-lg">
          {hero.subheadline}
        </p>

        <Carousel
          className="w-full"
          plugins={[
            Autoplay({
              delay: 1000,
              stopOnInteraction: true,
            }),
          ]}
          setApi={setApi}
        >
          <CarouselContent>
            {Array.from({
              length: isMobile ? hero.testimonials.length : hero.testimonials.length + 2,
            }).map((_, index) => (
              <CarouselItem key={index} className="my-10 md:basis-1/3">
                <div
                  className={`h-[420px] w-full transition-all duration-500 ease-in-out ${getRotation(index)}`}
                >
                  <div className="relative h-full w-full rounded-2xl overflow-hidden border border-border/20 apple-shadow bg-card hover:apple-shadow-hover transition-shadow duration-300">
                    <img
                      src={
                        index == hero.testimonials.length
                          ? hero.testimonials[0]?.image
                          : index == hero.testimonials.length + 1
                            ? hero.testimonials[1]?.image
                            : index == hero.testimonials.length + 2
                              ? hero.testimonials[2]?.image
                              : hero.testimonials[index]?.image
                      }
                      className="h-full w-full object-cover"
                      alt=""
                    />
                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute right-0 bottom-0 flex w-full translate-y-full flex-col items-center justify-center gap-2">
            <div className="flex gap-2">{scrollbarBars}</div>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={current}
                className="w-full text-lg font-medium"
                initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, scale: 0.9, filter: "blur(5px)" }}
                transition={{ duration: 0.5 }}
              >
                {hero.testimonials[current]?.name}
              </motion.p>
            </AnimatePresence>
            <div className="flex gap-2">{scrollbarBars}</div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export { Hero };