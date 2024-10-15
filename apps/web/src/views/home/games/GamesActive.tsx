import type Game from "@typings/Game";
import type { GameDataState } from "../Home";
import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";
import type { IconIds } from "@components/common";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { m, useAnimate } from "framer-motion";

import useUser from "@authFeat/hooks/useUser";
import useStableSearchParams from "@hooks/useStableSearchParams";
import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";
import { useUpdateUserFavouritesMutation } from "@authFeat/services/authApi";

import { ScrollArea } from "@components/scrollArea";
import { Image, Link, Icon } from "@components/common";
import { Button, Input } from "@components/common/controls";
import { HoverCard } from "@components/hoverCard";
import { Form } from "@components/form";
import { Skeleton, SkeletonText } from "@components/loaders";

import s from "../home.module.css";

interface GamesFiltersProps { 
  gameData: GameDataState["active"]; 
  setGameData: React.Dispatch<React.SetStateAction<GameDataState>>;
}

interface GamesSearchProps extends GamesFiltersProps {}

interface SelectedFavourites {
  [title: string]: "delete" | "add"
}
interface GameCardActiveProps {
  games: (Game | undefined)[];
  game: Game | undefined;
  gameInfoOpen: { [key: string]: boolean };
  setGameInfoOpen: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  selectedFavGames: React.MutableRefObject<SelectedFavourites>;
  index: number;
  user: UserCredentials | null;
}

const BTN_MAP: ReadonlyArray<Readonly<{ text: string; icon: IconIds }>> = [
  { text: "All", icon: "infinity-24" },
  { text: "Table", icon: "cards-24" },
  { text: "Slots", icon: "slot-machine-24" },
  { text: "Dice", icon: "dice-24" },
  { text: "Favourites", icon: "heart-24" }
]

/** 
 * To store selected favorites that are pending to be sent to the server.
 * Used in case of logout when favorites are selected.
 */
function getStorageKey (username: string) {
  return `qc:user:${username}:favorites`;
};

export default function GamesActive({ games }: { games: (Game | undefined)[] }) {
  const [gameInfoOpen, setGameInfoOpen] = useState<{ [key: string]: boolean }>({});

  const user = useUser();

  const [patchUpdateUserFavourites] = useUpdateUserFavouritesMutation(),
    selectedFavGames = useRef<SelectedFavourites>({});

  function handlePostNewFavourites() {
    if (user) {
      const key = getStorageKey(user.username),
        pendingFavourites: SelectedFavourites = JSON.parse(localStorage.getItem(key) || "{}");

      const favouritesArr = Object.entries(pendingFavourites).map(([title, op]) => ({ op, title }));
      if (favouritesArr.length) {
        patchUpdateUserFavourites({ favourites: favouritesArr })
          .finally(() => localStorage.removeItem(key));
      }
    }
  }
  
  useEffect(() => {
    if (games.length) {
      window.removeEventListener("beforeunload", handlePostNewFavourites); // On new user.

      handlePostNewFavourites(); // Checks initially if there is any pending favourites.
      if (user) 
        window.addEventListener("beforeunload", handlePostNewFavourites);
      
      return () => {
        window.removeEventListener("beforeunload", handlePostNewFavourites);
        handlePostNewFavourites(); // They go to a different page.
      }
    }
  }, [user?.type]); // user.type so it can run on login/logout and not credential updates.
  
  return (
    <>
      {games.map((game, i) => (
        <GameCardActive
          key={game?.title || i}
          games={games}
          game={game}
          gameInfoOpen={gameInfoOpen}
          setGameInfoOpen={setGameInfoOpen}
          selectedFavGames={selectedFavGames}
          index={i}
          user={user}
        />
      ))}
    </>
  );
}

function GameCardActive({ game, user, selectedFavGames, ...props }: GameCardActiveProps) {
  const keepInfoOpen = props.gameInfoOpen[game?.title || ""],
    isFavourite = !!(user?.favourites ?? {})[game?.title || ""], // Is a favourite from the db.
    isSelected = selectedFavGames.current[game?.title || ""];

  const favBtnLabels = {
    "true": `Add ${game?.title} to Your Favorites`,
    "false": `Remove ${game?.title} from your favorites`
  }

  const [scope, animate] = useAnimate()

  useEffect(() => {
    const delay = props.index * 0.05;

    if (game) 
      animate(scope.current,
        { opacity: [0, 1], y: ["1rem", "0"] },
        { opacity: { duration: 0.85, delay },
          y: {
            type: "spring",
            mass: 1.5,
            stiffness: 175,
            damping: 14,
            delay,
          },
        }
      );
  }, [props.games]);

  const handleFavouriteSelected = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.currentTarget;

    const gameTitle = game!.title,
      operation = isFavourite ? "delete" : "add";

    const isActive = target.getAttribute("aria-pressed") === (operation === "delete" ? "true" : "false");
    if (isActive) selectedFavGames.current[gameTitle] = operation;
    else delete selectedFavGames.current[gameTitle];

    localStorage.setItem(
      getStorageKey(user!.username), JSON.stringify(selectedFavGames.current) // I know stringify sucks but we don't have a lot of games anyways.
    );

    const isPressed = target.getAttribute("aria-pressed")!;
    if (isPressed === "true") {
      target.setAttribute("aria-label", favBtnLabels[isPressed]);
      target.setAttribute("aria-pressed", "false");
    } else {
      target.setAttribute("aria-label", favBtnLabels[isPressed as "false"]);
      target.setAttribute("aria-pressed", "true");
    }
  }
  
  return (
    <li id="game" className={`${s.game}${!game ? " " + s.skeleton : ""}`}>
      {game ? (
        <m.article ref={scope}>
          <div>
            <HoverCard
              id={`info-${game.title}`}
              className={s.gameInfoCard}
              Trigger={
                <Button 
                  aria-controls={`info-${game.title}`}
                  aria-expanded={keepInfoOpen ? "true" : "false"}
                  aria-pressed={keepInfoOpen}
                  size="sm"
                  iconBtn
                  onClick={() => props.setGameInfoOpen(() => (keepInfoOpen ? {} : { [game.title]: true }))}
                >
                  <Icon id="info-12" />
                </Button>
              }
              open={keepInfoOpen}
              openDelay={keepInfoOpen ? 0 : 500}
            >
              {({ Arrow }) => (
                <>
                  <Arrow />
                  <p aria-label="Game Odds Ratio">Odds: <span>{game.odds}</span></p>
                  <ScrollArea orientation="both">
                    <p id={`gameDescrip-${game.title}`}>{game.description}</p>
                  </ScrollArea>
                </>
              )}
            </HoverCard>
            <Button
              {...(Boolean(
                (isFavourite && !isSelected) ||
                  (isSelected && isSelected !== "delete")
              )
                ? {
                  "aria-label": `Remove ${game.title} from your favorites`,
                  "aria-pressed": true,
                }
              : {
                  "aria-label": `Add ${game.title} to Your Favorites`,
                  "aria-pressed": false,
                })}
              size="sm"
              iconBtn
              onClick={(e) => handleFavouriteSelected(e)}
            >
              <Icon id="heart-13" />
            </Button>
          </div>

          <Link 
            aria-labelledby={`gameTitle-${game.title}`} 
            aria-describedby={`gameDescrip-${game.title}`} 
            to={game.origin} 
            external
            onClick={(e) => {
              if (!e.currentTarget.href) {
                e.preventDefault();
                alert("Somehow this game has no game link, we're working to resolve this issue as soon as possible.");
              }
            }}
          >
            <div className={s.inner}>
              <Image src={game.image.src} alt={game.image.alt} fill />
            </div>

            <h3 id={`gameTitle-${game.title}`}>{game.title}</h3>
          </Link>
        </m.article>
      ) : (
        <>
          <Skeleton className={s.imgSkel} />
          <SkeletonText size="paraSmall" style={{ width: Math.random() < 0.5 ? "55%" : "75%" }} />
        </>
      )}
    </li>
  );
}

export function GamesFilters({ gameData, setGameData }: GamesFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams(),
    filterSelected = searchParams.get("fil") || "All",
    filterSelectedBtnRef = useRef<HTMLButtonElement>(null);

  const user = useAppSelector(selectUserCredentials);

  useEffect(() => {
    if (gameData.initial.length) filterSelectedBtnRef.current!.click();
  }, [gameData.initial])

  /** Spacing between filter buttons when selected. */
  useEffect(() => {
    if (filterSelected) {
      const filterBtns = document.querySelectorAll<HTMLButtonElement>("#filters button");
      
      for (const btn of filterBtns) {
        const filter = btn.innerText
        if (filterSelected === filter && filterSelected !== "All") {
          const prevBtn = btn.previousSibling as HTMLButtonElement;
          if (prevBtn) prevBtn.style.marginRight = "0";
        } else {
        btn.style.marginRight = "1rem";
        }
      }
    }
  }, [filterSelected]);

  const handleFilterActiveGames = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.currentTarget,
      filter = target.innerText;

    let filteredGames = gameData.searched.length ? gameData.searched : gameData.initial;
    if (filter !== "All") {
      const filter = target.innerText;

      filteredGames = filteredGames.filter((game) =>
        filter === "Favourites"
          ? game.title === (user?.favourites[game.title] || "")
          : game.category === filter.toLowerCase()
      );
      searchParams.set("fil", filter);
    } else {
      searchParams.delete("fil");
    }

    setGameData((prev) => ({
      ...prev,
      active: { ...prev.active, current: filteredGames }
    }));
    setSearchParams(searchParams);
  }

  return (
    <div role="group" aria-label="Filter Games by Category" id="filters" className={s.filters}>
      {/* TODO: Probably would be a scrollArea (try not to till a point). */}
      {BTN_MAP.map(({ text, icon }) => {
        const selected = filterSelected === text;

        return (
          <Button
            key={text}
            {...(selected && { ref: filterSelectedBtnRef })}
            aria-pressed={selected}
            aria-controls="activeGames"
            onClick={(e) => handleFilterActiveGames(e)}
          >
            <Icon aria-hidden="true" id={icon} scaleWithText />
            {text}
          </Button>
        );
      })}
    </div>
  )
}

export function GamesSearch({ gameData, setGameData }: GamesSearchProps) {
  const [searchParams, setStableSearchParams] = useStableSearchParams(),
    search = searchParams.get("gs");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameData.initial.length && search) {
      inputRef.current!.value = search;
      handleSearch()
    }
  }, [gameData.initial])
  

  const handleSearch = () => {
    const value = inputRef.current!.value.toLowerCase().trim();

    let searchedGames = gameData.current.length ? gameData.current : gameData.initial;
    if (value) {
      searchedGames = searchedGames.filter((game) => {
          return game.title.toLowerCase().includes(value);
      });
      searchParams.set("gs", value);
    } else {
      searchParams.delete("gs");
    }

    setGameData((prev) => ({
      ...prev,
      active: { 
        ...prev.active, 
        current: searchedGames, 
        ...(searchedGames && { searched: searchedGames })
      }
    }));
    setStableSearchParams();
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <Input
        ref={inputRef}
        aria-label="Search Games by Title in the Active List"
        aria-controls="activeGames"
        label="Search"
        intent="primary"
        size="xl"
        id="searchGames"
        type="search"
        spellCheck="false"
        Icon={<Icon id="search-24" />}
        onInput={(e) => {
          if (!e.currentTarget.value) {
            setGameData((prev) => ({
              ...prev,
              active: { ...prev.active, current: gameData.initial, searched: [] }
            }));
            setStableSearchParams((params) => {
              params.delete("gs");
              return params;
            });
          }
        }}
      />
    </Form>
  )
}
