/* eslint-disable semi */
export enum DataScale {
  HUNDRED = 'hundred',
  THOUSAND = 'thousand',
  MILLION = 'million',
}

export interface NodeFeature {
  total: number;
  current: number;
  param: Array<string>;
}

export interface EdgeFeature {
  total: number;
  current: number;
  param: Array<string>;
}
export interface ExpandSource {
  url: string;
  updateCycle: number;
}

export default interface DataSource {
  _id: string;
  name: string;
  url: string;
  node: NodeFeature;
  edge: EdgeFeature;
  progress?: number;
  scale?: DataScale;
  needExpand: boolean;
  expandSource?: ExpandSource;
}
