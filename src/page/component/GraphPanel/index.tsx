import React, { useEffect, useMemo, useState } from 'react';
import Graphin, { Behaviors, Utils } from '@antv/graphin';
import { Select } from 'antd';
import { ContextMenu } from '@antv/graphin-components';

import {
  Network, LayerNetwork, Node, IdNetwork,
} from 'src/type/network';
import { getDisplayLevelText, networkStyleWrapper } from 'src/util/network';
import { array2Map } from 'src/util/array';

import Toolbar from './Toolbar';
import LayoutSelector, { layouts } from './LayoutSelector';

import '@antv/graphin/dist/index.css';
import NodeMenu from './NodeMenu';
import AsyncNodeMenu from './AsyncNodeMenu';

export type CompleteNetworkFunc = (currentNetwork: IdNetwork, newIds: string[]) => Promise<Network>
interface GraphPanelProps {
  sourceData: LayerNetwork;
  expandSourceDataByLevel: (level: number) => Promise<LayerNetwork>;
  async?: boolean;
  completeNetwork?: CompleteNetworkFunc;
}
interface GraphPanelState {
  layout: string;
  level: number;
  displayData: Network;
}

const {
  ZoomCanvas, FitView, ActivateRelations,
} = Behaviors;
const { Option: SelectOption } = Select;

const GraphPanel: React.FC<GraphPanelProps> = (props) => {
  // props
  const {
    sourceData, expandSourceDataByLevel, async = false, completeNetwork,
  } = props;
  const maxLevel = sourceData.length - 1;

  // state
  const [state, setState] = useState<GraphPanelState>({
    layout: 'circular',
    level: maxLevel,
    displayData: { nodes: [], edges: [] },
  });
  const { layout, level, displayData } = state;

  // memo: node map
  const nodeMap = useMemo(() => {
    const nodes = sourceData.reduce((all: Node[], cur) => {
      if (cur) {
        return all.concat(cur.nodes);
      }
      return all;
    }, []);
    return array2Map<string, Node>(nodes, (v) => v.id);
  }, [sourceData]);

  // memo: layout type
  const layoutType = useMemo(() => layouts.find((l) => l.type === layout), [layout]);

  // memo: styled network data
  const styledData = useMemo(() => networkStyleWrapper(displayData), [displayData]);

  const handleChangeLayout = (value: string) => setState((prev) => ({
    ...prev,
    layout: value,
  }));
  const handleLevelChange = async (value: number) => {
    if (value >= 0 && value <= maxLevel) {
      const sourceNetwork = sourceData[value];
      let targetNetwork = sourceNetwork;
      if (!sourceNetwork) {
        const newLayerNetwork = await expandSourceDataByLevel(value);
        const remoteTargetNetwork = newLayerNetwork[value];
        targetNetwork = remoteTargetNetwork;
      }
      setState((prev) => ({
        ...prev,
        displayData: targetNetwork || prev.displayData,
        level: value,
      }));
    }
  };
  const handleDisplayDataChange = (newDisplayData: Network) => {
    const { edges } = newDisplayData;
    const displayEdges = Utils.processEdges(edges, { poly: 50, loop: 10 });

    setState((prev) => ({
      ...prev,
      displayData: {
        ...newDisplayData,
        edges: displayEdges,
      },
    }));
  };

  useEffect(() => {
    const currentData = sourceData[maxLevel];
    setState((prev) => ({
      ...prev,
      level: maxLevel,
      displayData: currentData || prev.displayData,
    }));
  }, [sourceData.length]);

  return (
    <Graphin
      data={styledData}
      layout={layoutType}
    >
      {/* 右键菜单：展开、收起 */}
      <ContextMenu>
        {async && completeNetwork ? (
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
    </Graphin>
  );
};

export default GraphPanel;
