import {
  Cluster, ClusterEdge, Community, Edge, HeadCluster, Layer, LayerNetwork, Node,
} from 'src/type/network';
import { colorSets, colorMap } from 'src/util/color/graphColor';
import { hexToRgbaToHex } from './color/hexToRgba';

// constant
const keyshapeSize = 20;
const sizeUnit = 3;
const badgeSize = 12;

export const isNode = (c: Community): c is Node => 'clusterId' in c && !('nodes' in c);
export const isHeadCluster = (c: Community): c is HeadCluster => 'nodes' in c;
export const isCluster = (c: Community): c is Cluster => 'clusterId' in c && 'nodes' in c;
export const isClusterEdge = (e: Edge): e is ClusterEdge => 'count' in e;

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
export const getCommunityColor = (c: Community, index?: number) => {
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
export const getRelatedCommunities = (
  c: Node | HeadCluster,
  sourceData: LayerNetwork,
  dataMap: Map<string, HeadCluster | Node>,
): (Node | HeadCluster
)[] => {
  const relatedCommunities: (Node | HeadCluster)[] = [];
  // TODO 只考虑了向上查找的情况
  if (isHeadCluster(c)) {
    return [];
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let prevCluster: HeadCluster | Cluster | Node = dataMap.get(c.clusterId)!;
  while (isCluster(prevCluster)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    prevCluster = dataMap.get(prevCluster.clusterId)!;
    relatedCommunities.push(prevCluster);
  }
  return relatedCommunities;
};
type RNetworkArray = (Node | HeadCluster)[] | RNetworkArray[];
export const getNetworkMap = (cs: RNetworkArray, map?: Map<string, Node | HeadCluster>) => {
  const cmap = map || new Map<string, Node | HeadCluster>();
  cs.forEach((c: (Node | HeadCluster | RNetworkArray)) => {
    if (Array.isArray(c)) {
      getNetworkMap(c, cmap);
    } else {
      cmap.set(c.id, c);
    }
  });
  return cmap;
};

export const clusterStyleWrapper = (c: HeadCluster, color?: string) => {
  const cSize = getClusterDisplaySize(c);
  const kSize = cSize * keyshapeSize;
  const fSize = kSize / 1.6;
  const bSize = cSize * badgeSize;
  const cColor = color || getCommunityColor(c);
  const { id, nodes: { length } } = c;
  const sc = {
    ...c,
    style: {
      keyshape: {
        fill: hexToRgbaToHex(cColor, 0.1),
        strokeWidth: 1.2,
        stroke: cColor,
        size: [kSize, kSize],
      },
      label: {
        value: `cluster-${id}`,
        fill: hexToRgbaToHex('#000', 0.85),
      },
      halo: {
        fill: hexToRgbaToHex(cColor, 0.1),
        strokeWidth: 1.2,
        stroke: color,
      },
      icon: {
        fontFamily: 'graphin',
        type: 'font',
        value: id,
        fill: cColor,
        size: fSize,
      },
      badges: [
        {
          position: 'RT',
          type: 'text',
          value: length,
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
export const nodeStyleWrapper = (n: Node, color?: string) => {
  const { id } = n;
  const cColor = color || getCommunityColor(n);
  const sn = {
    ...n,
    style: {
      keyshape: {
        fill: hexToRgbaToHex(cColor, 0.1),
        strokeWidth: 0.5,
        stroke: cColor,
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
        fill: cColor,
        size: keyshapeSize * 0.5,
      },
      badges: [],
    },
  };
  return sn;
};
export const communityStyleWrapper = (n: Node | HeadCluster, color?: string) => {
  if (isHeadCluster(n)) {
    return clusterStyleWrapper(n, color);
  }
  return nodeStyleWrapper(n, color);
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
    styledNodes.push(communityStyleWrapper(node, color));
  });

  edges.forEach((edge) => {
    styledEdges.push(edgeStyleWrapper(edge));
  });

  return {
    nodes: styledNodes,
    edges: styledEdges,
  };
};
