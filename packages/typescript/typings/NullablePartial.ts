type NullablePartial<T> = {
  [K in keyof T]: T[K] | null;
};
export default NullablePartial;
