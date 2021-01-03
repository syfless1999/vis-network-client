import { useState, useEffect } from 'react';

const useList = (fetchApi: () => Promise<Array<any>>) => {
  const [list, setList] = useState<Array<any>>([]);

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
