/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import {
  nodeStyleWrapper,
  nodes2Map,
  isHeadCluster,
  isCluster,
  fillDisplayEdges,
  edges2Map,
} from 'src/util/network';
import {
  Node, DisplayNetwork, Edge, NodeMap, LayerNetwork, Cluster,
} from 'src/type/network';
import { deleteItemWithoutOrder } from 'src/util/array';

interface NodeMenuProps {
  displayData: DisplayNetwork;
  communityMap: NodeMap;
  sourceData: LayerNetwork;
  setDisplayData: (newDisplayData: DisplayNetwork) => void;
}

const { Menu } = ContextMenu;

const CustomMenu = (props: NodeMenuProps) => {
  const {
    displayData, setDisplayData, communityMap, sourceData,
  } = props;
  const graphin = React.useContext(GraphinContext);
  const { contextmenu, graph } = graphin;
  const model: Node = contextmenu.node.item.getModel();

  const handleExpand = () => {
    if (isCluster(model)) {
      const { nodes, edges } = displayData;
      const displayNodes = [...nodes];
      const displayEdges = [...edges];
      // 1 点：删聚类点，加子节点
      // 1.1 删点
      deleteItemWithoutOrder(displayNodes, (node) => node.id === model.id);

      // 1.2 加点
      model.nodes.forEach((nodeId) => {
        if (communityMap.has(nodeId)) {
          displayNodes.push(nodeStyleWrapper(communityMap.get(nodeId)!));
        }
      });
      const displayNodeMap = nodes2Map(displayNodes);
      // 2. 边
      // 21. 删除和model有关的边
      deleteItemWithoutOrder(
        displayEdges,
        (edge) => edge.source === model.id || edge.target === model.id,
      );

      // 22. 加边：遍历被扩展层级所有的边，添加与新节点们有关的边
      const allEdges = sourceData.reduce(
        (prev: Edge[], cur) => (cur && cur.edges ? prev.concat(cur.edges) : prev), [],
      );
      const displayEdgesMap = edges2Map(displayEdges);
      fillDisplayEdges(
        displayEdges,
        displayEdgesMap,
        allEdges,
        displayNodeMap,
        communityMap,
      );
      setDisplayData({
        nodes: displayNodes,
        edges: displayEdges,
      });
    }
  };
  const handleShrink = () => {
    if (model.clusterId) {
      const { nodes, edges } = displayData;
      const displayNodes = [...nodes];
      const displayEdges = [...edges];
      if (!communityMap.has(model.clusterId)) {
        return;
      }
      // 1. 点: 删同级点 / 加cluster
      const clusterNode = communityMap.get(model.clusterId)!;
      const { nodes: sameLevelNodeIds } = clusterNode as Cluster;

      // 11. 加点
      displayNodes.push(nodeStyleWrapper(clusterNode));

      // 12. 删点
      const sameLevelNodeMap = nodes2Map(
        sameLevelNodeIds.map((nodeId) => communityMap.get(nodeId)!),
      );
      deleteItemWithoutOrder(
        displayNodes,
        (node) => sameLevelNodeMap.has(node.id),
      );

      const displayNodeMap = nodes2Map(displayNodes);
      // 2. 边: 删原来的点的边 / 加新点的边
      // 21. 删边
      deleteItemWithoutOrder(
        displayEdges,
        (edge) => sameLevelNodeMap.has(edge.source) || sameLevelNodeMap.has(edge.target),
      );
      // 22. 加边
      const allEdges = sourceData.reduce(
        (prev: Edge[], cur) => (cur && cur.edges ? prev.concat(cur.edges) : prev), [],
      );
      const displayEdgesMap = edges2Map(displayEdges);
      fillDisplayEdges(
        displayEdges,
        displayEdgesMap,
        allEdges,
        displayNodeMap,
        communityMap,
      );
      setDisplayData({
        nodes: displayNodes,
        edges: displayEdges,
      });
    }
  };
  const handleHide = () => {
    graph.remove(model.id);
  };

  return (
    <Menu bindType="node">
      {isCluster(model) ? <Menu.Item onClick={handleExpand}>Expand</Menu.Item> : <></>}
      {isHeadCluster(model) ? <Menu.Item onClick={handleShrink}>Shrink</Menu.Item> : <></>}
      <Menu.Item onClick={handleHide}>Hide</Menu.Item>
    </Menu>
  );
};

export default CustomMenu;
