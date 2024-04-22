import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Button from "./Button";
import { Icon as CIcon } from "../icon";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: { type: "radio" },
      options: ["primary", "secondary"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lrg", "xl"],
    },
    iconBtn: { table: { disable: true } },
  },
  args: { onClick: fn() },
};
export default meta;

type Story = StoryObj<typeof meta>;

const groupStyle = {
  display: "flex",
  gap: "1.5rem",
  flexWrap: "wrap",
} as const;

export const Intents: Story = {
  argTypes: {
    intent: { table: { disable: true } },
  },
  args: {
    size: "lrg",
  },
  render: (args) => (
    <div style={groupStyle}>
      <Button intent="primary" {...args}>
        Primary
      </Button>
      <Button intent="secondary" {...args}>
        Secondary
      </Button>
      <Button intent="ghost" {...args}>
        Ghost
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
  },
  args: {
    intent: "primary",
  },
  render: (args) => (
    <div style={groupStyle}>
      <Button size="sm" {...args}>
        Small
      </Button>
      <Button size="md" {...args}>
        Medium
      </Button>
      <Button size="lrg" {...args}>
        Large
      </Button>
      <Button size="xl" {...args}>
        Extra Large
      </Button>
    </div>
  ),
};

export const Small: Story = {
    args: {
      intent: "primary",
      size: "sm",
      children: "Small",
    },
  },
  Medium: Story = {
    args: {
      intent: "primary",
      size: "md",
      children: "Medium",
    },
  },
  Large: Story = {
    args: {
      intent: "primary",
      size: "lrg",
      children: "Large",
    },
  },
  ExtraLarge: Story = {
    args: {
      intent: "primary",
      size: "xl",
      children: "Extra Large",
    },
  };

export const Icon: Story = {
    argTypes: {
      size: { options: ["lrg", "xl"] },
    },
    args: {
      intent: "primary",
      size: "xl",
      iconBtn: true,
    },
    render: (args) => (
      <Button {...args}>
        <CIcon id={args.size === "xl" ? "bell-25" : "bell-22"} />
      </Button>
    ),
  },
  IconExit: Story = {
    argTypes: {
      intent: { table: { disable: true } },
      size: { options: ["xl", "sm"] },
    },
    args: {
      intent: "exit",
      size: "xl",
      iconBtn: true,
    },
    render: (args) => <Button {...args} />,
  };
