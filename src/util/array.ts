export const deleteItemWithoutOrder = <T>(
  arr: T[],
  cb: (item: T) => boolean,
): void => {
  const len = arr.length;
  let count = 0;
  for (let i = 0; i < len; i += 1) {
    if (i === len - count) {
      arr.pop();
      // eslint-disable-next-line no-continue
      continue;
    }
    if (cb(arr[i])) {
      const lastIndex = len - count - 1;
      // eslint-disable-next-line no-param-reassign
      [arr[i], arr[lastIndex]] = [arr[lastIndex], arr[i]];
      count += 1;
      i -= 1;
    }
  }
};
