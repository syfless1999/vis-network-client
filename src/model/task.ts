/* eslint-disable semi */
export enum TaskClusterType {
  PARAM_ONLY = 'PARAM_ONLY',
  TOPOLOGY_ONLY = 'TOPOLOGY_ONLY',
  PARAM_AND_TOPOLOGY = 'PARAM_AND_TOPOLOGY',
}

export interface ParamWeightObject {
  [key: string]: number;
}

export default interface Task {
  _id: string;
  dataSourceId: string;
  clusterType: TaskClusterType;
  paramWeight?: Array<Array<string | number>>;
  topologyWeight?: number;
  needCustomizeSimilarityApi: boolean;
  similarityApi?: string;
  updateCycle: number;
}
