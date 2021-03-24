import {
  Cluster, ClusterEdge, Edge, EdgeMap, LayerNetwork, Node, NodeMap,
} from 'src/type/network';
import { getJoinString } from 'src/util/string';

export const isNode = (c: unknown): c is Node => typeof c === 'object' && c != null && 'id' in c;
export const isCluster = (c: unknown): c is Cluster => isNode(c) && 'nodes' in c;
export const isHeadCluster = (c: unknown) => isCluster(c) && !('clusterId' in c);
export const isClusterEdge = (e: Edge): e is ClusterEdge => 'count' in e;

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
export const getRelatedNodes = (
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
export const getTargetNode = (
  targetId: string,
  displayNodeMap: NodeMap,
  nodeMap: NodeMap,
) => {
  const relatedNodes = getRelatedNodes(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    nodeMap.get(targetId)!, nodeMap,
  );
  for (let i = 0; i < relatedNodes.length; i += 1) {
    const relatedId = relatedNodes[i].id;
    if (displayNodeMap.has(relatedId)) {
      return relatedId;
    }
  }
  return null;
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
    nowEdgesMap.set(edgeId, edge);
    nowEdges.push(edge);
  };
  sourceEdges.forEach((edge) => {
    const { source, target } = edge;
    if (displayNodeMap.has(source) && displayNodeMap.has(target)) {
      addEdge(source, target, edge);
    } else if (displayNodeMap.has(source)) {
      const targetId = getTargetNode(target, displayNodeMap, sourceNodeMap);
      if (targetId) {
        addEdge(source, targetId, {
          source,
          target: targetId,
        });
      }
    } else if (displayNodeMap.has(target)) {
      const sourceId = getTargetNode(source, displayNodeMap, sourceNodeMap);
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
    const network1 = oldLn[i];
    const network2 = newLn[i];
    if (network1 && network2) {
      res[i] = {
        nodes: network1.nodes.concat(network2.nodes),
        edges: network1.edges.concat(network2.edges),
      };
    } else {
      res[i] = network1 || network2;
    }
  }
  return res;
};
