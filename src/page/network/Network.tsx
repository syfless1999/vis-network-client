import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select } from 'antd';
import { ContextMenu } from '@antv/graphin-components';
import Graphin, { Behaviors, Utils } from '@antv/graphin';

import AsyncNodeMenu, { CompleteNetworkFunc } from 'src/page/component/GraphPanel/AsyncNodeMenu';
import Toolbar from 'src/page/component/GraphPanel/Toolbar';
import LayoutSelector, { layouts } from 'src/page/component/GraphPanel/LayoutSelector';
import SearchBar from 'src/page/component/SearchBar';
import NodeMenu from 'src/page/component/GraphPanel/NodeMenu';
import { completeNetworkData, getLayerNetworkData, getAroundNetwork } from 'src/service/network';
import * as network from 'src/type/network';
import { mergeTwoLayerNetwork, getDisplayLevelText, networkStyleWrapper } from 'src/util/network';
import { array2Map } from 'src/util/array';

import '@antv/graphin/dist/index.css';

export interface NetworkParam {
  label: string;
  taskId: string;
}

interface NetworkGraphState {
  layout: string;
  level: number;
  displayData: network.Network;
  sourceData: network.LayerNetwork;
}

const {
  ZoomCanvas, FitView, ActivateRelations,
} = Behaviors;
const { Option: SelectOption } = Select;

const async = true;

const Network = () => {
  const [state, setState] = useState<NetworkGraphState>({
    layout: 'random',
    level: -1,
    displayData: { nodes: [], edges: [] },
    sourceData: [],
  });
  const {
    layout, level, displayData, sourceData,
  } = state;
  const maxLevel = sourceData.length - 1;
  const { label, taskId } = useParams<NetworkParam>();
  // memo: node map
  const nodeMap = useMemo(() => {
    const nodes = sourceData.reduce<network.Node[]>((all, cur) => {
      if (cur) {
        return [...all, ...cur.nodes];
      }
      return all;
    }, []);
    return array2Map<string, network.Node>(nodes, (v) => v.id);
  }, [sourceData]);
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
  const handleLevelChange = async (value: number) => {
    if (value >= 0 && value <= maxLevel) {
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
    }
  };
  const handleSearchNodeAroundNetwork = async (nodeId: string) => {
    const newDisplayData = await getAroundNetwork({
      label,
      taskId,
      nodeId,
    });
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
          {async ? (
            <AsyncNodeMenu
              displayData={displayData}
              setDisplayData={handleDisplayDataChange}
              completeNetwork={completeNetwork}
            />
          ) : (
            <NodeMenu
              sourceData={sourceData}
              displayData={displayData}
              setDisplayData={handleDisplayDataChange}
              nodeMap={nodeMap}
            />
          )}
        </ContextMenu>
        {/* 滚轮放大缩小：关闭 */}
        <ZoomCanvas disabled />
        {/* 关联高亮 */}
        <ActivateRelations />
        {/* 适应视图 */}
        <FitView />
        <Toolbar />
        {/* 布局类型选择 */}
        <LayoutSelector value={layout} onChange={handleChangeLayout} />
        {/* 聚类等级 */}
        <Select
          bordered={false}
          value={level}
          onChange={handleLevelChange}
          placeholder="cluster level"
        >
          {
            Array.from({ length: sourceData.length }).map((_, index) => {
              const levelText = getDisplayLevelText(index, maxLevel);
              return (
                <SelectOption key={levelText} value={index}>
                  {levelText}
                </SelectOption>
              );
            })
          }
        </Select>
        <SearchBar onSearch={handleSearchNodeAroundNetwork} />
      </Graphin>
    </div>
  );
};

export default Network;
