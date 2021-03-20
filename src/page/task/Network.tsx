import React, {
  useState, useEffect, createContext,
} from 'react';
import { useParams } from 'react-router-dom';

import GraphPanel, { CompleteNetworkFunc } from 'src/page/component/GraphPanel';
import { completeNetworkData, getLayerNetworkData } from 'src/service/network';
import * as network from 'src/type/network';
import { mergeTwoLayerNetwork } from 'src/util/network';

export interface NetworkParam {
  label: string;
  taskId: string;
}

export const TaskIdContext = createContext<string>('');

const Network = () => {
  const [sourceData, setSourceData] = useState<network.LayerNetwork>([]);
  const { label, taskId } = useParams<NetworkParam>();
  const expandSourceDataByLevel = async (level: number): Promise<network.LayerNetwork> => {
    const expandData = await getLayerNetworkData(taskId, level);
    const newSourceData = mergeTwoLayerNetwork(sourceData, expandData);
    setSourceData(newSourceData);
    return newSourceData;
  };
  const completeNetwork: CompleteNetworkFunc = async (currentNetwork, newIds) => {
    const newNetwork = await completeNetworkData({
      label,
      taskId,
      ids: newIds,
      idNetwork: currentNetwork,
    });
    return newNetwork;
  };
  useEffect(() => {
    async function fetchData() {
      const data = await getLayerNetworkData(taskId);
      setSourceData(data);
    }
    fetchData();
  }, []);
  return (
    <div>
      <TaskIdContext.Provider value={taskId}>
        <GraphPanel
          async
          completeNetwork={completeNetwork}
          sourceData={sourceData}
          expandSourceDataByLevel={expandSourceDataByLevel}
        />
      </TaskIdContext.Provider>
    </div>
  );
};

export default Network;
