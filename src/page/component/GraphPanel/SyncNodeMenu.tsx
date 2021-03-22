import React from 'react';
import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import { isHeadCluster, isCluster, fillDisplayEdges } from 'src/util/network';
import {
  Node, Edge, NodeMap, LayerNetwork, Network,
} from 'src/type/network';
import { array2Map, deleteItemWithoutOrder } from 'src/util/array';
import { getJoinString } from 'src/util/string';

interface SyncNodeMenuProps {
  displayData: Network;
  nodeMap: NodeMap;
  sourceData: LayerNetwork;
  setDisplayData: (newDisplayData: Network) => void;
}

const { Menu } = ContextMenu;

const CustomMenu = (props: SyncNodeMenuProps) => {
  const {
    displayData, setDisplayData, nodeMap, sourceData,
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
        const node = nodeMap.get(nodeId);
        if (node) {
          displayNodes.push(node);
        }
      });
      const displayNodeMap = array2Map<string, Node>(displayNodes, (v) => v.id);
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
      const displayEdgesMap = array2Map(displayEdges, (e) => getJoinString(e.source, e.target));
      fillDisplayEdges(
        displayEdges,
        displayEdgesMap,
        allEdges,
        displayNodeMap,
        nodeMap,
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
      const clusterNode = nodeMap.get(model.clusterId);

      if (!clusterNode || !isCluster(clusterNode)) {
        return;
      }
      // 1. 点: 删同级点 / 加cluster
      const { nodes: sameLevelNodeIds } = clusterNode;

      // 11. 加点
      displayNodes.push(clusterNode);

      // 12. 删点
      const sameLevelNodeIdMap = array2Map(sameLevelNodeIds, (v) => v);
      deleteItemWithoutOrder(
        displayNodes,
        (node) => sameLevelNodeIdMap.has(node.id),
      );

      const displayNodeMap = array2Map(displayNodes, (v) => v.id);
      // 2. 边: 删原来的点的边 / 加新点的边
      // 21. 删边
      deleteItemWithoutOrder(
        displayEdges,
        (edge) => sameLevelNodeIdMap.has(edge.source) || sameLevelNodeIdMap.has(edge.target),
      );
      // 22. 加边
      const allEdges = sourceData.reduce(
        (prev: Edge[], cur) => (cur && cur.edges ? prev.concat(cur.edges) : prev), [],
      );
      const displayEdgesMap = array2Map(displayEdges, (e) => getJoinString(e.source, e.target));
      fillDisplayEdges(
        displayEdges,
        displayEdgesMap,
        allEdges,
        displayNodeMap,
        nodeMap,
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
