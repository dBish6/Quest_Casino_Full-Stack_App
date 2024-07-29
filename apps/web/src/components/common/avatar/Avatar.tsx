import type { VariantProps } from "class-variance-authority";
import type { FriendCredentials } from "@qc/typescript/typings/UserCredentials";

import { forwardRef, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
} from "@radix-ui/react-hover-card";
import { cva } from "class-variance-authority";

import { Image } from "@components/common";
import { ScrollArea } from "@components/scrollArea";

import s from "./avatar.module.css";

const avatar = cva(s.avatar, {
  variants: {
    intent: {
      primary: s.primary,
    },
    size: {
      sm: s.sm,
      md: s.md,
      lrg: s.lrg,
      xl: s.xl,
      xxl: s.xxl,
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "sm",
  },
});

export interface AvatarProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof avatar> {
  user?: Partial<FriendCredentials>; // Not only friends would be passed.
  showProfile?: boolean;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, intent, size, user, showProfile = true, ...props }, ref) => {
    const linkToProfile = 
      user && showProfile && user.legal_name && user.bio && user.verification_token;

    // FIXME: Format better. 
    return (
      <Fragment>
        {linkToProfile ? (
          <ProfileHoverCard
            intent={intent || "primary"}
            size={size || "sm"}
            user={user as FriendCredentials}
          >
            <Link
              to={`/profile/${user?.username}`}
            >
              <div
                ref={ref}
                className={avatar({ className, intent, size })}
                {...props}
              >
                <Image
                  src={user?.avatar_url ? user.avatar_url : "/images/default.svg"}
                  alt="Profile Picture"
                  fill
                />
                {/* TODO: */}
                <span role="status" className={s.activityIndie} data-status={user.status || "offline"} />
              </div>
            </Link>
          </ProfileHoverCard>
        ) : (
          <div
            ref={ref}
            className={avatar({ className, intent, size })}
            {...props}
          >
            <Image
              src={user?.avatar_url ? user.avatar_url : "/images/default.svg"}
              alt="Profile Picture"
              fill
            />
            {/* TODO: */}
            {user?.status && <span role="status" className={s.activityIndie} data-status={user.status || "offline"} />}
            {/* {user && showProfile && (
              <span role="status" className={s.activityIndie} />
            )} */}
          </div>
        )}
      </Fragment>
    );
  }
);
export default Avatar;

function ProfileHoverCard({
  children,
  intent,
  size,
  user,
}: React.PropsWithChildren<
  { user: FriendCredentials } & VariantProps<typeof avatar>
>) {
  const legalName = user.legal_name;

  return (
    <Root>
      <Trigger asChild>{children}</Trigger>

      <Portal>
        <Content
          className={`${s.profileCard} ${s[intent!]} ${s[size!]}`}
          sideOffset={6}
          asChild
        >
          <article>
            <Arrow className={s.arrow} />
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
        </Content>
      </Portal>
    </Root>
  );
}
