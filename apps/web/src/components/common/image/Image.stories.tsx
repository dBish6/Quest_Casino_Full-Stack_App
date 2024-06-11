import type { Meta, StoryObj } from "@storybook/react";

import Image from "./Image";

import muggsyBogues from "/images/muggsy-bogues.webp";
import larissaRebekka from "/images/larissa-rebekka.webp";
import chrisSimpson from "/images/chris-simpson.webp";

const meta: Meta<typeof Image> = {
  title: "Components/Image",
  component: Image,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Load: Story = {
    args: {
      src: muggsyBogues,
      alt: "Muggsy Bogues",
      load: true,
      size: {},
      fill: false,
    },
  },
  NoLoad: Story = {
    args: {
      src: muggsyBogues,
      alt: "Muggsy Bogues",
      load: false,
      size: {},
      fill: false,
    },
  };

export const Fill: Story = {
    args: {
      src: muggsyBogues,
      alt: "Muggsy Bogues",
      load: true,
      size: {},
      fill: true,
    },
  },
  CustomSize: Story = {
    args: {
      src: muggsyBogues,
      alt: "Muggsy Bogues",
      load: true,
      size: {
        width: "200px",
        height: "200px",
      },
      fill: false,
    },
  };

export const Multiple: Story = {
  args: {
    load: true,
    size: {},
    fill: false,
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Image {...args} src={muggsyBogues} alt="Muggsy Bogues" />
      <Image {...args} src={larissaRebekka} alt="Larissa Rebekka" />
      <Image {...args} src={chrisSimpson} alt="Chris Simpson" />
    </div>
  ),
};
