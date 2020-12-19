export enum NumberScale {
  THOUSAND = 1000,
  MILLION = 1000000,
  BILLION = 1000000000,
}
export function numberSimplify(num: number): string {
  if (num >= NumberScale.BILLION) {
    return `${(Math.floor(num / NumberScale.BILLION)).toString()}b`;
  }
  if (num >= NumberScale.MILLION) {
    return `${(Math.floor(num / NumberScale.MILLION)).toString()}m`;
  }
  if (num >= NumberScale.THOUSAND) {
    return `${(Math.floor(num / NumberScale.THOUSAND)).toString()}k`;
  }
  return `${num}`;
}
