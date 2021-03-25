import { Utils } from '@antv/graphin';
import * as network from 'src/type/network';
import { colorMap, colorSets } from 'src/util/color/graphColor';
import { hexToRgbaToHex } from 'src/util/color/hexToRgba';
import { isCluster, isClusterEdge } from 'src/util/network';
import { count2String } from 'src/util/string';

// constant
const NODE_UNIT = 3;

const NODE_SIZE = 26;
const ICON_SIZE = 12;

export const getMultiple = (c: network.Cluster) => {
  const { count } = c;
  return Math.min(Math.max(2, count / NODE_UNIT), 8);
};
export const getNodeColor = (c: network.Node, index?: number) => {
  const { id } = c;
  const color = colorMap.get(id);
  if (color) {
    return color;
  }
  const len = colorSets.length;
  const ran = (index || Math.floor(Math.random() * len)) % len;
  const ranColor = colorSets[ran].mainFill;
  colorMap.set(id, ranColor);
  return ranColor;
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
  const clusterColor = color || getNodeColor(c);
  const m = getMultiple(c);
  const clusterSize = m * NODE_SIZE;
  const iconSize = m * ICON_SIZE;
  const count = count2String(c.count);
  const sc = {
    ...c,
    style: {
      keyshape: {
        fill: hexToRgbaToHex(clusterColor, 0.1),
        stroke: clusterColor,
        size: [clusterSize, clusterSize],
      },
      icon: {
        fontFamily: 'graphin',
        type: 'font',
        value: count,
        fill: clusterColor,
        size: iconSize,
      },
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
export const clusterEdgeStyleWrapper = (e: network.ClusterEdge) => e;
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
