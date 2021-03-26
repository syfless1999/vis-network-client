import { Features } from 'src/type/network';

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

export const strings2Features = (str: string): Features => {
  const feats: Features = {};
  const descs = str.match(/\S+( \[\S+ \d+\])+/g);
  if (!descs) return feats;
  descs.forEach((desc) => {
    const pns = desc.match(/^\w+/g);
    if (!pns || !pns[0]) return;
    const [propName] = pns;
    feats[propName] = {};
    const features = desc.match(/\[\S+ \d+\]/g);
    if (!features || !features.length) return;
    features.forEach((f) => {
      const fs = f.slice(1, f.length - 1);
      const [p, count] = fs.split(' ');
      feats[propName][p] = Number(count);
    });
  });
  return feats;
};
