import type { VariantProps } from "class-variance-authority";
import type UserCredentials from "@qc/typescript/typings/UserCredentials";

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

import { Image } from "../image";
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
  user?: UserCredentials | { avatar_url: string };
  showProfile?: boolean;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, intent, size, user, showProfile = true, ...props }, ref) => {
    const Container = user && showProfile ? ProfileHoverCard : Fragment;

    const ProfileLink = (user as UserCredentials)?.verification_token
      ? Link
      : Fragment;

    return (
      // @ts-ignore
      <Container
        {...(Container !== Fragment && {
          intent: intent || "primary",
          size: size || "sm",
          user: user!,
        })}
      >
        {/* @ts-ignore */}
        <ProfileLink
          {...(ProfileLink !== Fragment && {
            to: (user as UserCredentials).verification_token,
          })}
        >
          <div
            ref={ref}
            className={avatar({ className, intent, size })}
            {...props}
          >
            <Image
              src={user?.avatar_url ?? "/images/default.svg"}
              alt="Profile Picture"
              fill
            />
          </div>
        </ProfileLink>
      </Container>
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
  { user: UserCredentials } & VariantProps<typeof avatar>
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
