/* eslint-disable semi */
export enum TaskClusterType {
  PARAM_ONLY = 'PARAM',
  TOPOLOGY_ONLY = 'TOPOLOGY',
  PARAM_AND_TOPOLOGY = 'ALL',
}

export interface ParamWeightObject {
  [key: string]: number;
}

export default interface Task {
  _id: string;
  progress: number; // display
  dataSourceId: string; // display
  dataSource: { name: string }[];
  dataSourceName?: string;
  clusterType: TaskClusterType; // display
  paramWeight?: Array<Array<string | number>>;
  topologyWeight?: number;
  needCustomizeSimilarityApi: boolean;
  similarityApi?: string;
  updateCycle: number;
}
