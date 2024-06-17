import type { AnimationControls } from "framer-motion";

import { useRef, useState, useEffect } from "react";
import { useAnimation, m } from "framer-motion";

import { Button } from "@components/common/controls";
import { Icon, Avatar, Image, Blob } from "@components/common";

import jamieButler from "/images/jamie-butler.webp";
import larissaRebekka from "/images/larissa-rebekka.webp";
import chrisSimpson from "/images/chris-simpson.webp";
import isaacBerthild from "/images/isaac-berthild.webp";
import muggsyBogues from "/images/muggsy-bogues.webp";
import star from "/images/star.png";

import s from "./about.module.css";

interface Testimonial {
  avatarUrl: string;
  quote: string;
  from: string;
}

interface TestimonialProps extends Testimonial {
  index: number;
  controls: AnimationControls;
}

type Directions = "left" | "right";

interface CurrentState {
  slide: number;
  testimonials: Testimonial[];
}

const TESTIMONIALS: Testimonial[] = [
    {
      avatarUrl: jamieButler,
      quote:
        "The quests are actually really fun. Having a objective while playing adds a whole new level of excitement!",
      from: "Jamie Butler",
    },
    {
      avatarUrl: larissaRebekka,
      quote:
        "Online casinos always felt sketchy to me, but Quest Casino changed my mind.",
      from: "Larissa Rebekka",
    },
    {
      avatarUrl: chrisSimpson,
      quote:
        "Quest Casino is unlike any online gambling site. I've even made friends while chatting, and we play together. It's a social hub also.",
      from: "Chris Simpson",
    },
    {
      avatarUrl: isaacBerthild,
      quote:
        "Quest Casino is something else. It's clear, not like those other sites where you're never sure what's going on.",
      from: "Isaac Berthild",
    },
    {
      avatarUrl: muggsyBogues,
      quote:
        "Quest Casino is my go-to from now on. No other casino is as transparent as this one.",
      from: "Muggsy Bogues",
    },
  ],
  NUM_TESTIMONIALS = TESTIMONIALS.length;

const rotateTestimonials = (array: Testimonial[], direction: Directions) => {
  let testimonials = [...array];

  if (direction === "left") testimonials.push(testimonials.shift()!);
  else testimonials.unshift(testimonials.pop()!);

  return testimonials;
};

export default function Carousel() {
  const interactionRef = useRef(false);

  const [transitioning, setTransitioning] = useState(false),
    [current, setCurrent] = useState<CurrentState>({
      slide: 1,
      testimonials: TESTIMONIALS,
    });

  const controls = useAnimation();

  const handleTransition = async (direction: Directions) => {
    setTransitioning(true);
    const newSlide =
      direction === "left"
        ? (current.slide - 1 + NUM_TESTIMONIALS) % NUM_TESTIMONIALS
        : (current.slide + 1) % NUM_TESTIMONIALS;

    const testimonials = rotateTestimonials(current.testimonials, direction);

    setCurrent((prev) => ({ ...prev, slide: newSlide }));

    await controls.start((index) => {
      const carousel = !index && index !== 0,
        prevSlide = index === 2,
        newSlide = direction === "left" ? index === 3 : index === 1;

      return {
        ...(carousel && {
          x: direction === "left" ? ["-50%", "-69.39%"] : ["-50%", "-30.62%"],
        }),
        y: newSlide ? "12px" : 0,
        ...((newSlide || prevSlide) && { scale: prevSlide ? 1 : 1.21 }),
        marginInline: newSlide ? "2rem" : 0,

        transition: {
          x: {
            type: "spring",
            bounce: 0.26,
            duration: interactionRef.current ? 2.68 : 3.68,
          },
          y: { ease: "easeInOut", duration: 0.5 },
          scale: { ease: "easeInOut", duration: 1 },
        },
        transitionEnd: { ...(carousel && { x: "-50%" }) },
      };
    });

    setCurrent((prev) => ({ ...prev, testimonials }));
    setTransitioning(false);
  };

  useEffect(() => {
    if (!interactionRef.current) {
      const interval = setInterval(() => handleTransition("right"), 6500);
      return () => clearInterval(interval);
    }
  }, [current]);

  return (
    <div className={s.carContainer}>
      <div className={s.carousel}>
        <Button
          intent="primary"
          size="lrg"
          iconBtn
          className={s.left}
          disabled={transitioning}
          onClick={() => {
            interactionRef.current = true;
            handleTransition("left");
          }}
        >
          <Icon id="expand-22" />
        </Button>
        <div className={s.innerWrapper}>
          <m.div className={s.inner} animate={controls}>
            {current.testimonials.map((user, i) => (
              <Testimonial
                key={user.from}
                avatarUrl={user.avatarUrl}
                quote={user.quote}
                from={user.from}
                index={i}
                controls={controls}
              />
            ))}
          </m.div>
        </div>
        <Button
          intent="primary"
          size="lrg"
          iconBtn
          className={s.right}
          disabled={transitioning}
          onClick={() => {
            interactionRef.current = true;
            handleTransition("right");
          }}
        >
          <Icon id="expand-22" />
        </Button>
      </div>

      <Indicators currentSlide={current.slide} />

      {/* FIXME: Somehow this expands the scroll height?? */}
      <Blob svgWidth="1226px" svgHeight="468px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1226 468"
          preserveAspectRatio="xMidYMax meet"
        >
          <ellipse
            cx="463"
            cy="84"
            rx="463"
            ry="84"
            transform="translate(150 150)"
            fill="rgba(178,67,178,0.15)"
          />
        </svg>
      </Blob>
    </div>
  );
}

function Testimonial({
  avatarUrl,
  quote,
  from,
  index,
  controls,
}: TestimonialProps) {
  const currentSlide = index === 2;

  return (
    <m.article
      className={s.testimonial}
      data-current={currentSlide}
      animate={controls}
      custom={index}
    >
      <span className={s.bg} />
      <Avatar size="xl" user={{ avatar_url: avatarUrl }} showProfile={false} />
      <div>
        <p>"{quote}"</p>
        <div>
          <h5>
            <Icon id="quote-12" /> {from}
          </h5>
          <div className={s.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Image key={i} src={star} alt="star" load={false} />
            ))}
          </div>
        </div>
      </div>
    </m.article>
  );
}

function Indicators({ currentSlide }: { currentSlide: number }) {
  return (
    <div className={s.indicators}>
      {TESTIMONIALS.map((_, i) => (
        <span
          // data-current={
          //   i === (currentSlide <= 0 ? currentSlide : currentSlide - 1)
          // }
          data-current={i === currentSlide}
        />
      ))}
    </div>
  );
}
