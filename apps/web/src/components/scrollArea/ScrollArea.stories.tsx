import type { Meta, StoryObj } from "@storybook/react";

import { useEffect } from "react";

import ScrollArea from "./ScrollArea";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: { table: { disable: true } },
    intent: {
      control: { type: "radio" },
      options: ["primary"],
    },
    scrollbarSize: {
      control: { type: "select" },
      options: ["3", "5"],
    },
    orientation: {
      control: { type: "select" },
      options: ["vertical", "horizontal", "both"],
    },
  },
  args: {
    children: (
      <p id="txt" style={{ padding: "0.75rem 1rem" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        malesuada vehicula placerat. Duis fermentum magna ac mauris tempus
        tincidunt id a lorem. Nulla consequat iaculis ipsum. In lacus lectus,
        molestie quis luctus sed, ullamcorper eu nunc. Integer convallis mi sed
        elit facilisis suscipit. Etiam fringilla tellus nec convallis iaculis.
        Nulla ac ipsum ut dui feugiat bibendum. In mollis tempor consectetur.
        Praesent ultricies fermentum mauris eget fringilla. Quisque ornare
        ultricies cursus. Phasellus vitae magna nisi. Fusce sem metus, venenatis
        interdum tellus id, ornare eleifend tellus. Donec tempor massa tempor
        neque efficitur scelerisque. Praesent ultricies, metus non tristique
        pulvinar, urna turpis euismod quam, sit amet pellentesque risus leo
        convallis nisi.
        <br /> <br />
        Praesent feugiat a dui in blandit. Curabitur eget rutrum metus. Aliquam
        porta enim non orci cursus, at vestibulum erat commodo. Nunc diam mi,
        cursus id ante quis, commodo tempor leo. Quisque sed placerat risus.
        Cras vitae malesuada ligula. Etiam vel dictum mauris. Pellentesque
        habitant morbi tristique senectus et netus et malesuada fames ac turpis
        egestas. Nullam facilisis sodales volutpat. Etiam consectetur ornare
        mollis. Aliquam bibendum mi in hendrerit facilisis. Nullam ullamcorper
        dignissim elementum. Fusce pulvinar neque eget quam tristique, ut
        pellentesque neque efficitur. Aenean in arcu lorem. Morbi sit amet
        interdum eros. Sed finibus consequat sem, porta tempor justo imperdiet
        tempus.
        <br /> <br />
        Mauris non purus et turpis dictum tincidunt a nec augue. Mauris
        sagittis, dui eu suscipit volutpat, turpis lorem condimentum nunc, ac
        consectetur ex dolor sed magna. Duis consectetur elit quam, non
        convallis arcu scelerisque in. Fusce metus tellus, auctor eget viverra
        sagittis, lacinia eget dui. Aenean leo est, luctus sed accumsan at,
        sodales a velit. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Curabitur consectetur laoreet tincidunt. Pellentesque quam purus,
        volutpat nec ligula eget, porta placerat est. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit. Sed sollicitudin enim vitae augue
        posuere ultricies. Etiam a erat aliquet, fermentum arcu vel, condimentum
        urna. Fusce at cursus ligula. Nulla quam ante, imperdiet a erat a,
        malesuada dictum sem. Sed nec erat libero.
      </p>
    ),
    intent: "primary",
    scrollbarSize: "5",
  },
  decorators: [
    (Story, { args }) => {
      useEffect(() => {
        const viewport = document.querySelector(".viewport") as HTMLDivElement,
         orientation = args.orientation;

        viewport.style.height = "90vh";
        if (orientation === "vertical") viewport.style.maxHeight = "495px";
        else if (orientation === "horizontal") viewport.style.maxHeight = "166.167px";
        else viewport.style.maxHeight = "64px";

        viewport.style.maxWidth = "820px";

        if (["horizontal", "both"].includes(orientation)) {
          const para = document.getElementById("txt") as HTMLParagraphElement;
          para.style.whiteSpace = "nowrap";
          para.style.maxWidth = "100%";
        }
      }, []);

      return <Story />;
    },
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
    args: {
      orientation: "vertical",
    },
  },
  Horizontal: Story = {
    args: {
      orientation: "horizontal",
    },
  },
  Both: Story = {
    args: {
      orientation: "both",
    },
  };
