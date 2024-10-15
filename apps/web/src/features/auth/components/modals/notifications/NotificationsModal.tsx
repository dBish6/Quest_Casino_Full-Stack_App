import type { NotificationTypes, Notification, GetNotificationsResponseDto } from "@qc/typescript/dtos/NotificationsDto";
import type { MinUserCredentials } from "@qc/typescript/typings/UserCredentials";

import { Fragment, useRef, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, m } from "framer-motion";
import { Title } from "@radix-ui/react-dialog";

import { capitalize } from "@qc/utils";
import { fadeInOut } from "@utils/animations";
import displayNotificationMessage from "@authFeat/utils/displayNotificationMessage";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";

import { useLazyGetUserQuery, useDeleteUserNotificationsMutation, useManageFriendRequestMutation } from "@authFeat/services/authApi";

import { ModalTemplate, ModalQueryKey } from "@components/modals";
import { Icon, Avatar } from "@components/common";
import { Button } from "@components/common/controls";

import s from "./notificationsModal.module.css";
import { ScrollArea } from "@components/scrollArea";
import { Spinner } from "@components/loaders";

interface NotificationCardProps {
  notif: Notification;
  selectNotifs: Map<string, Notification> | null;
  setSelectNotifs: React.Dispatch<React.SetStateAction<Map<string, Notification> | null>>;
}

interface NotificationSectionProps extends Omit<NotificationCardProps, "notif"> {
  type: NotificationTypes | null;
  notifs: Notification[];
}

export default function NotificationsModal() {
  const [searchParams] = useSearchParams(),
    modalParam = searchParams.get(ModalQueryKey.NOTIFICATIONS_MODAL);

  const fadeVariant = fadeInOut({ in: 0.3, out: 0.58 });

  const [ getNotifications, { data, isFetching: notifsLoading }] = useLazyGetUserQuery(),
    userNotifData = data?.user as GetNotificationsResponseDto;

  const [notifications, setNotifications] = useState<GetNotificationsResponseDto["notifications"] | Notification[]>([]),
    categorizedNotificationsArr = useMemo(() => Object.entries(notifications), [notifications]);

  const [selectNotifs, setSelectNotifs] = useState<Map<string, Notification> | null>(null);

  const [postDeleteNotifications, { isLoading: deletionLoading }] = useDeleteUserNotificationsMutation();

  useResourcesLoadedEffect(() => {
    if (modalParam) {
      if (unCategorizedNotifications.current) unCategorizedNotifications.current = [];
      const query = getNotifications({ notifications: true });

      return () => query.abort();
    }
  }, [modalParam]);
  useEffect(() => {
    if (userNotifData) setNotifications(userNotifData.notifications);
  }, [userNotifData]);

  const categorize = useRef(true),
    unCategorizedNotifications = useRef<Notification[]>([]);
  const toggleCategorization = () => {
    if (selectNotifs !== null) setSelectNotifs(new Map());

    if (userNotifData) {
      if (categorize.current) {
        if (!unCategorizedNotifications.current.length) {
          for (const type in userNotifData.notifications) {
            unCategorizedNotifications.current = [
              ...unCategorizedNotifications.current,
              ...userNotifData.notifications[type as NotificationTypes]
            ];
          }
          unCategorizedNotifications.current = 
            unCategorizedNotifications.current.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } 

        setNotifications(unCategorizedNotifications.current);
      } else {
        setNotifications(userNotifData.notifications);
      }

      categorize.current = !categorize.current;
    }
  };

  const initializeDeletion = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    setSelectNotifs((prev) => {
      const target = e.currentTarget as HTMLButtonElement;

      if (prev === null) {
        target.setAttribute("aria-pressed", "true");
        return new Map();
      } else {
        target.setAttribute("aria-pressed", "false");
        return null;
      }
    });

  const handleDeleteNotifications = () => {
    postDeleteNotifications({ categorize: categorize.current, notifications: Array.from(selectNotifs!.values()) })
      .then((res) => {
        if (res.data?.message?.startsWith("Successfully")) {
          const newNotifications = res.data.user.notifications;
          if (Array.isArray(newNotifications)) unCategorizedNotifications.current = newNotifications;
          
          setNotifications(newNotifications);
          setSelectNotifs(new Map()); // Closes the confirm delete button.
        }
      })
  };

  return (
    <ModalTemplate
      aria-description="Manage your notifications and friend requests here. You can view and sort your notifications, delete selected ones, and respond to friend requests."
      queryKey={ModalQueryKey.NOTIFICATIONS_MODAL}
      width="455px"
      className={s.modal}
      onCloseAutoFocus={() => selectNotifs && setSelectNotifs(null)}
    >
      {() => (
        <>
          <hgroup className="head">
            <Icon aria-hidden="true" id="bell-45" />
            <Title asChild>
              <h2>Notifications</h2>
            </Title>
          </hgroup>

          <AnimatePresence>
            {selectNotifs && selectNotifs.size ? (
              <m.div
                role="dialog"
                aria-labelledby="deleteBtn"
                aria-description="Delete the selected notifications."
                id="delete"
                className={s.confirmDelete}
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Button
                  aria-label="Confirm Delete"
                  aria-live="polite"
                  intent="primary"
                  size="md"
                  id="deleteBtn"
                  className="formBtn"
                  disabled={deletionLoading}
                  onClick={handleDeleteNotifications}
                >
                  {deletionLoading ? (
                    <Spinner intent="primary" size="sm" />
                  ) : (
                    "Confirm Delete"
                  )}
                </Button>
              </m.div>
            ) : null}
          </AnimatePresence>

          {notifsLoading ? (
            <Spinner intent="primary" size="xxl" />
          ) : (
            <div>
              <section aria-labelledby="hRequest" className={s.friendRequests}>
                <h3 id="hRequest">Friend Requests</h3>

                {userNotifData?.friend_requests.length ? (
                  <ScrollArea id="friendScroll" orientation="horizontal">
                    <ul aria-label="Search Results" aria-live="polite">
                      {userNotifData.friend_requests.map((friendRequest, i) => (
                        <li key={i}>
                          <FriendRequestCard {...friendRequest} />
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <p>No friend requests.</p>
                )}
              </section>

              <div aria-live="polite" className={s.notifications}>
                <div role="region" aria-label="Notifications Controls" className={s.controls}>
                  <Button
                    title="Toggle Sort by Category"
                    aria-label="Sort by Category"
                    aria-pressed={categorize.current}
                    intent="primary"
                    size="lrg"
                    iconBtn
                    onClick={toggleCategorization}
                  >
                    <Icon aria-hidden="true" id="border-horizontal-24" />
                  </Button>
                  <Button
                    title="Delete Notifications"
                    aria-label="Delete Notifications"
                    aria-haspopup="true"
                    aria-expanded={!!selectNotifs}
                    aria-controls="radio"
                    intent="primary"
                    size="lrg"
                    iconBtn
                    onClick={initializeDeletion}
                  >
                    <Icon aria-hidden="true" id="delete-19" />
                  </Button>
                </div>

                {Array.isArray(notifications) ? (
                  notifications.length ? (
                    <NotificationSection
                      type={null}
                      notifs={notifications}
                      selectNotifs={selectNotifs}
                      setSelectNotifs={setSelectNotifs}
                    />
                  ) : (
                    <p>You have no notifications.</p>
                  )
                ) : (
                  categorizedNotificationsArr.map(([type, notifs]) => (
                    <NotificationSection
                      key={type}
                      type={type as NotificationTypes}
                      notifs={notifs}
                      selectNotifs={selectNotifs}
                      setSelectNotifs={setSelectNotifs}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </ModalTemplate>
  );
}

// TODO: Make the content in the sections collapsible when length.
function NotificationSection({ type, notifs, selectNotifs, setSelectNotifs }: NotificationSectionProps) {
  const Element = type ? "section" : Fragment;

  return (
    <Element {...(type && { "aria-labelledby": type })}>
      <div className={s.sectionHead} data-catagories={!!type}>
        {type && <h3 id={type}>{capitalize(type)}</h3>}
        <small>{notifs.length} Results</small>
      </div>

      <ul aria-label={`${type} notifications`}>
        {notifs.map((notif, i) => (
          <li key={notif.notification_id}>
            <NotificationCard
              notif={{ ...notif, type: type ?? notif.type }}
              selectNotifs={selectNotifs}
              setSelectNotifs={setSelectNotifs}
            />
          </li>
        ))}
      </ul>
    </Element>
  );
}

function NotificationCard({ notif, selectNotifs, setSelectNotifs }: NotificationCardProps) {
  const btnRef = useRef<HTMLButtonElement>(null),
    { title, message, link, created_at } = notif;
  
  const handleSelection = () => {
    const radio = btnRef.current!;

    if (radio.getAttribute("aria-checked") === "false") {
      radio.setAttribute("aria-checked", "true")
      // Sadly, React only notices state changes for maps only if the reference to the Map changes.
      setSelectNotifs((prev) =>
        prev!.size
          ? prev!.set(notif.notification_id, notif) : new Map(prev).set(notif.notification_id, notif)
      );
    } else {
      radio.setAttribute("aria-checked", "false")
      setSelectNotifs((prev) => {
        prev!.delete(notif.notification_id)
        return prev!.size ? prev : new Map();
      });
    }
  }

  return (
    <article>
      <div>
        <h4>{title}</h4>
        <time dateTime={created_at}>
          {new Date(created_at).toLocaleString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).replace(",", "")}
        </time>
      </div>

      <div>
        <p>{displayNotificationMessage(message, link)}</p>
      
        {selectNotifs && (
          <Button
            role="radio"
            aria-checked="false"
            aria-haspopup="dialog"
            aria-expanded={Boolean(selectNotifs?.size)}
            aria-controls="delete"
            ref={btnRef}
            intent="secondary"
            size="xsm"
            id="radio"
            iconBtn
            onClick={handleSelection}
          />
        )}
      </div>
    </article>
  );
}

function FriendRequestCard(friend: MinUserCredentials) {
  const { avatar_url, legal_name, username } = friend,
    actions = ["add", "decline"] as const;

  const [emitManageFriends, { data: manageFriendsData, error: manageFriendsError }] = useManageFriendRequestMutation(),
    [loading, setLoading] = useState({ add: false, decline: false, fulfilled: false });

  const resError = isFetchBaseQueryError(manageFriendsError) && (manageFriendsError.data as any)?.ERROR;

  const handleAction = (action: typeof actions[number]) => {
    setLoading((prev) => ({ ...prev, [action]: true }));

    emitManageFriends({ action_type: action, friend })
      .then((res) => {
        setLoading((prev) => ({ ...prev, fulfilled: !!res.data }));
        document.getElementById("friendScroll")!
          .style.setProperty("--_res-message-height", "20px");
      })
      .finally(() => setLoading((prev) => ({ ...prev, [action]: false })));
  };

  return (
    <>
      <article
        title={`${username} | ${legal_name.first} ${legal_name.last}`}
        aria-label={`Accept ${username}'s Friend Request`}
        {...(loading.fulfilled && { style: { opacity: 0.68 } })}
      >
        <div>
          <Avatar size="md" user={{ avatar_url }} />
          <hgroup role="group" aria-roledescription="heading group">
            <h4>{username}</h4>
            <p aria-roledescription="subtitle">{`${legal_name.first} ${legal_name.last}`}</p>
          </hgroup>
        </div>
        <div>
          {actions.map((action) => {
            const label = action === "add" ? "Accept" : "Decline",
              loadingAction = loading[action as keyof typeof loading];

            return (
              <Button
                key={action}
                aria-label={label}
                aria-live="polite"
                {...((resError || manageFriendsData) && { "aria-describedby": "msg" })}
                intent={action === "add" ? "primary" : "ghost"}
                size="xsm"
                className="formBtn"
                disabled={loadingAction || loading.fulfilled}
                onClick={() => handleAction(action)}
              >
                {loadingAction ? <Spinner intent="primary" size="sm" /> : label}
              </Button>
            );
          })}
        </div>
      </article>
      {(resError || manageFriendsData) && (
        <small role={resError ? "alert" : "status"} id="msg">
          {resError || manageFriendsData!.message}
        </small>
      )}
    </>
  );
}

NotificationsModal.restricted = "loggedOut";
