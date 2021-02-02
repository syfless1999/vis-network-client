import Task, { TaskClusterType } from 'src/model/task';
import request from 'src/util/Request';

export interface CreateTaskParams {
  dataSourceId: string;
  clusterType: TaskClusterType;
  paramWeight?: Array<Array<string | number>>;
  topologyWeight?: number;
  needCustomizeSimilarityApi: boolean;
  similarityApi?: string;
  updateCycle: number;
}

export function createTask(params: CreateTaskParams) {
  return request('/task', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export function getTaskList() {
  return request<Task[]>('/task');
}
