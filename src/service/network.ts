import request from 'src/util/Request';
import * as network from 'src/type/network';

export function getLayerNetworkData(taskId: string, level?: number) {
  const url = `/network/${taskId}`;
  const prefix = level == null ? '' : `?level=${level}`;
  return request<network.LayerNetwork>([url, prefix].join(''));
}

export interface CompleteNetworkDataParam {
  label: string;
  taskId: string;
  ids: string[];
  idNetwork: network.IdNetwork;
}
export function completeNetworkData(param: CompleteNetworkDataParam) {
  const url = '/network/complete';
  return request<network.Network>(url, {
    method: 'POST',
    body: JSON.stringify(param),
    headers: {
      'content-type': 'application/json',
    },
  });
}
