import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Form } from 'antd';
import { ContextMenu } from '@antv/graphin-components';
import Graphin, { Behaviors, Utils } from '@antv/graphin';

import AsyncNodeMenu, { CompleteNetworkFunc } from 'src/page/component/GraphPanel/AsyncNodeMenu';
import Toolbar from 'src/page/component/GraphPanel/Toolbar';
import LayoutSelector, { layouts } from 'src/page/component/GraphPanel/LayoutSelector';
import SearchBar from 'src/page/component/SearchBar';
import LevelSelector from 'src/page/component/GraphPanel/LevelSelector';
import FeatureSelector from 'src/page/component/GraphPanel/FeatureSelector';
import StatisticPanel from 'src/page/component/GraphPanel/StatisticPanel';
import { completeNetworkData, getLayerNetworkData, getAroundNetwork } from 'src/service/network';
import { getOneTask } from 'src/service/task';
import * as network from 'src/type/network';
import Task from 'src/model/task';
import { mergeTwoLayerNetwork } from 'src/util/network';
import { networkStyleWrapper } from 'src/util/network/styleWrapper';
import register from 'src/util/g6Node/register';
import styled from 'styled-components';

interface NetworkParam {
  taskId: string;
}
interface NetworkState {
  layout: string;
  level: number;
  nodeNum: number;
  edgeNum: number;
  displayData: network.Network;
  sourceData: network.LayerNetwork;
  feature: string;
  task?: Task;
}
export const FEATURE_ALL = 'all';

const {
  ZoomCanvas, FitView,
} = Behaviors;
const Selector = styled(Card)`
  position: absolute;
  top: 0;
  right: 10px;
  padding: 12px;
  box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
`;
const ISearchBar = styled.div`
  margin: auto;
  width: 500px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;
const IStatisticContainer = styled.div`
  width: 360px;
  box-sizing: border-box;
  position: absolute;
  margin: auto;
  bottom: 0;
  right: 0;
  left: 0;
`;
// register custom g6 source
register();

const Network = () => {
  const [state, setState] = useState<NetworkState>({
    layout: 'grid',
    level: -1,
    nodeNum: 0,
    edgeNum: 0,
    displayData: { nodes: [], edges: [] },
    feature: FEATURE_ALL,
    sourceData: [],
    task: undefined,
  });
  const {
    layout, level, displayData, sourceData, feature, task, nodeNum, edgeNum,
  } = state;
  const maxLevel = sourceData.length - 1;
  const { taskId } = useParams<NetworkParam>();
  const feats = [FEATURE_ALL];
  let label: string | undefined;
  if (task) {
    const { dataSource: [ds] } = task;
    label = ds.name;
    feats.push(...ds.node.param);
  }
  const layoutType = layouts.find((l) => l.type === layout);

  const handleChangeLayout = (value: string) => setState((prev) => ({
    ...prev,
    layout: value,
  }));
  const handleFeatureChange = (value: string) => setState((prev) => ({
    ...prev,
    feature: value,
  }));
  const handleDisplayDataChange = (newDisplayData: network.Network) => setState((prev) => ({
    ...prev,
    displayData: newDisplayData,
  }));
  const handleLevelChange = React.useCallback(async (value: number) => {
    if (value < 0 || value > maxLevel) return;
    let targetNetwork = sourceData[value];
    let newSourceData = sourceData;
    if (!targetNetwork) {
      const { network } = await getLayerNetworkData({
        taskId,
        level: value.toString(),
      });
      newSourceData = mergeTwoLayerNetwork(sourceData, network);
      targetNetwork = newSourceData[value];
    }
    setState((prev) => ({
      ...prev,
      level: value,
      nodeNum,
      edgeNum,
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
      const { network, nodeNum, edgeNum } = data;
      setState((prev) => ({
        ...prev,
        task,
        nodeNum,
        edgeNum,
        level: task.largestLevel,
        sourceData: network,
        displayData: network[task.largestLevel] || prev.displayData,
      }));
    }
    fetchData();
  }, []);

  return (
    <div>
      <Graphin
        style={{ padding: '36px 0' }}
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
        {/* 适应视图 */}
        <FitView />
        <ISearchBar>
          <SearchBar onSearch={handleSearchNodeAroundNetwork} />
        </ISearchBar>
        <Toolbar />
        <Selector>
          <Form layout="vertical">
            <Form.Item label="Layout">
              {/* 布局类型选择 */}
              <LayoutSelector value={layout} onChange={handleChangeLayout} />
            </Form.Item>
            <Form.Item label="Level">
              {/* 聚类等级 */}
              <LevelSelector
                level={level}
                maxLevel={maxLevel}
                onChange={handleLevelChange}
              />
            </Form.Item>
            <Form.Item label="Feature">
              {/* 属性选择 */}
              <FeatureSelector
                feature={feature}
                features={feats}
                onChange={handleFeatureChange}
              />
            </Form.Item>
          </Form>
        </Selector>
        {/* 全局信息 */}
        <IStatisticContainer>
          <StatisticPanel
            nodeNum={displayData.nodes.length}
            nodeSum={nodeNum}
            edgeNum={displayData.edges.length}
            edgeSum={edgeNum}
          />
        </IStatisticContainer>
      </Graphin>
    </div>
  );
};

export default Network;
