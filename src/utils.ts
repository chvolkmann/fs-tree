export const enumerate = function* <T>(iter: Iterable<T>) {
  let i = 0;
  for (const item of iter) {
    yield [i, item] as const;
    i += 1;
  }
};

export const replaceLast = <T>(arr: T[], val: T) => [...arr.slice(0, -1), val];

// export const applyUpdates = <T extends object>(
//   obj: T,
//   ...update: Partial<T>[]
// ): T => update.reduce((acc, obj) => ({ ...acc, ...obj }), {}) as T;
export const applyUpdates = <T extends object>(
  obj: T,
  ...update: Partial<T>[]
): T => Object.assign({}, obj, ...update) as T;
