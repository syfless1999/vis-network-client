import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ContextMenu } from '@antv/graphin-components';
import Graphin, { Behaviors, Utils } from '@antv/graphin';

import AsyncNodeMenu, { CompleteNetworkFunc } from 'src/page/component/GraphPanel/AsyncNodeMenu';
import Toolbar from 'src/page/component/GraphPanel/Toolbar';
import LayoutSelector, { layouts } from 'src/page/component/GraphPanel/LayoutSelector';
import SearchBar from 'src/page/component/SearchBar';
import { completeNetworkData, getLayerNetworkData, getAroundNetwork } from 'src/service/network';
import * as network from 'src/type/network';
import { mergeTwoLayerNetwork, networkStyleWrapper } from 'src/util/network';
import LevelSelector from '../component/GraphPanel/LevelSelector';

interface NetworkParam {
  label: string;
  taskId: string;
}
interface NetworkState {
  layout: string;
  level: number;
  displayData: network.Network;
  sourceData: network.LayerNetwork;
}

const {
  ZoomCanvas, FitView, ActivateRelations,
} = Behaviors;

const Network = () => {
  const [state, setState] = useState<NetworkState>({
    layout: 'circle',
    level: -1,
    displayData: { nodes: [], edges: [] },
    sourceData: [],
  });
  const {
    layout, level, displayData, sourceData,
  } = state;
  const maxLevel = sourceData.length - 1;
  const { label, taskId } = useParams<NetworkParam>();
  // memo: layout type
  const layoutType = useMemo(() => layouts.find((l) => l.type === layout), [layout]);
  // memo: styled network data
  const styledData = useMemo(() => {
    const { edges } = displayData;
    displayData.edges = Utils.processEdges(edges, { poly: 50, loop: 10 });
    return networkStyleWrapper(displayData);
  }, [displayData]);

  const handleChangeLayout = (value: string) => setState((prev) => ({
    ...prev,
    layout: value,
  }));
  const handleDisplayDataChange = (newDisplayData: network.Network) => {
    setState((prev) => ({
      ...prev,
      displayData: newDisplayData,
    }));
  };
  const handleLevelChange = React.useCallback(async (value: number) => {
    if (value < 0 || value > maxLevel) return;
    let targetNetwork = sourceData[value];
    let newSourceData = sourceData;
    if (!targetNetwork) {
      const expandData = await getLayerNetworkData({
        taskId,
        level: value.toString(),
      });
      newSourceData = mergeTwoLayerNetwork(sourceData, expandData);
      targetNetwork = newSourceData[value];
    }
    setState((prev) => ({
      ...prev,
      level: value,
      sourceData: newSourceData,
      displayData: targetNetwork || prev.displayData,
    }));
  }, [sourceData]);
  const handleSearchNodeAroundNetwork = async (nodeId: string) => {
    const newDisplayData = await getAroundNetwork({ label, taskId, nodeId });
    handleDisplayDataChange(newDisplayData);
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
      const data = await getLayerNetworkData({ taskId });
      const maxLevel = data.length - 1;
      setState((prev) => ({
        ...prev,
        level: maxLevel,
        sourceData: data,
        displayData: data[maxLevel] || prev.displayData,
      }));
    }
    fetchData();
  }, []);

  return (
    <div>
      <Graphin
        data={styledData}
        layout={layoutType}
      >
        {/* 右键菜单：展开、收起 */}
        <ContextMenu>
          <AsyncNodeMenu
            displayData={displayData}
            setDisplayData={handleDisplayDataChange}
            completeNetwork={completeNetwork}
          />
        </ContextMenu>
        {/* 滚轮放大缩小：关闭 */}
        <ZoomCanvas disabled />
        {/* 关联高亮 */}
        <ActivateRelations />
        {/* 适应视图 */}
        <FitView />
        <Toolbar />
        <SearchBar onSearch={handleSearchNodeAroundNetwork} />
        {/* 布局类型选择 */}
        <LayoutSelector value={layout} onChange={handleChangeLayout} />
        {/* 聚类等级 */}
        <LevelSelector
          level={level}
          maxLevel={maxLevel}
          onChange={handleLevelChange}
        />
      </Graphin>
    </div>
  );
};

export default Network;
