import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ContextMenu } from '@antv/graphin-components';
import Graphin, { Behaviors, Utils } from '@antv/graphin';

import AsyncNodeMenu, { CompleteNetworkFunc } from 'src/page/component/GraphPanel/AsyncNodeMenu';
import Toolbar from 'src/page/component/GraphPanel/Toolbar';
import LayoutSelector, { layouts } from 'src/page/component/GraphPanel/LayoutSelector';
import SearchBar from 'src/page/component/SearchBar';
import LevelSelector from 'src/page/component/GraphPanel/LevelSelector';
import FeatureSelector from 'src/page/component/GraphPanel/FeatureSelector';
import { completeNetworkData, getLayerNetworkData, getAroundNetwork } from 'src/service/network';
import * as network from 'src/type/network';
import { mergeTwoLayerNetwork } from 'src/util/network';
import { networkStyleWrapper } from 'src/util/network/styleWrapper';
import register from 'src/util/g6Node/register';
import { getOneTask } from 'src/service/task';
import Task from 'src/model/task';

interface NetworkParam {
  taskId: string;
}
interface NetworkState {
  layout: string;
  level: number;
  displayData: network.Network;
  sourceData: network.LayerNetwork;
  feature: string;
  task?: Task;
}

const {
  ZoomCanvas, FitView, ActivateRelations,
} = Behaviors;
export const FEATURE_ALL = 'all';

// register custom g6 source
register();

const Network = () => {
  const [state, setState] = useState<NetworkState>({
    layout: 'grid',
    level: -1,
    displayData: { nodes: [], edges: [] },
    feature: FEATURE_ALL,
    sourceData: [],
    task: undefined,
  });
  const {
    layout, level, displayData, sourceData, feature, task,
  } = state;
  const maxLevel = sourceData.length - 1;
  const { taskId } = useParams<NetworkParam>();
  let label: string;
  if (task) {
    const { dataSource } = task;
    label = dataSource[0].name;
  }

  const handleChangeLayout = (value: string) => setState((prev) => ({
    ...prev,
    layout: value,
  }));
  const handleFeatureChange = (value: string) => setState((prev) => ({
    ...prev,
    feature: value,
  }));
  const handleDisplayDataChange = React.useCallback((newDisplayData: network.Network) => {
    setState((prev) => ({
      ...prev,
      displayData: newDisplayData,
    }));
  }, []);
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
    if (!label) return;
    const newDisplayData = await getAroundNetwork({ label, taskId, nodeId });
    handleDisplayDataChange(newDisplayData);
  };
  const handleCompleteNetwork: CompleteNetworkFunc = async (currentNetwork, newIds) => {
    if (!label) return { nodes: [], edges: [] };
    const newNetwork = await completeNetworkData({
      label,
      taskId,
      ids: newIds,
      idNetwork: currentNetwork,
    });
    return newNetwork;
  };

  // memo: layout type
  const layoutType = useMemo(() => layouts.find((l) => l.type === layout), [layout]);
  // memo: styled network data
  const styledData = useMemo(() => {
    const { edges } = displayData;
    displayData.edges = Utils.processEdges(edges, { poly: 50, loop: 10 });
    return networkStyleWrapper(displayData, feature);
  }, [displayData, feature]);

  useEffect(() => {
    async function fetchData() {
      const [task, data] = await Promise.all([
        getOneTask({ id: taskId }),
        getLayerNetworkData({ taskId }),
      ]);
      setState((prev) => ({
        ...prev,
        task,
        level: task.largestLevel,
        sourceData: data,
        displayData: data[task.largestLevel] || prev.displayData,
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
            completeNetwork={handleCompleteNetwork}
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
        {/* 属性选择 */}
        <FeatureSelector
          feature={feature}
          features={task ? task.dataSource[0].node.param : []}
          onChange={handleFeatureChange}
        />
      </Graphin>
    </div>
  );
};

export default Network;
