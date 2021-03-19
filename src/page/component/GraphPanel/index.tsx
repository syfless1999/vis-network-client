import React, { useEffect, useMemo, useState } from 'react';
import Graphin, { Behaviors, Utils } from '@antv/graphin';
import { Select } from 'antd';
import { ContextMenu } from '@antv/graphin-components';

import { DisplayNetwork, LayerNetwork, Node } from 'src/type/network';
import { getDisplayLevelText, nodes2Map, networkStyleWrapper } from 'src/util/network';

import Toolbar from './Toolbar';
import LayoutSelector, { layouts } from './LayoutSelector';

import '@antv/graphin/dist/index.css';
import NodeMenu from './NodeMenu';
import AsyncNodeMenu from './AsyncNodeMenu';

interface GraphPanelProps {
  sourceData: LayerNetwork;
  expandSourceDataByLevel: (level: number) => Promise<LayerNetwork>;
  async?: boolean;
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

const GraphPanel: React.FC<GraphPanelProps> = (props) => {
  // props
  const { sourceData, expandSourceDataByLevel, async = false } = props;
  const maxLevel = sourceData.length - 1;

  // state
  const [state, setState] = useState<GraphPanelState>({
    layout: 'circular',
    level: maxLevel,
    displayData: { nodes: [], edges: [] },
  });
  const { layout, level, displayData } = state;

  // memo: community map
  const communityMap = useMemo(() => {
    const nodes = sourceData.reduce((all: Node[], cur) => {
      if (cur) {
        return all.concat(cur.nodes);
      }
      return all;
    }, []);
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
      let targetLayer = sourceLayer;
      if (!sourceLayer) {
        const newLayerNetwork = await expandSourceDataByLevel(value);
        const remoteTargetLayer = newLayerNetwork[value];
        targetLayer = remoteTargetLayer;
      }
      setState((prev) => ({
        ...prev,
        displayData: targetLayer ? networkStyleWrapper(targetLayer) : prev.displayData,
        level: value,
      }));
    }
  };
  const handleDisplayDataChange = (newDisplayData: DisplayNetwork) => {
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
        {async ? (
          <AsyncNodeMenu
            sourceData={sourceData}
            displayData={displayData}
            setDisplayData={handleDisplayDataChange}
            communityMap={communityMap}
          />
        ) : (
          <NodeMenu
            sourceData={sourceData}
            displayData={displayData}
            setDisplayData={handleDisplayDataChange}
            communityMap={communityMap}
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
