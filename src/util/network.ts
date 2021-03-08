import {
  Cluster, ClusterEdge, Community, Edge, HeadCluster, Layer, LayerNetwork, Node, NodeMap,
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
export const isHead = (c: Community): c is HeadCluster => isHeadCluster(c) && !('clusterId' in c);
export const isClusterEdge = (e: Edge): e is ClusterEdge => 'count' in e;

type RNetworkArray = (Node | HeadCluster)[] | RNetworkArray[];
export const nodes2Map = (cs: RNetworkArray, map?: NodeMap) => {
  const cmap = map || new Map<string, Node | HeadCluster>();
  cs.forEach((c: (Node | HeadCluster | RNetworkArray)) => {
    if (Array.isArray(c)) {
      nodes2Map(c, cmap);
    } else {
      cmap.set(c.id, c);
    }
  });
  return cmap;
};

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
/**
 * 获得某个节点向上和向下查找的
 * @param c 需要分析的中心节点
 * @param dataMap 范围内节点的Map
 */
export const getRelatedCommunities = (
  c: Node | HeadCluster,
  dataMap: NodeMap,
): (Node | HeadCluster
)[] => {
  const relatedCommunities: (Node | HeadCluster)[] = [];
  // TODO 只考虑了向上查找的情况
  if (isHead(c)) {
    return [];
  }
  let prevCluster: HeadCluster = (dataMap.get(c.clusterId) as HeadCluster);
  relatedCommunities.push(prevCluster);
  while (isCluster(prevCluster)) {
    prevCluster = (dataMap.get(prevCluster.clusterId) as Cluster);
    relatedCommunities.push(prevCluster);
  }
  return relatedCommunities;
};
export const getTargetCommunity = (
  sourceTargetId: string,
  displayNodeMap: NodeMap,
  communityMap: NodeMap,
) => {
  const relatedCommunities = getRelatedCommunities(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    communityMap.get(sourceTargetId)!, communityMap,
  );
  for (let i = 0; i < relatedCommunities.length; i += 1) {
    const relatedId = relatedCommunities[i].id;
    if (displayNodeMap.has(relatedId)) {
      return relatedId;
    }
  }
  return null;
};

export const clusterStyleWrapper = (c: HeadCluster, color?: string) => {
  const cSize = getClusterDisplaySize(c);
  const kSize = cSize * keyshapeSize;
  const fSize = kSize / 1.6;
  const bSize = cSize * badgeSize;
  const cColor = color || getCommunityColor(c);
  const { nodeNum } = c;
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
        value: nodeNum,
        fill: cColor,
        size: fSize,
      },
      badges: [
        {
          position: 'RT',
          type: 'text',
          value: nodeNum,
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
export const normalEdgeStyleWrapper = (e: Edge) => e;
export const clusterEdgeStyleWrapper = (e: ClusterEdge) => ({
  ...e,
  style: {
    label: {
      value: `${e.count}`,
      fontSize: 12,
    },
  },
});
export const edgeStyleWrapper = (e: Edge) => {
  if (isClusterEdge(e)) {
    return clusterEdgeStyleWrapper(e);
  }
  return normalEdgeStyleWrapper(e);
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

/**
 * 为当前图补充连边（无状态）
 * @param nowEdges 目前图上的边合集，补充完的边会直接挂载到这个数组中
 * @param sourceEdges 原始边的来源集
 * @param displayNodeMap 目前图上的节点Map
 * @param sourceNodeMap 原始点的来源Map
 */
export const fillDisplayEdges = (
  nowEdges: Edge[],
  sourceEdges: Edge[],
  displayNodeMap: NodeMap,
  sourceNodeMap: NodeMap,
) => {
  sourceEdges.forEach((edge) => {
    const { source, target } = edge;
    if (displayNodeMap.has(source) && displayNodeMap.has(target)) {
      nowEdges.push(edgeStyleWrapper(edge));
    } else if (displayNodeMap.has(source)) {
      const targetId = getTargetCommunity(target, displayNodeMap, sourceNodeMap);
      if (targetId) {
        nowEdges.push(edgeStyleWrapper({
          source,
          target: targetId,
        }));
      }
    } else if (displayNodeMap.has(target)) {
      const sourceId = getTargetCommunity(source, displayNodeMap, sourceNodeMap);
      if (sourceId) {
        nowEdges.push(edgeStyleWrapper({
          source: sourceId,
          target,
        }));
      }
    }
  });
};
/**
 * merge two layer-network, fill layer in 'undefined'
 * @param oldLn first layer-network
 * @param newLn second layer-network
 */
export const mergeTwoLayerNetwork = (oldLn: LayerNetwork, newLn: LayerNetwork): LayerNetwork => {
  if (oldLn.length < newLn.length) {
    throw new Error('Two layer-networks has different length');
  }
  const res: LayerNetwork = Array.from({ length: oldLn.length });
  for (let i = 0; i < oldLn.length; i += 1) {
    const layer1 = oldLn[i];
    const layer2 = newLn[i];
    if (layer1 && layer2) {
      res[i] = {
        nodes: layer1.nodes.concat(layer2.nodes),
        edges: layer1.edges.concat(layer2.edges),
      };
    } else {
      res[i] = layer1 || layer2;
    }
  }
  return res;
};
