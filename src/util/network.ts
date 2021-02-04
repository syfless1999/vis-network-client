import {
  Cluster, ClusterEdge, Community, Edge, HeadCluster, Layer, Node,
} from 'src/type/network';
import { colorSets, colorMap } from 'src/util/color/graphColor';
import { hexToRgbaToHex } from './color/hexToRgba';

// constant
const keyshapeSize = 20;
const sizeUnit = 3;
const badgeSize = 12;

export const getLevelText = (level: number, maxLevel: number) => {
  const conditions: [boolean, string][] = [
    [level > maxLevel, 'oversized level'],
    [level === 0, 'source network'],
    [true, `level-${level}`],
  ];
  let res = '';
  for (let i = 0; i < conditions.length; i += 1) {
    if (conditions[i][0]) {
      [, res] = conditions[i];
      break;
    }
  }
  return res;
};
export const getClusterDisplaySize = (c: HeadCluster) => {
  const cSize = c.nodeNum;
  return Math.min((cSize / sizeUnit + 1), 5);
};
export const getCommunityColor = (c: Community, index: number) => {
  const { clusterId, id } = c;
  let color;
  if (clusterId && colorMap.has(clusterId)) {
    color = colorMap.get(clusterId);
  } else {
    color = colorSets[index % colorSets.length].mainFill;
    colorMap.set(id, color);
  }
  return color;
};

export const isNode = (c: Community): c is Node => 'clusterId' in c && !('nodes' in c);
export const isHeadCluster = (c: Community): c is HeadCluster => !('clusterId' in c) && 'nodes' in c;
export const isCluster = (c: Community): c is Cluster => 'clusterId' in c && 'nodes' in c;
export const isClusterEdge = (e: Edge): e is ClusterEdge => 'count' in e;

export const clusterStyleWrapper = (c: HeadCluster, color: string) => {
  const cSize = getClusterDisplaySize(c);
  const kSize = cSize * keyshapeSize;
  const fSize = kSize / 1.6;
  const bSize = cSize * badgeSize;
  const { id, nodes: { length } } = c;
  const sc = {
    ...c,
    style: {
      keyshape: {
        fill: hexToRgbaToHex(color, 0.1),
        strokeWidth: 1.2,
        stroke: color,
        size: [kSize, kSize],
      },
      label: {
        value: `cluster-${id}`,
        fill: hexToRgbaToHex('#000', 0.85),
      },
      halo: {
        fill: hexToRgbaToHex(color, 0.1),
        strokeWidth: 1.2,
        stroke: color,
      },
      icon: {
        fontFamily: 'graphin',
        type: 'font',
        value: id,
        fill: color,
        size: fSize,
      },
      badges: [
        {
          position: 'RT',
          type: 'text',
          value: length,
          size: [bSize, bSize],
          fill: color,
          stroke: color,
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
export const nodeStyleWrapper = (n: Node, color: string) => {
  const { id } = n;
  const sn = {
    ...n,
    style: {
      keyshape: {
        fill: hexToRgbaToHex(color, 0.1),
        strokeWidth: 0.5,
        stroke: color,
        size: [keyshapeSize, keyshapeSize],
      },
      label: {
        value: `${id}`,
        fill: '#000',
      },
      icon: {
        fontFamily: 'graphin',
        type: 'font',
        value: id,
        fill: color,
        size: keyshapeSize * 0.5,
      },
      badges: [],
    },
  };
  return sn;
};
export const edgeStyleWrapper = (e: Edge) => {
  const se = {
    ...e,
    style: {
      label: {},
    },
  };
  if (isClusterEdge(e)) {
    se.style.label = {
      value: `${e.count}`,
      fontSize: 12,
    };
  }
  return se;
};
export const networkStyleWrapper = (c: Layer<Node | HeadCluster>) => {
  const { nodes, edges } = c;
  const styledNodes: (Node | HeadCluster)[] = [];
  const styledEdges: Edge[] = [];

  nodes.forEach((node, index) => {
    const color = getCommunityColor(node, index);
    if (isCluster(node) || isHeadCluster(node)) {
      styledNodes.push(clusterStyleWrapper(node, color));
    } else if (isNode(node)) {
      styledNodes.push(nodeStyleWrapper(node, color));
    }
  });

  edges.forEach((edge) => {
    styledEdges.push(edgeStyleWrapper(edge));
  });

  return {
    nodes: styledNodes,
    edges: styledEdges,
  };
};
