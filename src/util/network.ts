import { Utils } from '@antv/graphin';
import {
  Cluster, ClusterEdge, Edge, EdgeMap, Layer, LayerNetwork, Node, NodeMap,
} from 'src/type/network';
import { colorSets, colorMap } from 'src/util/color/graphColor';
import { hexToRgbaToHex } from './color/hexToRgba';
import { getJoinString } from './string';

// constant
const keyshapeSize = 20;
const sizeUnit = 3;
const badgeSize = 12;

export const isNode = (c: unknown): c is Node => typeof c === 'object' && c != null && 'id' in c;
export const isCluster = (c: unknown): c is Cluster => isNode(c) && 'nodes' in c;
export const isHeadCluster = (c: unknown) => isCluster(c) && !('clusterId' in c);
export const isClusterEdge = (e: Edge): e is ClusterEdge => 'count' in e;

type RNetworkArray = Node[] | RNetworkArray[];
export const nodes2Map = (cs: RNetworkArray, map?: NodeMap) => {
  const cmap = map || new Map<string, Node>();
  cs.forEach((c: (Node | RNetworkArray)) => {
    if (Array.isArray(c)) {
      nodes2Map(c, cmap);
    } else {
      cmap.set(c.id, c);
    }
  });
  return cmap;
};
export const edges2Map = (es: Edge[], map?: EdgeMap) => {
  const emap = map || new Map<string, Edge>();
  es.forEach((e) => {
    const key = getJoinString(e.source, e.target);
    emap.set(key, e);
  });
  return emap;
};

export const getDisplayLevelText = (level: number, maxLevel: number) => {
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
export const getClusterDisplaySize = (c: Cluster) => {
  const cSize = c.count;
  return Math.min((cSize / sizeUnit + 1), 5);
};
export const getNodeColor = (c: Node, index?: number) => {
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
 * recrusive get cluster's child nodes
 * @param c root cluster
 * @param nodesMap source nodes map
 * @param currentNodes current nodes(for recrusion)
 */
export const getChildNodes = (
  c: Cluster,
  nodesMap: NodeMap,
  currentNodes?: Node[],
) => {
  const childNodes = currentNodes || [];
  c.nodes.forEach((nodeId) => {
    const n = nodesMap.get(nodeId);
    if (n) {
      childNodes.push(n);
      if (isCluster(n)) {
        childNodes.push(...getChildNodes(n, nodesMap, childNodes));
      }
    }
  });
  return childNodes;
};
/**
 * 获得某个节点向上和向下查找的
 * @param c 需要分析的中心节点
 * @param dataMap 范围内节点的Map
 */
export const getRelatedCommunities = (
  c: Node,
  nodesMap: NodeMap,
): Array<Node> => {
  const relatedCommunities: Node[] = [];
  // 1. 向上查找的情况
  let cluster: Node | undefined = c;
  while (cluster.clusterId) {
    cluster = nodesMap.get(cluster.clusterId);
    if (!cluster) {
      break;
    }
    relatedCommunities.push(cluster);
  }
  // 2. 向下查找
  if (isCluster(c)) {
    const childNodes = getChildNodes(c, nodesMap);
    relatedCommunities.push(...childNodes);
  }
  return relatedCommunities;
};
export const getTargetCommunity = (
  targetId: string,
  displayNodeMap: NodeMap,
  communityMap: NodeMap,
) => {
  const relatedCommunities = getRelatedCommunities(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    communityMap.get(targetId)!, communityMap,
  );
  for (let i = 0; i < relatedCommunities.length; i += 1) {
    const relatedId = relatedCommunities[i].id;
    if (displayNodeMap.has(relatedId)) {
      return relatedId;
    }
  }
  return null;
};

export const clusterStyleWrapper = (c: Cluster, color?: string) => {
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
export const normalNodeStyleWrapper = (n: Node, color?: string) => {
  const { id } = n;
  const cColor = color || getNodeColor(n);
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
export const nodeStyleWrapper = (n: Node, color?: string) => {
  if (isCluster(n)) {
    return clusterStyleWrapper(n, color);
  }
  return normalNodeStyleWrapper(n, color);
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
export const networkStyleWrapper = (c: Layer) => {
  const { nodes, edges } = c;
  const styledNodes: Node[] = [];
  const styledEdges: Edge[] = [];

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

/**
 * 为当前图补充连边（无状态）
 * @param nowEdges 目前图上的边合集，补充完的边会直接挂载到这个数组中
 * @param sourceEdges 原始边的来源集
 * @param displayNodeMap 目前图上的节点Map
 * @param sourceNodeMap 原始点的来源Map
 */
export const fillDisplayEdges = (
  nowEdges: Edge[],
  nowEdgesMap: EdgeMap,
  sourceEdges: Edge[],
  displayNodeMap: NodeMap,
  sourceNodeMap: NodeMap,
) => {
  const addEdge = (source: string, target: string, edge: Edge) => {
    const edgeId = getJoinString(source, target);
    if (nowEdgesMap.has(edgeId)) {
      return;
    }
    const styledEdge = edgeStyleWrapper(edge);
    nowEdgesMap.set(edgeId, styledEdge);
    nowEdges.push(styledEdge);
  };
  sourceEdges.forEach((edge) => {
    const { source, target } = edge;
    if (displayNodeMap.has(source) && displayNodeMap.has(target)) {
      addEdge(source, target, edge);
    } else if (displayNodeMap.has(source)) {
      const targetId = getTargetCommunity(target, displayNodeMap, sourceNodeMap);
      if (targetId) {
        addEdge(source, targetId, {
          source,
          target: targetId,
        });
      }
    } else if (displayNodeMap.has(target)) {
      const sourceId = getTargetCommunity(source, displayNodeMap, sourceNodeMap);
      if (sourceId) {
        addEdge(sourceId, target, {
          source: sourceId,
          target,
        });
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
