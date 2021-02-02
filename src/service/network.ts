import request from 'src/util/Request';
import { LayerNetwork } from 'src/type/network';

export function getLayerNetworkData() {
  return request<LayerNetwork>('/network');
}
