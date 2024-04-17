import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Button from "./Button";

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
  render: (args) => (
    <div style={groupStyle}>
      <Button intent="primary" size="lrg" {...args}>
        Primary
      </Button>
      <Button intent="secondary" size="lrg" {...args}>
        Secondary
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={groupStyle}>
      <Button intent="primary" size="sm" {...args}>
        Small
      </Button>
      <Button intent="primary" size="md" {...args}>
        Medium
      </Button>
      <Button intent="primary" size="lrg" {...args}>
        Large
      </Button>
      <Button intent="primary" size="xl" {...args}>
        Extra Large
      </Button>
    </div>
  ),
};

export const IconButton: Story = {
  args: {
    children: "TODO",
  },
};

export const Small: Story = {
    args: {
      size: "sm",
      children: "Small",
    },
  },
  Medium: Story = {
    args: {
      size: "md",
      children: "Medium",
    },
  },
  Large: Story = {
    args: {
      size: "lrg",
      children: "Large",
    },
  },
  ExtraLarge: Story = {
    args: {
      size: "xl",
      children: "Extra Large",
    },
  };
