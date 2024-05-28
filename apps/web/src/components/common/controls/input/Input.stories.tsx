import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";

import Input from "./Input";
import CButton from "../button/Button";
import { Icon } from "@components/common/icon";

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
  args: { onClick: fn() },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Large: Story = {
    args: {
      label: "Large",
      intent: "primary",
      size: "lrg",
      id: "large",
      name: "large",
      required: true,
    },
  },
  ExtraLarge: Story = {
    args: {
      label: "Extra Large",
      intent: "primary",
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
    intent: "primary",
    size: "lrg",
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
        Button={() => (
          <CButton
            aria-controls="password"
            aria-expanded={visible}
            aria-pressed={visible}
            intent="ghost"
            size={args.size === "xl" ? "xl" : "lrg"}
            iconBtn
            onClick={() => toggleVisible(!visible)}
          >
            <Icon id="eye-18" />
          </CButton>
        )}
      />
    );
  },
};

export const Button: Story = {
  args: {
    label: "Button",
    intent: "primary",
    size: "lrg",
    id: "button",
    name: "button",
  },
  render: (args) => (
    <Input
      {...args}
      Button={() => (
        <CButton
          intent="primary"
          size={args.size === "lrg" ? "lrg" : "xl"}
          iconBtn
        >
          <Icon id={args.size === "lrg" ? "send-18" : "send-24"} />
        </CButton>
      )}
    />
  ),
};
