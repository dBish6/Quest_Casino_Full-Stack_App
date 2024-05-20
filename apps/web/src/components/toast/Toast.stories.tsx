import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { nanoid } from "@reduxjs/toolkit";

import { useMockDispatch } from "@storybook/mockStore";
import { ADD_TOAST, CLEAR_TOASTS } from "@redux/toast/toastSlice";

// import Toast from "./Toast";
import { ToastsProvider } from "./Toast";

const meta: Meta<typeof ToastsProvider> = {
  title: "Components/Toast",
  component: ToastsProvider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: { type: "radio" },
      options: ["success", "error", "info"],
    },
    addToast: {
      control: { type: "boolean" },
      defaultValue: false,
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

function useAddToasts(args: Record<string, any>) {
  const dispatch = useMockDispatch();

  const mockToast = {
    id: nanoid(),
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    intent: args.intent,
  };

  useEffect(() => {
    dispatch(CLEAR_TOASTS());
    dispatch(ADD_TOAST(mockToast));
  }, []);

  useEffect(() => {
    if (args.addToast) {
      dispatch(ADD_TOAST(mockToast));
    }
  }, [args.addToast]);
}

export const Success: Story = {
    args: {
      intent: "success",
    },
    render: (args) => {
      useAddToasts(args);

      return <ToastsProvider {...args} />;
    },
  },
  Error: Story = {
    args: {
      intent: "error",
    },
    render: (args) => {
      useAddToasts(args);

      return <ToastsProvider {...args} />;
    },
  },
  Info: Story = {
    args: {
      intent: "info",
    },
    render: (args) => {
      useAddToasts(args);

      return <ToastsProvider {...args} />;
    },
  };
