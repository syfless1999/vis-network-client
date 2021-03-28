import { Utils } from '@antv/graphin';
import { FEATURE_ALL } from 'src/page/network/Network';
import * as network from 'src/type/network';
import { colorSets } from 'src/util/color/graphColor';
import { hexToRgbaToHex } from 'src/util/color/hexToRgba';
import { isCluster, isClusterEdge } from 'src/util/network';
import { count2String, strings2Features } from 'src/util/string';
import { getRandomValue } from 'src/util/array';
import { PetalInfo } from 'src/util/g6Node/register';

const NODE_SIZE = 26;
const ICON_SIZE = 12;
const PETAL_BASE_HEIGHT = 250;

export const getMultiple = (c: network.Cluster) => {
  const { level } = c;
  return Math.min(level, 5) + 1;
};
export const normalNodeStyleWrapper = (n: network.Node) => {
  const { id } = n;
  const cColor = getRandomValue(colorSets)[0];
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
export const defaultClusterStyleWrapper = (
  c: network.Cluster,
  fcMap: Record<string, string[]>,
) => {
  const { features: featStr } = c;
  if (!featStr) return normalNodeStyleWrapper(c);
  const features = strings2Features(featStr);
  const m = getMultiple(c);
  const clusterSize = m * NODE_SIZE;
  const count = count2String(c.count);
  const petals: PetalInfo[] = [];
  const featNames = Object.keys(features);
  const colors: string[] = featNames.map((f) => {
    const cs = fcMap[f];
    if (!cs) {
      return getRandomValue(colorSets)[0];
    }
    return cs[0];
  });
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
      color: colors[i],
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
  fcMap: Record<string, string[]>,
) => {
  const { features: featStr } = c;
  if (!featStr) return defaultClusterStyleWrapper(c, fcMap);
  const features = strings2Features(featStr);
  const feature = features[featName];
  if (!feature) return defaultClusterStyleWrapper(c, fcMap);

  const m = getMultiple(c);
  const clusterSize = m * NODE_SIZE;
  const count = count2String(c.count);
  const degrees: number[] = Object.values(feature);
  const colors = fcMap[featName];
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
  fcMap: Record<string, string[]>,
) => {
  if (isCluster(n)) {
    if (feature === FEATURE_ALL) {
      return defaultClusterStyleWrapper(n, fcMap);
    }
    return featureClusterStyleWrapper(n, feature, fcMap);
  }
  return normalNodeStyleWrapper(n);
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
  fcMap: Record<string, string[]>,
) => {
  const { nodes, edges } = c;
  const styledNodes: network.Node[] = [];
  const styledEdges: network.Edge[] = [];

  nodes.forEach((node) => styledNodes.push(nodeStyleWrapper(node, feature, fcMap)));
  edges.forEach((edge) => styledEdges.push(edgeStyleWrapper(edge)));

  const multpleStyledEdges = Utils.processEdges(styledEdges, { poly: 50, loop: 10 });

  return {
    nodes: styledNodes,
    edges: multpleStyledEdges,
  };
};
