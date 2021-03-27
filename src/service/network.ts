import request from 'src/util/Request';
import * as network from 'src/type/network';

export interface GetLayerNetworkDataParam {
  taskId: string,
  level?: string,
}
export interface getLayerNetworkDataRes {
  nodeNum: number;
  edgeNum: number;
  network: network.LayerNetwork;
}
export function getLayerNetworkData(param: GetLayerNetworkDataParam) {
  const url = `/network/layer?${new URLSearchParams(param as unknown as Record<string, string>).toString()}`;
  return request<getLayerNetworkDataRes>(url);
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

export interface GetNodeAroundNetworkParam extends Record<string, string> {
  label: string;
  taskId: string;
  nodeId: string;
}
export function getAroundNetwork(param: GetNodeAroundNetworkParam) {
  const url = `/network/around?${new URLSearchParams(param).toString()}`;
  return request<network.Network>(url);
}
