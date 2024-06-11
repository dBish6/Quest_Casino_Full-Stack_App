import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import Link from "./Link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: { type: "radio" },
      options: ["primary"],
    },
  },
  args: { onClick: fn() },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
      intent: "primary",
      to: "",
      external: false,
      children: "Link",
    },
  },
  External: Story = {
    args: {
      intent: "primary",
      to: "https://www.davidbishop.info",
      external: true,
      children: "Link",
    },
  };
