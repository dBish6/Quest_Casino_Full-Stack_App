import type { Bonus } from "@qc/typescript/dtos/GetBonusesDto";

import { useSearchParams } from "react-router-dom";
import { useRef, useState } from "react";

import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";

import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";

import { useLazyGetBonusesQuery, useManageProgressMutation } from "@gameFeat/services/gameApi";

import { ModalQueryKey } from "@components/modals";
import { Spinner } from "@components/loaders";
import { Button } from "@components/common/controls";
import { Icon } from "@components/common";

import s from "./bonuses.module.css";

interface BonusCardProps {
  current?: number;
  activated?: number;
  bonus: Bonus;
  manageProgressLoading: { [questTitle: string]: boolean };
  setManageProgressLoading: React.Dispatch<
    React.SetStateAction<{
      [questTitle: string]: boolean;
    }>
  >;
}

export default function Bonuses({ setRenewsIn }: { setRenewsIn: React.Dispatch<React.SetStateAction<string>> }) {
    const [searchParams] = useSearchParams(),
      slide = searchParams.get(ModalQueryKey.MENU_MODAL) === "Bonuses";

    const user = useAppSelector(selectUserCredentials);

    const [getBonuses, { data, isFetching: bonusesLoading }] = useLazyGetBonusesQuery(),
      activeBonuses = data?.bonuses;

    const [manageProgressLoading, setManageProgressLoading] = useState<{ [questTitle: string]: boolean }>({});
  
    useResourcesLoadedEffect(() => {
      if (slide) {
        const query = getBonuses(undefined, true);
        query.then((res) => {
          if (res.isSuccess && res.data?.renew) setRenewsIn(res.data.renew);
        });

        return () => query.abort();
      }
    }, [slide]);

  return (
    <div
      role="group"
      aria-label="Bonuses"
      aria-roledescription="slide"
      id="lSlide"
      className={s.bonuses}
    >
      {bonusesLoading ? (
        <Spinner intent="primary" size="xxl" />
      ) : activeBonuses?.length ? (
        <ul aria-describedby="stepsList" className="slideContent">
          {activeBonuses.map((bonus) => (
            <BonusCard
              key={bonus.title}
              current={user!.statistics.progress.bonus[bonus.title]?.current}
              activated={user!.statistics.progress.bonus[bonus.title]?.activated}
              bonus={bonus}
              manageProgressLoading={manageProgressLoading}
              setManageProgressLoading={setManageProgressLoading}
            />
          ))}
        </ul>
      ) : (
        <p>Unexpectedly no bonuses.</p>
      )}
    </div>
  );
}

function BonusCard({
  current = 0,
  activated = 0,
  bonus,
  manageProgressLoading,
  setManageProgressLoading
}: BonusCardProps) {
  const label = useRef({
    title: "title-" + bonus.title.toLowerCase().replaceAll(" ", "-"),
    progress: "title-" + bonus.title.toLowerCase().replaceAll(" ", "-")
  });

  const activatable = current >= bonus.cap;

  const [emitManageProgress] = useManageProgressMutation();

  const activateBonus = () => {
    setManageProgressLoading({ [bonus.title]: true });
    emitManageProgress(
      { type: "bonus", action: "activate", title: bonus.title }
    ).finally(() => setManageProgressLoading({}));
  };

  return (
    <li
      aria-labelledby={label.current.title}
      aria-describedby={label.current.progress}
    >
      <article
        className={s.bonus}
        // We know that the bonus is/was active if there is a activated in the doc.
        data-completed={!!activated}
      >
        <hgroup role="group" aria-roledescription="heading group">
          <h3 id={label.current.title} className="hUnderline">{bonus.title}</h3>
          <p aria-roledescription="subtitle">X{bonus.multiplier} Bonus</p>
        </hgroup>
        
        {!activatable ? (
          <div className={s.progress}>
            <div
              role="meter"
              aria-label="Bonus Progress"
              aria-describedby={label.current.progress}
              aria-valuemin={0}
              aria-valuemax={bonus.cap}
              aria-valuenow={current}
              className={s.meter}
            >
              <div className={s.fill} style={{ width: `${(current / bonus.cap) * 100}%` }} />
            </div>
            <div className={s.completion}>
              <span id={label.current.progress}>{current}/{bonus.cap}</span>
            </div>
          </div>
        ) : (
          <Button
            intent="primary"
            size="lrg"
            id={label.current.progress}
            className={s.claim}
            disabled={!!activated || !!Object.values(manageProgressLoading).length}
            onClick={activateBonus}
          >
            {manageProgressLoading[bonus.title] ? (
              <Spinner intent="primary" size="md" />
            ) : activated > Date.now() ? (
              "Activated"
            ) : !!activated ? (
              <>
                Claimed
                <Icon
                  aria-label="Completed"
                  id="check-mark-16"
                  fill="var(--c-status-green)"
                />
              </>
            ) : (
              "Claim"
            )}
          </Button>
        )}
      </article>
    </li>
  );
}
