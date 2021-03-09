import React, { useEffect, useMemo, useState } from 'react';
import Graphin, { Behaviors } from '@antv/graphin';
import { Select } from 'antd';
import { ContextMenu } from '@antv/graphin-components';

import {
  DisplayNetwork, HeadCluster, LayerNetwork, Node,
} from 'src/type/network';
import { getLevelText, nodes2Map, networkStyleWrapper } from 'src/util/network';

import Toolbar from './Toolbar';
import LayoutSelector, { layouts } from './LayoutSelector';

import '@antv/graphin/dist/index.css';
import NodeMenu from './NodeMenu';

interface GraphPanelProps {
  sourceData: LayerNetwork;
  expandSourceDataByLevel: (level: number) => Promise<LayerNetwork>;
}
interface GraphPanelState {
  layout: string;
  level: number;
  displayData: DisplayNetwork;
}

const {
  ZoomCanvas, FitView, ActivateRelations,
} = Behaviors;
const { Option: SelectOption } = Select;

const GraphPanel = (props: GraphPanelProps) => {
  // props
  const { sourceData, expandSourceDataByLevel } = props;
  const maxLevel = sourceData.length - 1;

  // state
  const [state, setState] = useState<GraphPanelState>({
    layout: 'graphin-force',
    level: maxLevel,
    displayData: { nodes: [], edges: [] },
  });
  const { layout, level, displayData } = state;

  // memo: community map
  const communityMap = useMemo(() => {
    const nodes: (Node | HeadCluster)[] = [];
    sourceData.forEach((layer) => {
      if (layer) {
        nodes.push(...layer.nodes);
      }
    });
    return nodes2Map(nodes);
  }, [sourceData]);

  // memo: layout type
  const layoutType = useMemo(() => layouts.find((l) => l.type === layout), [layout]);

  const handleChangeLayout = (value: string) => setState((prev) => ({
    ...prev,
    layout: value,
  }));
  const handleLevelChange = async (value: number) => {
    if (value >= 0 && value <= maxLevel) {
      const sourceLayer = sourceData[value];
      if (!sourceLayer) {
        const newLayerNetwork = await expandSourceDataByLevel(value);
        const targetLayer = newLayerNetwork[value];
        if (targetLayer) {
          setState((prev) => ({
            ...prev,
            displayData: networkStyleWrapper(targetLayer),
            level: value,
          }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          displayData: networkStyleWrapper(sourceLayer),
          level: value,
        }));
      }
    }
  };
  const handleDisplayDataChange = (newDisplayData: DisplayNetwork) => {
    setState((prev) => ({
      ...prev,
      displayData: newDisplayData,
    }));
  };

  useEffect(() => {
    const currentData = sourceData[maxLevel];
    setState((prev) => ({
      ...prev,
      level: maxLevel,
      displayData: currentData ? networkStyleWrapper(currentData) : prev.displayData,
    }));
  }, [sourceData.length]);

  return (
    <Graphin
      data={displayData}
      layout={layoutType}
    >
      {/* 右键菜单：展开、收起 */}
      <ContextMenu>
        <NodeMenu
          sourceData={sourceData}
          displayData={displayData}
          setDisplayData={handleDisplayDataChange}
          communityMap={communityMap}
        />
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
            const levelText = getLevelText(index, maxLevel);
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
