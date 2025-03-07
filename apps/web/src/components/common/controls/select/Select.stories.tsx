import type { Meta, StoryObj } from "@storybook/react";
import type Country from "@qc/typescript/typings/Country";

import { fn } from "@storybook/test";
import { useState } from "react";

import Select from "./Select";
import { Spinner } from "@components/loaders";

const meta: Meta<typeof Select> = {
  title: "Components/Controls/Select",
  component: Select,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: { type: "radio" },
      options: ["primary", "callingCode"]
    }
  },
  args: { onClick: fn() }
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
  "Option 8"
];

export const Medium: Story = {
    args: {
      label: "Medium",
      intent: "primary",
      size: "md",
      required: true
    },
    render: (args) => (
      <Select {...args} style={{ width: "182px" }}>
        {mockOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    )
  },
  Large: Story = {
    args: {
      label: "Large",
      intent: "primary",
      size: "lrg",
      required: true
    },
    render: (args) => (
      <Select {...args} style={{ width: "208px" }}>
        {mockOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    )
  };

export const CallingCode: Story = {
  args: {
    label: "Code",
    intent: "callingCode",
    size: "lrg"
  },
  render: (args) => {
    const [data, setData] = useState<Country[] | null>(null);

    return (
      <Select
        {...args}
        Loader={<Spinner intent="primary" size="sm" />}
        loaderTrigger={!!data && !data.length}
        style={{ width: "126px" }}
        onFocus={async () => {
          if (!data?.length) {
            setData([]);
            const { COUNTRIES } = await import("@qc/constants");
            setTimeout(() => {
              setData(COUNTRIES);
            }, 1500);
          }
        }}
      >
        {data?.length &&
          data.map((country) => (
            <option key={country.name} value={country.callingCode}>
              {country.abbr} {country.callingCode}
            </option>
          ))}
      </Select>
    );
  }
};

export const Ghost: Story = {
  argTypes: {
    intent: { table: { disable: true } }
  },
  args: { intent: "ghost" },
  render: (args) => (
    <Select {...args} style={{ width: "85px" }} defaultValue="Option 4">
      {mockOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
  ),
};
