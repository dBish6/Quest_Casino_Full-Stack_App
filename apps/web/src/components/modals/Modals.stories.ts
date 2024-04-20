import type { Meta } from "@storybook/react";
import ModalTemplate from "./ModalTemplate";

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
