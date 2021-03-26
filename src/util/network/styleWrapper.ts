import { Utils } from '@antv/graphin';
import { FEATURE_ALL } from 'src/page/network/Network';
import * as network from 'src/type/network';
import { colorMap, colorSets } from 'src/util/color/graphColor';
import { hexToRgbaToHex } from 'src/util/color/hexToRgba';
import { isCluster, isClusterEdge } from 'src/util/network';
import { count2String, strings2Features } from 'src/util/string';
import { getRandomValue } from 'src/util/array';
import { PetalInfo } from 'src/util/g6Node/register';

// constant
const NODE_UNIT = 3;

const NODE_SIZE = 26;
const ICON_SIZE = 12;
const PETAL_BASE_HEIGHT = 250;

export const getMultiple = (c: network.Cluster) => {
  const { count } = c;
  return Math.min(Math.max(2, count / NODE_UNIT), 6);
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
export const defaultClusterStyleWrapper = (c: network.Cluster, color?: string) => {
  const { features: featStr } = c;
  if (!featStr) return normalNodeStyleWrapper(c, color);
  const features = strings2Features(featStr);
  const m = getMultiple(c);
  const clusterSize = m * NODE_SIZE;
  const count = count2String(c.count);
  const petals: PetalInfo[] = [];
  const featNames = Object.keys(features);
  const colors = getRandomValue(colorSets, featNames.length);
  featNames.forEach((name, i) => {
    const feat = features[name];
    let maxDesc = '';
    let maxV = 0;
    let sum = 0;
    Object.keys(feat).forEach((desc) => {
      const v = feat[desc];
      sum += v;
      if (maxV < v) {
        maxV = v;
        maxDesc = desc;
      }
    });
    const maxPer = Math.floor((maxV / sum) * 100) / 100;
    const text = `${name}:${maxDesc}-${maxPer}`;
    petals.push({
      height: maxPer * PETAL_BASE_HEIGHT,
      text,
      color: colors[i].mainFill,
    });
  });
  const sc = {
    ...c,
    type: 'rose-node',
    size: clusterSize,
    label: count,
    petals,
  };
  return sc;
};
export const featureClusterStyleWrapper = (
  c: network.Cluster,
  featName: string,
  color?: string,
) => {
  const { features: featStr } = c;
  if (!featStr) return defaultClusterStyleWrapper(c, color);
  const features = strings2Features(featStr);
  const feature = features[featName];
  if (!feature) return defaultClusterStyleWrapper(c, color);

  const m = getMultiple(c);
  const clusterSize = m * NODE_SIZE;
  const count = count2String(c.count);
  const degrees: number[] = Object.values(feature);
  const colors = getRandomValue(colorSets, degrees.length).map((c) => c.mainFill);
  const sc = {
    ...c,
    type: 'pie-node',
    size: clusterSize,
    degrees,
    colors,
    label: count,
  };
  return sc;
};
export const nodeStyleWrapper = (
  n: network.Node,
  feature: string,
  color?: string,
) => {
  if (isCluster(n)) {
    if (feature === FEATURE_ALL) {
      return defaultClusterStyleWrapper(n, color);
    }
    return featureClusterStyleWrapper(n, feature, color);
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
export const networkStyleWrapper = (
  c: network.Network,
  feature: string,
) => {
  const { nodes, edges } = c;
  const styledNodes: network.Node[] = [];
  const styledEdges: network.Edge[] = [];

  nodes.forEach((node, index) => {
    const color = getNodeColor(node, index);
    styledNodes.push(nodeStyleWrapper(node, feature, color));
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
