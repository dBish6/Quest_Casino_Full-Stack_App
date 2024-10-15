import deepmerge, { type Options } from "@fastify/deepmerge";

export function deepMerge(toMerge: any[], options?: Options): any {
  const merge = deepmerge({ ...options, ...(toMerge.length > 2 && { all: true }) });
  // @ts-ignore
  return merge(...toMerge);
};
