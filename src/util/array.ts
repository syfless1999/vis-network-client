/**
 * delete items which fit cb function, regardless of order
 * @param arr array need to handle
 * @param cb if cb(item) returns true, this item will be deleted
 * @returns items which are deleted
 */
export const deleteItemWithoutOrder = <T>(
  arr: T[],
  cb: (item: T) => boolean,
): T[] => {
  const len = arr.length;
  let count = 0;
  const res: T[] = [];
  for (let i = 0; i < len; i += 1) {
    if (i === len - count) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      res.push(arr.pop()!);
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
  return res;
};
