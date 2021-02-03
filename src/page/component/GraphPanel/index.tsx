import React, { useEffect, useState } from 'react';
import Graphin, { Behaviors } from '@antv/graphin';
import { Select } from 'antd';

import { DisplayNetwork, LayerNetwork } from 'src/type/network';
import { getLevelText, networkStyleWrapper } from 'src/util/network';

import Toolbar from './Toolbar';
import LayoutSelector, { layouts } from './LayoutSelect';

import '@antv/graphin/dist/index.css';

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
  const maxLevel = sourceData.length;

  // state: display data
  const [displayData, setDisplayData] = useState<DisplayNetwork>({ nodes: [], edges: [] });
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

  useEffect(() => {
    if (sourceData.length) {
      const styledNetwork = networkStyleWrapper(sourceData[level]);
      setDisplayData(styledNetwork);
    }
  }, [level]);

  const layoutType = layouts.find((l) => l.type === layout);
  return (
    <Graphin
      data={displayData}
      layout={layoutType}
    >
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
          Array.from({ length: maxLevel }).map((_, index) => {
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
