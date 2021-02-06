import React, { useEffect, useMemo, useState } from 'react';
import Graphin, { Behaviors } from '@antv/graphin';
import { Select } from 'antd';
import { ContextMenu } from '@antv/graphin-components';

import { DisplayNetwork, LayerNetwork } from 'src/type/network';
import { getLevelText, nodes2Map, networkStyleWrapper } from 'src/util/network';

import Toolbar from './Toolbar';
import LayoutSelector, { layouts } from './LayoutSelect';

import '@antv/graphin/dist/index.css';
import NodeMenu from './NodeMenu';

interface GraphPanelProps {
  sourceData: LayerNetwork;
}

const {
  ZoomCanvas, FitView, ActivateRelations,
} = Behaviors;
const { Option: SelectOption } = Select;

const GraphPanel = (props: GraphPanelProps) => {
  // props
  const { sourceData } = props;
  const maxLevel = sourceData.length - 1;

  // state: layout
  const [layout, setLayout] = useState('graphin-force');
  const handleChangeLayout = (value: string) => setLayout(value);
  // state: cluster level
  const [level, setLevel] = useState<number>(maxLevel);
  const handleLevelChange = (value: number) => {
    if (value >= 0 && value <= maxLevel) {
      setLevel(value);
    }
  };
  // state: display data
  const [displayData, setDisplayData] = useState<DisplayNetwork>({ nodes: [], edges: [] });
  // memo: community map
  const communityMap = useMemo(() => {
    const nodes = sourceData.map((layer) => layer.nodes);
    return nodes2Map(nodes);
  }, [sourceData]);

  useEffect(() => {
    setLevel(maxLevel);
  }, [sourceData]);
  useEffect(() => {
    if (level >= 0) {
      setDisplayData(networkStyleWrapper(sourceData[level]));
    }
  }, [level]);

  const layoutType = layouts.find((l) => l.type === layout);
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
          setDisplayData={setDisplayData}
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
