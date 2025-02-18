type DeepReadonly<T> =
  T extends (...args: any[]) => any
    ? T
    : T extends Map<infer K, infer V>
      ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
      : T extends Set<infer S>
        ? ReadonlySet<DeepReadonly<S>>
        : T extends object
          ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
          : T;
        
export default DeepReadonly;
