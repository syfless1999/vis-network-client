import { useState, useEffect } from 'react';
import useWebsocket from 'src/util/hook/useWebsocket';
import DataSource from 'src/model/datasource';

const useDataSourceList = () => {
  const socket = useWebsocket('http://127.0.0.1:5000/datasource');
  const [list, setList] = useState<Array<DataSource>>([]);

  useEffect(() => {
    socket.current?.on('list', ({ list }: { list: Array<DataSource> }) => {
      for (let i = 0; i < list.length; i += 1) {
        const ds = list[i];
        ds.edge.current -= 1;
        const { total: nodeTotal, current: nodeCurrent } = ds.node;
        const { total: edgeTotal, current: edgeCurrent } = ds.edge;
        ds.progress = Math.ceil(((nodeCurrent + edgeCurrent) / (nodeTotal + edgeTotal)) * 100);
      }
      setList(list);
    });
  }, []);

  return [
    list,
    setList,
  ];
};

export default useDataSourceList;
