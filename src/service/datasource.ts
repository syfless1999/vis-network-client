import DataSource, { DataScale } from 'src/model/datasource';
import request from 'src/util/Request';

export interface CreateDataSourceParams {
  name: string;
  url: string;
  nodeParam: string;
  edgeParam: string;
  scale: DataScale;
  needExpand: boolean;
  expandSource?: {
    url: string;
    updateCycle: number;
  }
}

export function createDataSource(params: CreateDataSourceParams) {
  return request('/datasource', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export function getDataSourceList() {
  return request<DataSource[]>('/datasource');
}
