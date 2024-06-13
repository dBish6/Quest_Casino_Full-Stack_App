import { Main } from "@components/dashboard";
import { Avatar } from "@components/common/avatar";
import { Icon } from "@components/common/icon";
import { Button } from "@components/common/controls";
import { Image } from "@components/common/image";
import { Link } from "@components/common/link";

import jamieButler from "/images/jamie-butler.webp";
import larissaRebekka from "/images/larissa-rebekka.webp";
import chrisSimpson from "/images/chris-simpson.webp";
import isaacBerthild from "/images/isaac-berthild.webp";
import muggsyBogues from "/images/muggsy-bogues.webp";
import star from "/images/star.png";
import s from "./about.module.css";

interface TestimonialProps {
  avatarUrl: string;
  quote: string;
  from: string;
}

export const meta = {
  title: "About | Quest Casino",
  description: "Learn more about Quest Casino...",
};

export default function About() {
  const TESTIMONIALS = [
    {
      avatarUrl: jamieButler,
      quote: "This is a fantastic place!",
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
        "Quest Casino is unlike any online gambling site I've seen before. I've even made a few friends while chatting, and we play together. It's a social hub also.",
      from: "Chris Simpson",
    },
    {
      avatarUrl: isaacBerthild,
      quote:
        "Quest Casino is something else. It's clear, not like those other sites where you're never sure what's going on.",
      from: "Isaac Berthild ",
    },
    {
      avatarUrl: muggsyBogues,
      quote: "Best casino ever.",
      from: "Muggsy Bogues",
    },
  ];

  return (
    <Main className={s.about}>
      <section className={s.welcome}>
        <h2>Welcome! 👋</h2>
        <p>
          Welcome to Quest Casino, where your gaming experience is our top
          priority. We've built this platform with a commitment to transparency,
          user-friendliness, and, most importantly, your safety. We understand
          the concerns many players have had with other online casinos, and
          we're here to change that.
        </p>
      </section>

      <section className={s.safety}>
        <h2>Safety and Security!</h2>
        <p>
          At Quest Casino, we take your safety seriously. Our platform employs
          cutting-edge security measures to protect your data and financial
          transactions. You can enjoy your favorite games with confidence,
          knowing that your information is safeguarded.
        </p>
      </section>

      <section className={s.play}>
        <h2>Fair Play and Transparency</h2>
        <p>
          Unlike many other online casinos, Quest Casino is committed to
          transparency. We provide you with insights into our operations,
          including our odds and how they work; you can view the odds for games
          when pressing the info icon on the game. We believe that every player
          deserves to know the ins and outs of the games they enjoy.
        </p>
      </section>

      <section className={s.community}>
        <h2>Community and Connections</h2>
        <p>
          Beyond gaming, Quest Casino is also your place to connect with a
          vibrant community of players. Share your experiences, make friends,
          and enhance the social aspect of your gaming journey.
        </p>
        <p>
          Quest Casino is more than just a gaming platform; it's a haven for
          players looking for a safe, transparent, and enjoyable online casino
          experience. Join us today and become a part of our growing community!
          We're here to provide a new standard in online gaming.
        </p>

        <div className={s.carousel}>
          <Button className={s.left} />
          {TESTIMONIALS.map((user) => (
            <Testimonial
              key={user.from}
              avatarUrl={user.avatarUrl}
              quote={user.quote}
              from={user.from}
            />
          ))}
          <Button className={s.right} />
        </div>
      </section>

      <footer>
        <p>
          learn more about the creator:
          <br />
          <Link to="https://www.davidbishop.info" external>
            https://www.davidbishop.info
          </Link>
        </p>
      </footer>
    </Main>
  );
}

function Testimonial({ avatarUrl, quote, from }: TestimonialProps) {
  return (
    <article className={s.testimonial}>
      <Avatar />
      <div>
        <q>{quote}</q>
        <div>
          <h5>
            <Icon id="quote-16" /> {from}
          </h5>
          <Stars />
        </div>
      </div>
    </article>
  );
}

function Stars() {
  return Array.from({ length: 5 }).map((_, i) => (
    <Image key={i} src={star} alt="star" load={false} />
  ));
}

function Blob() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1226" height="468">
      <ellipse
        cx="463"
        cy="84"
        rx="463"
        ry="84"
        transform="translate(150 150)"
        fill="rgba(178,67,178,0.15)"
      />
    </svg>
  );
}
