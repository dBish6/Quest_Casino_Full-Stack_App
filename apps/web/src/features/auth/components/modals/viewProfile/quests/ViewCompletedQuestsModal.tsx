import type { GetUserQuestsProgressResponseDto } from "@qc/typescript/dtos/GetQuestsDto";

import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Title } from "@radix-ui/react-dialog";

import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";
import { useLazyGetQuestsQuery } from "@gameFeat/services/gameApi";

import { ModalQueryKey, ModalTemplate } from "@components/modals";
import { Icon } from "@components/common";
import { Spinner } from "@components/loaders";
import { QuestCard } from "@gameFeat/components/questCard";

import s from "./viewCompletedQuestsModal.module.css";

type QuestUserEntry = GetUserQuestsProgressResponseDto["quests"]["statistics"]["progress"]["quest"][number];
interface QuestsState {
  active: QuestUserEntry[];
  inactive: QuestUserEntry[];
}

export default function ViewCompletedQuestsModal() {
  const [searchParams] = useSearchParams(),
    username = searchParams.get(ModalQueryKey.PROFILE_QUESTS_HISTORY_MODAL);

  const [completedQuests, setCompletedQuests] = useState<QuestsState>({ active: [], inactive: [] });

  const [getQuests] = useLazyGetQuestsQuery(),
    [loading, setLoading] = useState(false);

  useResourcesLoadedEffect(() => {
    if (username) {
      setLoading(true);

      const query = getQuests({ username });
      query.then((res) => {
        if (res.isSuccess && res.data?.quests) {
          const state: QuestsState = { active: [], inactive: [] };

          for (const entry of Object.values((res.data as GetUserQuestsProgressResponseDto).quests.statistics.progress.quest)) {
            if (entry.current >= entry.quest.cap)
              state[entry.quest.status as keyof typeof state].push(entry);
          }
          setCompletedQuests(state);
        }
      }).finally(() => setLoading(false));

      return () => query.abort();
    }
  }, [username]);

  return (
    <ModalTemplate
      aria-description={`Completed quests history for ${username}`}
      aria-live="polite"
      queryKey="qhist"
      width="674px"
      className={s.modal}
    >
      {() => (
        <>
          <hgroup className="head">
            <Icon aria-hidden="true" id="scroll-48" scaleWithText />
            <Title asChild>
              <h2 title="Completed Quests">Completed Quests</h2>
            </Title>
          </hgroup>

          {loading ? (
            <Spinner intent="primary" size="xxl" />
          ) : (
            <>
              <span className={s.username}>{username}</span>

              <section aria-label="Active Completed Quests" className={s.active}>
                <div>
                  <h3 id="hRequest">Active for Round</h3>
                  <small>{completedQuests.active.length} Results</small>
                </div>
                {completedQuests.active.length ? (
                  <ul>
                    {completedQuests.active.map((entry) => (
                      <QuestCard
                        key={entry.quest.title}
                        size="md"
                        quest={entry.quest}
                        current={entry.current}
                      />
                    ))}
                  </ul>
                ) : (
                  <p>No Results</p>
                )}
              </section>

              <section aria-label="Previous Completed Quests" className={s.inactive}>
                <div>
                  <h3 id="hRequest">Previous</h3>
                  <small>{completedQuests.inactive.length} Results</small>
                </div>
                {completedQuests.inactive.length ? (
                  <ul>
                    {completedQuests.inactive.map((entry) => (
                      <QuestCard
                        key={entry.quest.title}
                        size="md"
                        quest={entry.quest}
                        current={entry.current}
                      />
                    ))}
                  </ul>
                ) : (
                  <p>No Results</p>
                )}
              </section>
            </>
          )}
        </>
      )}
    </ModalTemplate>
  );
}

ViewCompletedQuestsModal.restricted = "loggedOut";
