import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import Input from "./Input";
import CButton from "../button/Button";
import { Icon as CIcon } from "@components/common";

const meta: Meta<typeof Input> = {
  title: "Components/Controls/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: { type: "radio" },
      options: ["primary"]
    },
    size: {
      control: { type: "select" },
      options: ["md", "lrg", "xl"]
    },
    required: {
      control: { type: "radio" },
      options: ["true", "false", "show"]
    }
  },
  args: { intent: "primary", size: "lrg", onClick: fn() }
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Medium: Story = {
    args: {
      label: "Medium",
      size: "md",
      id: "medium",
      name: "medium",
      required: "show"
    }
  },
  Large: Story = {
    args: {
      label: "Large",
      size: "lrg",
      id: "large",
      name: "large",
      required: "show"
    }
  },
  ExtraLarge: Story = {
    args: {
      label: "Extra Large",
      size: "xl",
      id: "extraLarge",
      name: "extraLarge",
      required: "show"
    }
  };

export const Password: Story = {
  argTypes: {
    size: { options: ["lrg", "md"] }
  },
  args: {
    label: "Password",
    id: "password",
    name: "password",
    required: "show",
    type: "password",
    Button: "password"
  }
};

export const Button: Story = {
  args: {
    label: "Button",
    id: "button"
  },
  render: (args) => (
    <Input
      {...args}
      Button={
        <CButton
          intent="primary"
          size={args.size === "lrg" ? "lrg" : "xl"}
          iconBtn
        >
          <CIcon id={args.size === "lrg" ? "send-18" : "send-24"} />
        </CButton>
      }
    />
  )
};

export const Icon: Story = {
  args: {
    label: "Icon",
    id: "icon"
  },
  render: (args) => (
    <Input
      {...args}
      Icon={<CIcon id={args.size === "lrg" ? "search-18" : "search-21"} />}
    />
  )
};
