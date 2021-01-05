import { useState, useEffect } from 'react';

const useList = <T>(fetchApi: () => Promise<any[]>) => {
  const [list, setList] = useState<Array<T>>([]);

  useEffect(() => {
    async function fetch() {
      const data = await fetchApi();
      setList(data);
    }
    fetch();
  }, []);

  return [
    list,
    setList,
  ];
};

export default useList;
