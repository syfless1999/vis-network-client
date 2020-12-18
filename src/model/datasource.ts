import { useState, useEffect } from 'react';

export enum DataScale {
  HUNDRED = 'hundred',
  THOUSAND = 'thousand',
  MILLION = 'million',
}

export interface DataParam {
  node?: Array<string>;
  edge?: Array<string>;
}

export interface ExpandSource {
  url: string;
  updateCycle: number;
}

export interface DataSource {
  id: number;
  key?: number;
  name: string;
  url: string;
  scale?: DataScale;
  param: DataParam;
  needExpand: boolean;
  expandSource?: ExpandSource;
}

const mockDataSourceList = (): Array<DataSource> => {
  const createDataSource = (id: number): DataSource => ({
    id,
    key: id,
    name: 'students',
    url: 'http://students.fetch',
    scale: DataScale.THOUSAND,
    param: {
      node: ['age', 'birth', 'sex'],
      edge: ['duration'],
    },
    needExpand: true,
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
        setTimeout(() => {
          setList(mockDataSourceList());
        }, 500);
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
