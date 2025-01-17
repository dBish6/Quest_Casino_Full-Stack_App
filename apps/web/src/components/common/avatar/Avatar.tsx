import type { VariantProps } from "class-variance-authority";
import type { FriendCredentials } from "@qc/typescript/typings/UserCredentials";

import { forwardRef, Fragment } from "react";
import { cva } from "class-variance-authority";

import { ModalTrigger } from "@components/modals";
import { Image } from "@components/common";
import { HoverCard } from "@components/hoverCard";
import { ScrollArea } from "@components/scrollArea";

import s from "./avatar.module.css";

const avatar = cva(s.avatar, {
  variants: {
    intent: {
      primary: s.primary
    },
    size: {
      sm: s.sm,
      md: s.md,
      lrg: s.lrg,
      xl: s.xl,
      xxl: s.xxl,
      xxxl: s.xxxl
    }
  },
  defaultVariants: {
    intent: "primary",
    size: "sm"
  }
});

export interface AvatarProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof avatar> {
  user?: Partial<FriendCredentials>; // Not only friends would be passed.
  linkProfile?: boolean;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, intent = "primary", size = "sm", user, linkProfile = true, ...props }, ref) => {
    const ProfileShortView = linkProfile && user?.legal_name && user?.username ? ProfileHoverCard : Fragment,
      ProfileLink = linkProfile && user?.username ? ModalTrigger : "a"; // it has to be an "a" to match the server.
    const userStatus = user?.activity?.status;

    return (
      // @ts-ignore
      <ProfileShortView
        {...(ProfileShortView !== Fragment && {
          intent: intent,
          size: size,
          user: user
        })}
      >
        {/* @ts-ignore */}
        <ProfileLink
          {...(ProfileLink !== "a" 
            ? { query: { param: "prof", value: encodeURIComponent(user!.username!) } }
            : {
                role: "presentation",
                tabIndex: -1,
                onClick: (e) => e.preventDefault(),
                style: { cursor: "default" }
              })}
        >
          <div
            ref={ref}
            className={avatar({ className, intent, size })}
            {...props}
          >
            <Image
              src={user?.avatar_url || "/images/default.svg"}
              alt="Profile Picture"
              fill
            />
            <span
              aria-label={userStatus}
              {...(!userStatus && {
                "aria-hidden": "true",
                style: { display: "none" }
              })}
              className={s.activityIndie}
              data-status={userStatus}
            />
          </div>
        </ProfileLink>
      </ProfileShortView>
    );
  }
);
export default Avatar;

function ProfileHoverCard(
  { children, intent, size, user }: { children: React.ReactElement; user: FriendCredentials } & VariantProps<typeof avatar>
) {
  const legalName = user.legal_name;

  return (
    <HoverCard
      className={`${s.profileCard} ${s[intent!]} ${s[size!]}`}
      Trigger={children}
      asChild
    >
      {({ Arrow }) => (
        <article>
          <Arrow />
          <ScrollArea orientation="vertical">
            <hgroup>
              <h4>{user.username}</h4>
              <div role="presentation">
                <span>{`${legalName.first} ${legalName.last}`}</span>
                {/* TODO: Country flags. */}
                {/* {user.country} */}
              </div>
            </hgroup>

            {user.bio && <p>{user.bio}</p>}
          </ScrollArea>
        </article>
      )}
    </HoverCard>
  );
}
