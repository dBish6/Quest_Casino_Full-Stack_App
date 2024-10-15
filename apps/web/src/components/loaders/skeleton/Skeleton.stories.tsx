import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton, SkeletonTitle, SkeletonText, SkeletonAvatar } from "./Skeleton";

const size = Object.freeze({
  title: ["h4", "h3", "h2", "h1"],
  text: ["paraXxSmall", "paraXSmall", "paraSmall", "paraRegular", "paraMedium", "paraLarge"],
  avatar: ["sm", "md", "lrg", "xl", "xxl"]
});

const defaultMeta: Meta<typeof Skeleton> = {
  title: "Components/Loaders/Skeleton",
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    (Story, { args }) => {
      return (
        <div style={{ display: "grid", width: "100%", height: "100vh", padding: "1rem", margin: "auto" }}>
          <Story {...args} />
        </div>
      );
    },
  ],
};
export default defaultMeta;

const metaTitle: Meta<typeof SkeletonTitle> = {
    ...defaultMeta,
    component: SkeletonTitle,
    argTypes: {
      size: {
        control: { type: "select" },
        options: size.title,
      },
    },
  },
  metaText: Meta<typeof SkeletonText> = {
    ...defaultMeta,
    component: SkeletonText,
    argTypes: {
      size: {
        control: { type: "select" },
        options: size.text
      }
    },
  }, 
  metaAvatar: Meta<typeof SkeletonAvatar> = {
    ...defaultMeta,
    component: SkeletonAvatar,
    argTypes: {
      size: {
        control: { type: "select" },
        options: size.avatar,
      },
    },
  };


const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1.5rem",
  flexWrap: "wrap",
};

const singleStyle: React.CSSProperties = {
  justifySelf: "center",
  alignSelf: "center",
};

const groupStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
    gap: "1rem",
    maxWidth: "456px",
  },
  referenceTextStyle: React.CSSProperties = {
    textAlign: "right",
    whiteSpace: "nowrap"
  }

export const Title: StoryObj<typeof metaTitle> = {
    ...metaTitle,
    args: { size: "h2" },
    render: (args) => <SkeletonTitle size={args.size} style={singleStyle} {...args} />
  },
  TitleSizes: StoryObj<typeof metaTitle> = {
    ...metaTitle,
    argTypes: { size: { table: { disable: true } } },
    render: (args) => (
      <div style={containerStyle}>
        {size.title.map((size) => {
          const Heading = size as "h1";

          return (
            <div style={groupStyle}>
              <Heading style={{ font: `var(--${size})`, ...referenceTextStyle }}>
                Lorem ipsum
              </Heading>
              <SkeletonTitle size={size as typeof args.size} style={{ width: "100%", minWidth: "100px" }} {...args} />
            </div>
          );
        })}
      </div>
    ),
  };

export const Text: StoryObj<typeof metaText> = {
    ...metaText,
    args: { size: "paraMedium" },
    render: (args) => <SkeletonText size={args.size} style={{ width: "75%", ...singleStyle }} {...args} />
  },
  TextSizes: StoryObj<typeof metaText> = {
    ...metaText,
    argTypes: { size: { table: { disable: true } } },
    render: (args) => (
      <div style={containerStyle}>
        {size.text.map((size) => (
          <div style={groupStyle}>
            <p style={{ font: `var(--${size})`, ...referenceTextStyle }}>
              Lorem ipsum dolor sit amet
            </p>
            <SkeletonText size={size as typeof args.size} style={{ minWidth: "100px" }} {...args} />
          </div>
        ))}
      </div>
    ),
  };

export const Avatar: StoryObj<typeof metaAvatar> = {
    ...metaAvatar,
    args: { size: "lrg" },
    render: (args) => <SkeletonAvatar size={args.size} style={singleStyle} {...args} />
  },
  AvatarSizes: StoryObj<typeof metaAvatar> = {
    ...metaAvatar,
    argTypes: { size: { table: { disable: true } } },
    render: (args) => (
      <div style={{ justifyContent: "center", ...containerStyle }}>
        {size.avatar.map((size) => (
          <SkeletonAvatar size={size as typeof args.size} {...args} />
        ))}
      </div>
    ),
  };
