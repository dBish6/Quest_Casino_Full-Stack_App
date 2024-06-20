import { Main } from "@components/dashboard";
import Carousel from "./Carousel";
import { Link } from "@components/common";

import s from "./about.module.css";

export const meta = {
  title: "About | Quest Casino",
  description: "Learn more about Quest Casino...",
};

export default function About() {
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

        <Carousel />
      </section>

      <footer>
        <p>learn more about the creator:</p>
        <Link
          intent="primary"
          to="https://www.davidbishop.info"
          external
          title="The Creator of Quest Casino Personal Website"
        >
          https://www.davidbishop.info
        </Link>
      </footer>
    </Main>
  );
}
