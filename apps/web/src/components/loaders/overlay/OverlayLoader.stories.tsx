import type { Meta, StoryObj } from "@storybook/react";
import OverlayLoader from "./OverlayLoader";

const meta: Meta<typeof OverlayLoader> = {
  title: "Components/Loaders/Overlay",
  component: OverlayLoader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      document.body.style.minHeight = "100vh";
      return <Story />;
    },
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {},
  Message: Story = {
    args: {
      message: "Verifying...",
    },
  };
