import React, {
  useState, useEffect, createContext,
} from 'react';
import { useParams } from 'react-router-dom';

import GraphPanel from 'src/page/component/GraphPanel';
import { getLayerNetworkData } from 'src/service/network';
import { LayerNetwork } from 'src/type/network';
import { mergeTwoLayerNetwork } from 'src/util/network';

export interface NetworkParam {
  taskId: string;
}

export const TaskIdContext = createContext<string>('');

const Network = () => {
  const [sourceData, setSourceData] = useState<LayerNetwork>([]);
  const { taskId } = useParams<NetworkParam>();
  const expandSourceDataByLevel = async (level: number): Promise<LayerNetwork> => {
    const expandData = await getLayerNetworkData(taskId, level);
    const newSourceData = mergeTwoLayerNetwork(sourceData, expandData);
    setSourceData(newSourceData);
    return newSourceData;
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
          sourceData={sourceData}
          expandSourceDataByLevel={expandSourceDataByLevel}
        />
      </TaskIdContext.Provider>
    </div>
  );
};

export default Network;
