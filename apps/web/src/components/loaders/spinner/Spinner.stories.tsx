import type { Meta, StoryObj } from "@storybook/react";

import Spinner from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/Loaders/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: { type: "radio" },
      options: ["primary", "secondary"],
    },
    size: { table: { disable: true } },
  },
  args: { intent: "primary" },
};
export default meta;

type Story = StoryObj<typeof meta>;

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
