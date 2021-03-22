import React from 'react';
import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import { isHeadCluster, isCluster } from 'src/util/network';
import { Node, Network, IdNetwork } from 'src/type/network';
import { array2Map, deleteItemWithoutOrder } from 'src/util/array';

export type CompleteNetworkFunc = (currentNetwork: IdNetwork, newIds: string[]) => Promise<Network>

interface AsyncNodeMenuProps {
  displayData: Network;
  setDisplayData: (newDisplayData: Network) => void;
  completeNetwork: CompleteNetworkFunc;
}

const { Menu } = ContextMenu;

const CustomMenu: React.FC<AsyncNodeMenuProps> = (props) => {
  const {
    displayData, setDisplayData, completeNetwork,
  } = props;
  const graphin = React.useContext(GraphinContext);
  const { contextmenu, graph } = graphin;
  const model: Node = contextmenu.node.item.getModel();

  // TODO
  const handleCompleteNetwork = async (oldNetwork: Network, newIds: string[]): Promise<void> => {
    const { nodes, edges } = oldNetwork;
    const { nodes: newNodes, edges: newEdges } = await completeNetwork({
      nodes: nodes.map((n) => n.id),
      edges: edges.map((e) => ({
        source: e.source,
        target: e.target,
      })),
    }, newIds);
    setDisplayData({
      nodes: [...nodes, ...newNodes],
      edges: [...edges, ...newEdges],
    });
  };
  const handleExpand = async () => {
    if (!isCluster(model)) return;
    const { nodes, edges } = displayData;
    const displayNodes = [...nodes];
    const displayEdges = [...edges];
    // 1 删
    // 1.1 删点
    deleteItemWithoutOrder(displayNodes, (node) => node.id === model.id);
    // 1.2 删边
    deleteItemWithoutOrder(
      displayEdges,
      (edge) => edge.source === model.id || edge.target === model.id,
    );
    // 2. 加
    const { nodes: newIds } = model;
    await handleCompleteNetwork({
      nodes: displayNodes,
      edges: displayEdges,
    }, newIds);
  };
  const handleShrink = async () => {
    const { clusterId } = model;
    if (!clusterId) return;
    const { nodes, edges } = displayData;
    const displayNodes = [...nodes];
    const displayEdges = [...edges];

    // 1. 删
    // 11. 删点
    const sameLevelNodes = deleteItemWithoutOrder(
      displayNodes,
      (node) => node.clusterId === clusterId,
    );
    const sameLevelNodeMap = array2Map(sameLevelNodes, (v) => v.id);
    // 12. 删边
    deleteItemWithoutOrder(
      displayEdges,
      (edge) => sameLevelNodeMap.has(edge.source) || sameLevelNodeMap.has(edge.target),
    );

    await handleCompleteNetwork({
      nodes: displayNodes,
      edges: displayEdges,
    }, [clusterId]);
  };
  const handleHide = () => {
    graph.remove(model.id);
  };

  return (
    <Menu bindType="node">
      {isCluster(model) ? <Menu.Item onClick={handleExpand}>Expand</Menu.Item> : <></>}
      {!isHeadCluster(model) ? <Menu.Item onClick={handleShrink}>Shrink</Menu.Item> : <></>}
      <Menu.Item onClick={handleHide}>Hide</Menu.Item>
    </Menu>
  );
};

export default CustomMenu;
