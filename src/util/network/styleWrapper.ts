import { Utils } from '@antv/graphin';
import * as network from 'src/type/network';
import { colorMap, colorSets } from 'src/util/color/graphColor';
import { hexToRgbaToHex } from 'src/util/color/hexToRgba';
import { isCluster, isClusterEdge } from 'src/util/network';
// constant
const keyshapeSize = 20;
const sizeUnit = 3;
const badgeSize = 12;

const NODE_SIZE = 26;
const ICON_SIZE = 15;
const BADGE_SIZE = 12;

export const getClusterDisplaySize = (c: network.Cluster) => {
  const cSize = c.count;
  return Math.min((cSize / sizeUnit + 1), 5);
};
export const getNodeColor = (c: network.Node, index?: number) => {
  const { clusterId, id } = c;
  let color;
  if (clusterId && colorMap.has(clusterId)) {
    color = colorMap.get(clusterId);
  } else {
    const hash = (index || Math.floor(Math.random() * colorSets.length)) % colorSets.length;
    color = colorSets[hash].mainFill;
    colorMap.set(id, color);
  }
  return color;
};
export const normalNodeStyleWrapper = (n: network.Node, color?: string) => {
  const { id } = n;
  const cColor = color || getNodeColor(n);
  const sn = {
    ...n,
    style: {
      keyshape: {
        fill: hexToRgbaToHex(cColor),
        stroke: cColor,
        size: NODE_SIZE,
      },
      icon: {
        value: id,
        fill: cColor,
        size: ICON_SIZE,
      },
    },
  };
  return sn;
};
export const clusterStyleWrapper = (c: network.Cluster, color?: string) => {
  const cSize = getClusterDisplaySize(c);
  const kSize = cSize * keyshapeSize;
  const fSize = kSize / 1.6;
  const bSize = cSize * badgeSize;
  const cColor = color || getNodeColor(c);
  const { count } = c;
  const sc = {
    ...c,
    style: {
      keyshape: {
        fill: hexToRgbaToHex(cColor, 0.1),
        strokeWidth: 1.2,
        stroke: cColor,
        size: [kSize, kSize],
      },
      halo: {
        fill: hexToRgbaToHex(cColor, 0.1),
        strokeWidth: 1.2,
        stroke: color,
      },
      icon: {
        fontFamily: 'graphin',
        type: 'font',
        value: c.id,
        fill: cColor,
        size: fSize,
      },
      badges: [
        {
          position: 'RT',
          type: 'text',
          value: count,
          size: [bSize, bSize],
          fill: cColor,
          stroke: cColor,
          color: '#fff',
          fontSize: bSize * 0.8,
          padding: 0,
          offset: [0, 0],
        },
      ],
    },
  };
  return sc;
};
export const nodeStyleWrapper = (n: network.Node, color?: string) => {
  if (isCluster(n)) {
    return clusterStyleWrapper(n, color);
  }
  return normalNodeStyleWrapper(n, color);
};
export const normalEdgeStyleWrapper = (e: network.Edge) => e;
export const clusterEdgeStyleWrapper = (e: network.ClusterEdge) => ({
  ...e,
  style: {
    label: {
      value: `${e.count}`,
      fontSize: 12,
    },
  },
});
export const edgeStyleWrapper = (e: network.Edge) => {
  if (isClusterEdge(e)) {
    return clusterEdgeStyleWrapper(e);
  }
  return normalEdgeStyleWrapper(e);
};
export const networkStyleWrapper = (c: network.Network) => {
  const { nodes, edges } = c;
  const styledNodes: network.Node[] = [];
  const styledEdges: network.Edge[] = [];

  nodes.forEach((node, index) => {
    const color = getNodeColor(node, index);
    styledNodes.push(nodeStyleWrapper(node, color));
  });

  edges.forEach((edge) => {
    styledEdges.push(edgeStyleWrapper(edge));
  });

  const multpleStyledEdges = Utils.processEdges(styledEdges, { poly: 50, loop: 10 });

  return {
    nodes: styledNodes,
    edges: multpleStyledEdges,
  };
};
