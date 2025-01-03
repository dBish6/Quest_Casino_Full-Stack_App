import type { Meta, StoryObj } from "@storybook/react";

import Image from "./Image";

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
    )
  ]
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Load: Story = {
    args: {
      src: "/images/muggsy-bogues.webp",
      alt: "Muggsy Bogues",
      load: true,
      size: {},
      fill: false
    }
  },
  NoLoad: Story = {
    args: {
      src: "/images/muggsy-bogues.webp",
      alt: "Muggsy Bogues",
      load: false,
      size: {},
      fill: false
    }
  };

export const Fill: Story = {
    args: {
      src: "/images/muggsy-bogues.webp",
      alt: "Muggsy Bogues",
      load: true,
      size: {},
      fill: true
    }
  },
  CustomSize: Story = {
    args: {
      src: "/images/muggsy-bogues.webp",
      alt: "Muggsy Bogues",
      load: true,
      size: {
        width: "200px",
        height: "200px",
      },
      fill: false
    }
  };

export const Multiple: Story = {
  args: {
    load: true,
    size: {},
    fill: false,
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Image {...args} src="/images/muggsy-bogues.webp" alt="Muggsy Bogues" />
      <Image {...args} src="/images/larissa-rebekka.webp" alt="Larissa Rebekka" />
      <Image {...args} src="/images/chris-simpson.webp" alt="Chris Simpson" />
    </div>
  )
};
