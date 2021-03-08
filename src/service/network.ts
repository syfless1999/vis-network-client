import request from 'src/util/Request';
import { LayerNetwork } from 'src/type/network';

export function getLayerNetworkData(taskId: string, level?: number) {
  const url = `/network/${taskId}`;
  const prefix = level == null ? '' : `?level=${level}`;
  return request<LayerNetwork>([url, prefix].join(''));
}
