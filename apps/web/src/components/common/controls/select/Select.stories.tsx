import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import COUNTRIES from "@authFeat/constants/COUNTRIES";

import Select from "./Select";

const meta: Meta<typeof Select> = {
  title: "Components/Controls/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: { type: "radio" },
      options: ["primary", "callingCode"],
    },
  },
  args: { onClick: fn() },
};
export default meta;

type Story = StoryObj<typeof meta>;

const mockOptions = [
  "Option 1",
  "Option 2",
  "Option 3",
  "Option 4",
  "Option 5",
  "Option 6",
  "Option 7",
  "Option 8",
];

export const Medium: Story = {
    args: {
      label: "Medium",
      intent: "primary",
      size: "md",
      required: true,
    },
    render: (args) => (
      <Select style={{ width: "182px" }} {...args}>
        {mockOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    ),
  },
  Large: Story = {
    args: {
      label: "Large",
      intent: "primary",
      size: "lrg",
      required: true,
    },
    render: (args) => (
      <Select style={{ width: "208px" }} {...args}>
        {mockOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    ),
  };

export const CallingCode: Story = {
  args: {
    label: "Code",
    intent: "callingCode",
    size: "lrg",
  },
  render: (args) => (
    <Select style={{ width: "126px" }} {...args}>
      {COUNTRIES.map((country) => (
        <option key={country.name} value={country.callingCode}>
          {country.abbr} {country.callingCode}
        </option>
      ))}
    </Select>
  ),
};
