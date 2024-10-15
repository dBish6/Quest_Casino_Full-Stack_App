import type Game from "@typings/Game";

import { Image } from "@components/common";
import { Skeleton, SkeletonText, SkeletonTitle } from "@components/loaders";

import s from "../home.module.css";

export default function GamesDev({ games }: { games: (Game | undefined)[] }) {
  return games.map((game, i) => <GameCardDev key={i} game={game} />)
}

function GameCardDev({ game }: { game: Game | undefined }) {
  return (
    <li className={`${s.game}${!game ? " " + s.skeleton : ""}`}>
      {game ? (
        <>
          <Image src={game.image.src} alt={game.image.alt} />
          <div>
            <h3 className="hUnderline">{game.title}</h3>
            <p>{game.description}</p>
          </div>
        </>
      ) : (
        <>
          <Skeleton className={s.imgSkel} />
          <div>
            <SkeletonTitle size="h3" style={{ width: Math.random() < 0.5 ? "65%" : "78%" }} />
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonText
                key={i}
                size="paraSmall"
                className={s.paraSkel}
                {...(i === 2 && { style: { width: Math.random() < 0.5 ? "32%" : "72%" } })}
              />
            ))}
          </div>
        </>
      )}
    </li>
  );
}
