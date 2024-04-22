import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";

import Input from "./Input";
import { Button as CButton } from "../button";
import { Icon } from "../icon";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["lrg", "xl"],
    },
  },
  args: { onClick: fn() },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Large: Story = {
    args: {
      label: "Large",
      size: "lrg",
      required: true,
    },
  },
  ExtraLarge: Story = {
    args: {
      label: "Extra Large",
      size: "xl",
      required: true,
    },
  };

export const Password: Story = {
  argTypes: {
    size: { options: ["lrg"] },
  },
  args: {
    label: "Password",
    size: "lrg",
  },
  render: (args) => {
    const [visible, toggleVisible] = useState(false);

    return (
      <Input
        type={visible ? "text" : "password"}
        {...args}
        Button={() => (
          <CButton
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
    size: "lrg",
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
