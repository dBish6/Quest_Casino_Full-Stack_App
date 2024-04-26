import type { Meta, StoryObj } from "@storybook/react";
import ModalTemplate from "./ModalTemplate";
import { RegisterModal } from "@authFeat/components/modals";

const meta: Meta<typeof ModalTemplate> = {
  title: "Components/Modal",
  component: ModalTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  //   args: { onClick: fn() },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Register: Story = {
  render: () => <RegisterModal />,
};
