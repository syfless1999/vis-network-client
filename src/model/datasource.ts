import { useState, useEffect } from 'react';
import useWebsocket from 'src/util/hook/useWebsocket';

export enum DataScale {
  HUNDRED = 'hundred',
  THOUSAND = 'thousand',
  MILLION = 'million',
}

export interface NodeFeature {
  total: number;
  current: number;
  param: Array<string>;
}

export interface EdgeFeature {
  total: number;
  current: number;
  param: Array<string>;
}
export interface ExpandSource {
  url: string;
  updateCycle: number;
}

export interface DataSource {
  id: string;
  name: string;
  url: string;
  node: NodeFeature;
  edge: EdgeFeature;
  progress?: number;
  scale?: DataScale;
  needExpand: boolean;
  expandSource?: ExpandSource;
}

const useDataSource = () => {
  const socket = useWebsocket('http://127.0.0.1:5000/datasource');
  const [list, setList] = useState<Array<DataSource>>([]);

  useEffect(() => {
    socket.current?.on('list', ({ list }: { list: Array<DataSource> }) => {
      for (let i = 0; i < list.length; i += 1) {
        const ds = list[i];
        const { total: nodeTotal, current: nodeCurrent } = ds.node;
        const { total: edgeTotal, current: edgeCurrent } = ds.edge;
        ds.progress = Math.ceil(((nodeCurrent + edgeCurrent - 2) / (nodeTotal + edgeTotal)) * 100);
      }
      setList(list);
    });
  }, []);

  return [
    list,
    setList,
  ];
};

export default useDataSource;
