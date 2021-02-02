import React, { useState, useEffect } from 'react';
import GraphPanel from 'src/page/component/GraphPanel';
import { getLayerNetworkData } from 'src/service/network';
import { LayerNetwork } from 'src/type/network';

const Network = () => {
  const [sourceData, setSourceData] = useState<LayerNetwork>([]);
  useEffect(() => {
    async function fetchData() {
      const data = await getLayerNetworkData();
      setSourceData(data);
    }
    fetchData();
  }, []);
  return (
    <div>
      <GraphPanel sourceData={sourceData} />
    </div>
  );
};

export default Network;
