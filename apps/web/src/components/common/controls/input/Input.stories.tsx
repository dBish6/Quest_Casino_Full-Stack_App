import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";

import Input from "./Input";
import CButton from "../button/Button";
import { Icon as CIcon } from "@components/common";

const meta: Meta<typeof Input> = {
  title: "Components/Controls/Input",
  component: Input,
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
      options: ["lrg", "xl"],
    },
    required: {
      control: { type: "radio" },
      options: ["true", "false", "show"],
    },
  },
  args: { intent: "primary", size: "lrg", onClick: fn() },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Large: Story = {
    args: {
      label: "Large",
      id: "large",
      name: "large",
      required: true,
    },
  },
  ExtraLarge: Story = {
    args: {
      label: "Extra Large",
      size: "xl",
      id: "extraLarge",
      name: "extraLarge",
      required: true,
    },
  };

export const Password: Story = {
  argTypes: {
    size: { options: ["lrg"] },
  },
  args: {
    label: "Password",
    id: "password",
    name: "password",
    required: true,
  },
  render: (args) => {
    const [visible, toggleVisible] = useState(false);

    return (
      <Input
        type={visible ? "text" : "password"}
        {...args}
        Button={
          <CButton
            aria-controls="password"
            aria-expanded={visible}
            aria-pressed={visible}
            intent="ghost"
            size={args.size === "xl" ? "xl" : "lrg"}
            iconBtn
            onClick={() => toggleVisible(!visible)}
          >
            <CIcon id="eye-18" />
          </CButton>
        }
      />
    );
  },
};

export const Button: Story = {
  args: {
    label: "Button",
    id: "button",
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
  ),
};

export const Icon: Story = {
  args: {
    label: "Icon",
    id: "icon",
  },
  render: (args) => (
    <Input
      {...args}
      Icon={<CIcon id={args.size === "lrg" ? "search-18" : "search-21"} />}
    />
  ),
};
