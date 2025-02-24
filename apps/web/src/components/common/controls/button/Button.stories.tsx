import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import Button from "./Button";
import { Icon as CIcon } from "@components/common";

const COMMON_INTENTS = ["primary", "secondary", "ghost", "switch"] as const;

const meta: Meta<typeof Button> = {
  title: "Components/Controls/Button",
  component: Button,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    "aria-pressed": { control: { type: "boolean" } },
    intent: {
      control: { type: "radio" },
      options: COMMON_INTENTS
    },
    size: {
      control: { type: "select" },
      options: ["xsm", "sm", "md", "lrg", "xl"]
    },
    iconBtn: { table: { disable: true } }
  },
  args: { onClick: fn() }
};
export default meta;

type Story = StoryObj<typeof meta>;

const groupStyle: React.CSSProperties  = {
  display: "flex",
  gap: "1.5rem",
  flexWrap: "wrap"
};

export const Intents: Story = {
  argTypes: {
    intent: { table: { disable: true } }
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
      <Button intent="chip" {...args}>
        Chip
      </Button>
      <Button intent="switch" {...args}>
        Switch
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  argTypes: {
    size: { table: { disable: true } }
  },
  args: { intent: "primary" },
  render: (args) => (
    <div style={groupStyle}>
      <Button size="xsm" {...args}>
        Extra Small
      </Button>
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
  )
};

export const ExtraSmall: Story = {
    args: {
      intent: "primary",
      size: "xsm",
      children: "Extra Small"
    }
  },
  Small: Story = {
    args: {
      intent: "primary",
      size: "sm",
      children: "Small"
    }
  },
  Medium: Story = {
    argTypes: {
      intent: {
        control: { type: "radio" },
        options: [...COMMON_INTENTS, "chip"]
      }
    },
    args: {
      intent: "primary",
      size: "md",
      children: "Medium"
    }
  },
  Large: Story = {
    argTypes: {
      intent: {
        control: { type: "radio" },
        options: [...COMMON_INTENTS, "chip"]
      }
    },
    args: {
      "aria-pressed": "false",
      intent: "primary",
      size: "lrg",
      children: "Large"
    }
  },
  ExtraLarge: Story = {
    args: {
      intent: "primary",
      size: "xl",
      children: "Extra Large"
    }
  };

export const Icon: Story = {
    argTypes: {
      size: { options: ["lrg", "xl"] }
    },
    args: {
      intent: "primary",
      size: "xl",
      iconBtn: true
    },
    render: (args) => (
      <Button {...args}>
        <CIcon id={args.size === "xl" ? "bell-25" : "bell-22"} />
      </Button>
    ),
  },
  IconExit: Story = {
    argTypes: {
      "aria-pressed": { table: { disable: true } },
      intent: { options: ["exit", "exit ghost"] },
      size: { options: ["xl", "md"] }
    },
    args: {
      intent: "exit",
      size: "xl"
    },
    render: (args) => <Button {...args} />
  };
