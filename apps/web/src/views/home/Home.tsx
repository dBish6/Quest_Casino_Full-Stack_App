import type { CarouselContentResponseDto } from "./Carousel";
import type Game from "@typings/Game";

import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";

import { useLazyGetGamesQuery } from "@services/api";

import { Main } from "@components/dashboard";
import { Icon } from "@components/common";
import Carousel from "./Carousel";
import { Games, GamesFilters, GamesSearch } from "./games";

import s from "./home.module.css";

export interface GameDataState {
  development: Game[];
  active: {
    initial: Game[];
    current: Game[];
    searched: Game[];
  };
}

// const MOCK_GAMES: Game[] = [
//   {
//     image: {
//       src: "images/games/Davy-Blackjack-Screenshot.webp",
//       alt: "Davy Blackjack Version 1 Game Preview Screenshot",
//     },
//     title: "Davy Assjack v1",
//     description:
//       "Our famous blackjack! Play against the dealer, whoever has the highest total number without exceeding 21 wins. It's a game of skill and techniques, so bring your best strategy.",
//     category: "slots",
//     odds: "1.00",
//     status: "active",
//     origin: "https://dbish6.github.io/Davy_Blackjack_Demo/"
//   },
//   {
//     image: {
//       src: "images/games/Davy-Blackjack-Screenshot.webp",
//       alt: "Davy Blackjack Version 1 Game Preview Screenshot",
//     },
//     title: "Slots v2",
//     description:
//       "Our famous blackjack! Play against the dealer, whoever has the highest total number without exceeding 21 wins. It's a game of skill and techniques, so bring your best strategy.",
//     category: "slots",
//     odds: "1.00",
//     status: "active",
//     origin: "https://dbish6.github.io/Davy_Blackjack_Demo/"
//   },
//   {
//     image: {
//       src: "images/games/Davy-Blackjack-Screenshot.webp",
//       alt: "Davy Blackjack Version 1 Game Preview Screenshot",
//     },
//     title: "Davy Slots v3",
//     description:
//       "Our famous blackjack! Play against the dealer, whoever has the highest total number without exceeding 21 wins. It's a game of skill and techniques, so bring your best strategy.",
//     category: "table",
//     odds: "1.00",
//     status: "active",
//     origin: "https://dbish6.github.io/Davy_Blackjack_Demo/"
//   },
//   {
//     image: {
//       src: "images/games/Davy-Blackjack-Screenshot.webp",
//       alt: "Davy Blackjack Version 1 Game Preview Screenshot",
//     },
//     title: "Hoe Down",
//     description:
//       "Our famous blackjack! Play against the dealer, whoever has the highest total number without exceeding 21 wins. It's a game of skill and techniques, so bring your best strategy.",
//     category: "table",
//     odds: "1.00",
//     origin: "https://dbish6.github.io/Davy_Blackjack_Demo/",
//     status: "active"
//   },
//   {
//     image: {
//       src: "images/games/Davy-Blackjack-Screenshot.webp",
//       alt: "Davy Blackjack Version 1 Game Preview Screenshot",
//     },
//     title: "Sic Bo",
//     description:
//       "Our famous blackjack! Play against the dealer, whoever has the highest total number without exceeding 21 wins. It's a game of skill and techniques, so bring your best strategy.",
//     category: "dice",
//     odds: "1.00",
//     origin: "https://dbish6.github.io/Davy_Blackjack_Demo/",
//     status: "active"
//   },
//   {
//     image: {
//       src: "images/games/Davy-Blackjack-Screenshot.webp",
//       alt: "Davy Blackjack Version 1 Game Preview Screenshot",
//     },
//     title: "Syn Nit",
//     description:
//       "Our famous blackjack! Play against the dealer, whoever has the highest total number without exceeding 21 wins. It's a game of skill and techniques, so bring your best strategy.",
//     category: "dice",
//     odds: "1.00",
//     origin: "https://dbish6.github.io/Davy_Blackjack_Demo/",
//     status: "active"
//   },
//   {
//     image: {
//       src: "images/games/Davy-Blackjack-Screenshot.webp",
//       alt: "Davy Blackjack Version 1 Game Preview Screenshot",
//     },
//     title: "Davy Assjack v2",
//     description:
//       "Our famous blackjack! Play against the dealer, whoever has the highest total number without exceeding 21 wins. It's a game of skill and techniques, so bring your best strategy.",
//     category: "dice",
//     odds: "1.00",
//     origin: "https://dbish6.github.io/Davy_Blackjack_Demo/",
//     status: "active"
//   },
// ];

export default function Home() {
  const carouselContent = useLoaderData() as CarouselContentResponseDto;

  const [getGames, { isFetching: gamesLoading }] = useLazyGetGamesQuery(),
    [gameData, setGameData] = useState<GameDataState>({
      development: [],
      active: { initial: [], current: [], searched: [] }
    });

  useEffect(() => {
    const query = getGames();
    query.then((res) => {
      if (res.data?.games) {
        const cat = { development: [], active: [] } as any;
        for (const game of res.data.games) 
          if (["development", "active"].includes(game.status)) cat[game.status].push(game);
        
        setGameData((prev) => ({
          development: cat.development,
          active: { ...prev.active, initial: cat.active }
        }));
      }
    });

    return () => query.abort();
  }, []);

  /**
   * Sets the height of the active games viewport to prevent the page from annoyingly scrolling 
   * up when switching to a filter with fewer games.
   */
  useEffect(() => {
    requestAnimationFrame(() => {
      const initialLength = gameData.active.initial.length;
      if (initialLength && initialLength === gameData.active.current.length) {
        const viewport = document.getElementById("gamesArea")!.children.item(1)! as HTMLDivElement;
        viewport.style.height = `${viewport.clientHeight}px`;
      }
    });
  }, [gameData.active.current]);

  return (
    <Main className={s.home}>
      <section aria-label="" className={s.hero}>
        <Carousel
          {...(!(carouselContent as any)?.data?.ERROR && { content: carouselContent })}
        />
      </section>

      <section aria-labelledby="hSoon" className={s.comingSoon} aria-busy={gamesLoading}>
        <hgroup>
          <Icon aria-hidden="true" id="alarm-clock-32" scaleWithText />
          <h2 id="hSoon">Games Coming Soon</h2>
        </hgroup>

        <Games status="development" games={gameData.development} gamesLoading={gamesLoading} />
      </section>

      <section aria-labelledby="hGames" className={s.games} aria-busy={gamesLoading} aria-live="polite">
        <header>
          <hgroup>
            <Icon aria-hidden="true" id="joystick-32" scaleWithText />
            <h2 id="hGames">Games</h2>
          </hgroup>

          <GamesFilters gameData={gameData.active} setGameData={setGameData} />
          <GamesSearch gameData={gameData.active} setGameData={setGameData} />
        </header>

        <Games status="active" games={gameData.active.current} gamesLoading={gamesLoading} />
      </section>
    </Main>
  );
}
