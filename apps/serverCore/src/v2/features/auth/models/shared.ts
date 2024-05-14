import type { SchemaOptions, SchemaDefinition } from "mongoose";

const shared: {
  fields: SchemaDefinition;
  options: SchemaOptions<any>;
} = {
  fields: {},
  options: {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
};

export default shared;
