import React, { useEffect, useState } from 'react';
import Graphin, { Behaviors } from '@antv/graphin';
import { GraphinData } from '@antv/graphin/lib/typings/type';
import { Switch } from 'antd';

import lpa from 'src/util/cluster/lpa';
import { ClusterData, GraphData } from 'src/type/graph';
import { clusterData2GraphData } from 'src/util/cluster/louvain';
import { LayerNetwork } from 'src/type/network';

import Toolbar from './Toolbar';
import LayoutSelector, { layouts } from './LayoutSelect';

import '@antv/graphin/dist/index.css';

interface GraphPanelProps {
  sourceData: LayerNetwork;
}

const {
  ZoomCanvas, FitView, ActivateRelations,
} = Behaviors;

const GraphPanel = (props: GraphPanelProps) => {
  // props
  const { sourceData } = props;
  // raw data
  const [rawData, setRawData] = useState<GraphData>({ nodes: [], edges: [] });
  // cluster data
  const [clusterData, setClusterData] = useState<GraphData>({ nodes: [], edges: [] });
  // graph data
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });

  // layout
  const [layout, setLayout] = useState('graphin-force');
  const handleChangeLayout = (value: string) => {
    setLayout(value);
  };
  // cluster or normal mode
  type mode = 'CLUSTER' | 'NORMAL';
  const [mode, setMode] = useState<mode>('NORMAL');
  const handleChangeMode = (checked: boolean) => {
    if (checked) {
      setMode('CLUSTER');
    } else {
      setMode('NORMAL');
    }
  };

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/relations.json');
      const json = await res.json();
      json.nodes[0].status = {
        selected: true,
      };
      setRawData(json);
      const clusterRes = lpa(json, false, 'value');
      const clusterData = clusterData2GraphData(clusterRes as ClusterData);
      setClusterData(clusterData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (mode === 'NORMAL') {
      setGraphData(() => rawData);
    } else {
      setGraphData(clusterData);
    }
  }, [mode, rawData, clusterData]);

  const layoutType = layouts.find((l) => l.type === layout);
  return (
    <Graphin
      data={graphData as GraphinData}
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
      {/* 是否聚类 */}
      <Switch checked={mode === 'CLUSTER'} onClick={handleChangeMode} />
    </Graphin>
  );
};

export default GraphPanel;
