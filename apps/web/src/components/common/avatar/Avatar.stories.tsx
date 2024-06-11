import type { Meta, StoryObj } from "@storybook/react";
import { useMockSelector } from "@storybook/mockStore";

import Avatar from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: { type: "radio" },
      options: ["primary"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lrg", "xl", "xxl"],
    },
  },
  args: { showProfile: true },
  decorators: [
    (Story, { args }) => {
      const mockUser = useMockSelector((state) => state.auth.user.credentials)!;
      return <Story args={{ ...args, user: mockUser }} />;
    },
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
    render: (args) => {
      const { avatar_url, ...user } = args.user!;

      return <Avatar user={user} />;
    },
  },
  NoHoverCard: Story = {
    args: {
      showProfile: false,
    },
  };

export const Small: Story = {
    args: {
      size: "sm",
    },
  },
  Medium: Story = {
    args: {
      size: "md",
    },
  },
  Large: Story = {
    args: {
      size: "lrg",
    },
  },
  ExtraLarge: Story = {
    args: {
      size: "xl",
    },
  },
  ExtraExtraLarge: Story = {
    args: {
      size: "xxl",
    },
  };
