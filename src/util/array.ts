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
  let count = 0;
  const res: T[] = [];
  for (let i = 0; i < arr.length;) {
    if (i === arr.length - count) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      res.push(arr.pop()!);
      count -= 1;
      // eslint-disable-next-line no-continue
      continue;
    }
    if (cb(arr[i])) {
      const lastIndex = arr.length - count - 1;
      // eslint-disable-next-line no-param-reassign
      [arr[i], arr[lastIndex]] = [arr[lastIndex], arr[i]];
      count += 1;
      // eslint-disable-next-line no-continue
      continue;
    }
    i += 1;
  }
  return res;
};

export const uniqueArray = <T>(
  arr: T[],
  index: (item: T) => unknown,
): T[] => {
  const map = new Map();
  return arr.filter((a) => !map.has(index(a)) && map.set(index(a), 1));
};
