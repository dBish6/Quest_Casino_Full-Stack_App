import type { Game } from "@qc/typescript/dtos/GetGamesDto";
import type { GameDataState } from "../../Home";
import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";
import type { SetStableSearchParams } from "@hooks/useStableSearchParams";
import type { BreakpointContextValues } from "@components/dashboard";
import type { IconIds } from "@components/common";

import { useState, useEffect, useRef } from "react";
import { m, useAnimate } from "framer-motion";

import getStorageKey from "@utils/getStorageKey";
import handleFilterActiveGames from "../../_utils/handleFilterActiveGames";

import { useUpdateUserFavouritesMutation } from "@authFeat/services/authApi";

import { ScrollArea } from "@components/scrollArea";
import { Image, Link, Icon } from "@components/common";
import { Button, Input, Select } from "@components/common/controls";
import { HoverCard } from "@components/hoverCard";
import { Form } from "@components/form";
import { Skeleton, SkeletonText } from "@components/loaders";

import s from "../../home.module.css";

interface GamesFiltersProps { 
  gameData: GameDataState["active"]; 
  setGameData: React.Dispatch<React.SetStateAction<GameDataState>>;
  searchParams: URLSearchParams;
  setStableSearchParams: SetStableSearchParams;
  user: UserCredentials | null;
}

interface GamesSearchProps extends GamesFiltersProps {
  viewport: BreakpointContextValues["viewport"];
}

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

const FILTER_OPTIONS: ReadonlyArray<Readonly<{ text: string; icon: IconIds }>> = [
  { text: "All", icon: "infinity-24" },
  { text: "Table", icon: "cards-24" },
  { text: "Slots", icon: "slot-machine-24" },
  { text: "Dice", icon: "dice-24" },
  { text: "Favourites", icon: "heart-24" }
];

export default function GamesActive({ games, user }: { games: (Game | undefined)[], user: UserCredentials | null }) {
  const [gameInfoOpen, setGameInfoOpen] = useState<{ [key: string]: boolean }>({});

  const [patchUpdateUserFavourites] = useUpdateUserFavouritesMutation(),
    selectedFavGames = useRef<SelectedFavourites>({});

  const handlePatchNewFavourites = () => {
    if (user) {
      const key = getStorageKey(user.member_id, "favorites"),
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
      window.removeEventListener("beforeunload", handlePatchNewFavourites); // On new user.

      handlePatchNewFavourites(); // Checks initially if there is any pending favourites.
      if (user)
        window.addEventListener("beforeunload", handlePatchNewFavourites);
      
      return () => {
        window.removeEventListener("beforeunload", handlePatchNewFavourites);
        handlePatchNewFavourites(); // They go to a different page.
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
  };

  const [scope, animate] = useAnimate();

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
            delay
          }
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
      getStorageKey(user!.member_id, "favorites"), JSON.stringify(selectedFavGames.current) // I know stringify sucks but we don't have a lot of games anyways.
    );

    const isPressed = target.getAttribute("aria-pressed")!;
    if (isPressed === "true") {
      target.setAttribute("aria-label", favBtnLabels[isPressed]);
      target.setAttribute("aria-pressed", "false");
    } else {
      target.setAttribute("aria-label", favBtnLabels[isPressed as "false"]);
      target.setAttribute("aria-pressed", "true");
    }
  };
  
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
                  "aria-pressed": true
                }
              : {
                  "aria-label": `Add ${game.title} to Your Favorites`,
                  "aria-pressed": false
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
              } else {
                alert("The foundation for games is currently under construction as we migrate from Quest Casino v1 to v2. The games will have their own separate dedicated server, this is no small task! Right now, the games shown are just demos since there is no way to sync user data from this app to the games. So, hold tight, exciting things are coming!");
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

export function GamesFilters({ gameData, setGameData, searchParams, ...props }: GamesFiltersProps) {
  const filterSelected = searchParams.get("fil") || "All",
    filterSelectedBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (gameData.initial.length) filterSelectedBtnRef.current!.click();
  }, [gameData.initial])

  /** Spacing between filter buttons when selected. */
  useEffect(() => {
    if (filterSelected && window.innerWidth > 1192) {
      const filterBtns = document.querySelectorAll<HTMLButtonElement>("#filters button");
      
      for (const btn of filterBtns) {
        const filter = btn.innerText
        if (filterSelected === filter && filterSelected !== "All") {
          const prevBtn = btn.previousSibling as HTMLButtonElement;
          if (prevBtn) prevBtn.style.marginRight = "0";
        } else if (filterBtns[filterBtns.length - 1].innerText !== filter) {
          btn.style.marginRight = "1rem";
        }
      }
    }
  }, [filterSelected]);

  return (
    <ScrollArea
      role="group"
      aria-label="Filter Games by Category"
      orientation="horizontal"
      id="filters"
      className={s.filters}
    >
      {FILTER_OPTIONS.map(({ text, icon }) => {
        const selected = filterSelected === text;

        return (
          <Button
            key={text}
            {...(selected && { ref: filterSelectedBtnRef })}
            aria-pressed={selected}
            aria-controls="activeGames"
            onClick={(e) =>
              handleFilterActiveGames(
                e,
                props.user,
                searchParams,
                props.setStableSearchParams,
                gameData,
                setGameData
              )
            }
          >
            <Icon aria-hidden="true" id={icon} scaleWithText />
            {text}
          </Button>
        );
      })}
    </ScrollArea>
  );
}

export function GamesSearch({
  gameData,
  setGameData,
  viewport,
  searchParams,
  setStableSearchParams,
  user
}: GamesSearchProps) {
  const search = searchParams.get("gs");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameData.initial.length && search) {
      inputRef.current!.value = search;
      handleSearch()
    }
  }, [gameData.initial]);

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
  };

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
        size={viewport === "small" ? "lrg" : "xl"}
        id="searchGames"
        type="search"
        spellCheck="false"
        Icon={<Icon id={viewport === "small" ? "search-21" : "search-24"} />}
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
      {viewport === "small" && (
        <Select
          aria-controls="activeGames"
          label="Type"
          intent="primary"
          size="lrg"
          id="type"
          defaultValue={searchParams.get("fil") || "All"}
          onInput={(e) =>
            handleFilterActiveGames(
              e,
              user,
              searchParams,
              setStableSearchParams,
              gameData,
              setGameData
            )
          }
        >
          {FILTER_OPTIONS.map(({ text }) => (
            <option key={text} value={text}>
              {text}
            </option>
          ))}
        </Select>
      )}
    </Form>
  );
}
