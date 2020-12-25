import { useState, useEffect } from 'react';

export enum DataScale {
  HUNDRED = 'hundred',
  THOUSAND = 'thousand',
  MILLION = 'million',
}

export interface NodeFeature {
  count: number;
  param: Array<string>;
}

export interface EdgeFeature {
  count: number;
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
  progress: number;
  scale?: DataScale;
  needExpand: boolean;
  expandSource?: ExpandSource;
}

const mockDataSourceList = (): Array<DataSource> => {
  const createDataSource = (id: number): DataSource => ({
    id: `${id}`,
    name: 'students',
    url: 'http://students.fetch',
    node: {
      count: Math.floor(Math.random() * 10000),
      param: ['age', 'birth', 'sex'],
    },
    edge: {
      count: Math.floor(Math.random() * 1000000),
      param: ['duration'],
    },
    progress: Math.floor(Math.random() * 100),
    scale: DataScale.THOUSAND,
    needExpand: Math.random() > 0.5,
    expandSource: {
      url: 'http://students.add',
      updateCycle: 30,
    },
  });
  return Array.from({ length: 23 }).map((item, index) => createDataSource(index));
};

const useDataSource = () => {
  const [list, setList] = useState<Array<DataSource>>([]);

  useEffect(() => {
    Promise.resolve()
      .then(() => {
        setList(mockDataSourceList());
      });

    return () => {
      setList([]);
    };
  }, []);

  return [
    list,
    setList,
  ];
};

export default useDataSource;
