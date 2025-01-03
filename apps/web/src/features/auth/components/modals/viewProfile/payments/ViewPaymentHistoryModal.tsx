import type { PaymentHistoryEntry } from "@qc/typescript/dtos/PaymentHistoryDto";

import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Title } from "@radix-ui/react-dialog";

import formatCurrency from "@authFeat/utils/formatCurrency";
import { capitalize } from "@qc/utils";

import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";
import { useLazyGetPaymentHistoryQuery } from "@gameFeat/services/gameApi";

import { ModalQueryKey, ModalTemplate } from "@components/modals";
import { Select } from "@components/common/controls";
import { Spinner } from "@components/loaders";

import s from "./viewPaymentHistoryModal.module.css";

export default function ViewPaymentHistoryModal() {
  const [searchParams] = useSearchParams(),
    username = searchParams.get(ModalQueryKey.PROFILE_PAYMENT_HISTORY_MODAL);

  const [getPaymentHistory, { data: historyData, isFetching: historyLoading }] = useLazyGetPaymentHistoryQuery(),
    [history, setHistory] = useState<PaymentHistoryEntry[]>([]);

  useResourcesLoadedEffect(() => {
    if (username) {
      const query = getPaymentHistory();
      query.then((res) => {
        if (res.isSuccess && res.data?.user.payment_history) {
          setHistory(res.data?.user.payment_history);
        }
      });

      return () => query.abort();
    }
  }, [username]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (history) {
      const type = e.target.value,
        filterData = historyData!.user.payment_history;

      setHistory(type === "all" ? filterData : filterData.filter((entry) => entry.type === type));
    }
  };

  return (
    <ModalTemplate
      aria-description={`Payment history for ${username}`}
      queryKey="phist"
      width="455px"
      className={s.modal}
    >
      {() => (
        <>
          <Title asChild>
            <h2>Payment History</h2>
          </Title>
          {/* TODO: Limit on back-end, whatever it will be. */}
          <p>Only the last 50 payments are shown here.</p>

          <div>
            <Select
              aria-controls="payHistoryList"
              label="Filter by"
              intent="ghost"
              id="paymentTypeSelect"
              defaultValue="all"
              onInput={handleSort}
            >
              <option value="all">All</option>
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
            </Select>
            <small>{history.length} Results</small>
          </div>
          {historyLoading ? (
            <Spinner intent="primary" size="xl" />
          ) : history.length ? (
            <>
              <ul id="payHistoryList" aria-live="polite" className={s.list}>
                {history.map((history) => (
                  <PaymentCard history={history} />
                ))}
              </ul>
            </>
          ) : (
            <p>No Results</p>
          )}
        </>
      )}
    </ModalTemplate>
  );
}

function PaymentCard({ history }: { history: PaymentHistoryEntry }) {
  return (
    <li>
      <article data-type={history.type}>
        <div>
          <h4>{capitalize(history.type)}</h4>
          <time dateTime={history.timestamp}>
            {new Date(history.timestamp).toLocaleString("en-CA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            }).replace(",", "")}
          </time>
        </div>
        <p>{formatCurrency(history.amount)}</p>
      </article>
    </li>
  );
}

ViewPaymentHistoryModal.restricted = "loggedOut";
