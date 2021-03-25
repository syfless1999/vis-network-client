export const getJoinString = (...args: string[]) => args.join('_');

export const count2String = (num: number | string): string => {
  const n = typeof num === 'string' ? Number(num) : num;
  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(1)}m`;
  }
  if (n >= 10000) {
    return `${(n / 10000).toFixed(1)}w`;
  }
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`;
  }
  return `${n}`;
};
