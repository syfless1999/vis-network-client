import G6 from '@antv/g6';
import { ClusterData, GraphData } from 'src/type/graph';
import { colorSets, colorMap } from '../color/graphColor';
import { hexToRgbaToHex } from '../color/hexToRgba';

const { louvain } = G6.Algorithm;
const { uniqueId } = G6.Util;

const nodeSize = 40;
const badgeSize = 12;

export const clusterData2GraphData = (clusterData: ClusterData, source?: GraphData) => {
  const nodes = clusterData.clusters.map((node, index) => {
    const primaryColor = colorSets[index].mainFill;
    colorMap.set(node.id, primaryColor);

    const clusterNode = {
      ...node,
      type: 'graphin-circle',
      style: {
        keyshape: {
          fill: hexToRgbaToHex(primaryColor, 0.1), // '#fff',
          strokeWidth: 1.2,
          stroke: primaryColor,
          size: [nodeSize, nodeSize],
        },
        label: {
          value: `cluster-${index}`,
          fill: hexToRgbaToHex('#000', 0.85),
        },
        halo: {
          fill: hexToRgbaToHex(primaryColor, 0.1), // '#fff',
          strokeWidth: 1.2,
          stroke: primaryColor,
        },
        icon: {
          fontFamily: 'graphin',
          type: 'font',
          // random character
          value: String.fromCodePoint(65 + Math.floor(Math.random() * 26)),
          fill: primaryColor,
          size: nodeSize / 1.6,
        },
        badges: [
          {
            position: 'RT',
            type: 'text',
            value: node.nodes.length,
            size: [badgeSize, badgeSize],
            fill: primaryColor,
            stroke: primaryColor,
            color: '#fff',
            fontSize: badgeSize * 0.8,
            padding: 0,
            offset: [0, 0],
          },
        ],
      },
    };
    return clusterNode;
  });

  const edges = clusterData.clusterEdges.map((edge) => {
    const { count = 0 } = edge;
    const size = Math.log(count) || 0.5;
    const id = `edge-${uniqueId()}`;
    return {
      ...edge,
      id,
      label: '',
      size: size > 0.5 ? size : 0.5,
      color: '#AAB7C4',
    };
  });

  return {
    nodes,
    edges,
  };
};

export default louvain;
