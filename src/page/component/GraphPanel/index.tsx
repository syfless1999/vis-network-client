import React, { useEffect, useState } from 'react';
import Graphin, { Behaviors } from '@antv/graphin';
import Toolbar from './Toolbar';
import LayoutSelector, { layouts } from './LayoutSelect';

import '@antv/graphin/dist/index.css';

interface RawData {
  nodes: { id: string }[],
  edges: {
    source: string,
    target: string,
    value: number,
  }[],
}

const {
  ZoomCanvas, FitView, ActivateRelations,
} = Behaviors;

const GraphPanel = () => {
  // state
  const [rawData, setRawData] = useState<RawData>({ nodes: [], edges: [] });
  // layout
  const [layout, setLayout] = useState('grid');
  const handleChangeLayout = (value: string) => {
    setLayout(value);
  };

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/relations.json');
      const json = await res.json();
      json.nodes[0].status = {
        selected: true,
      };
      setRawData(json);
    }
    fetchData();
  }, []);

  const layoutType = layouts.find((l) => l.type === layout);
  return (
    <Graphin
      data={rawData}
      layout={layoutType}
    >
      {/* 滚轮放大缩小：关闭 */}
      <ZoomCanvas disabled />
      {/* 关联高亮 */}
      <ActivateRelations />
      {/* 适应视图 */}
      <FitView />
      {/* 布局类型选择 */}
      <Toolbar />
      <LayoutSelector value={layout} onChange={handleChangeLayout} />
    </Graphin>
  );
};

export default GraphPanel;
