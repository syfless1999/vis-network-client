import {
  useState, useEffect, Dispatch, SetStateAction,
} from 'react';

function useList<T>(fetchApi: () => Promise<any[]>, deps: Array<any> = []): [
  list: T[],
  setList: Dispatch<SetStateAction<T[]>>,
  forceUpdate: () => void,
] {
  const [list, setList] = useState<Array<T>>([]);
  const [obj, setObj] = useState({});
  const forceUpdate = () => setObj({});

  useEffect(() => {
    async function fetch() {
      const data = await fetchApi();
      setList(data);
    }
    fetch();
  }, [...deps, obj]);

  return [
    list,
    setList,
    forceUpdate,
  ];
}

export default useList;
