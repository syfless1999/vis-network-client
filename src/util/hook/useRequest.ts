import { useState } from 'react';

function useRequest<T extends unknown[], U>(
  request: (...args: T) => Promise<U> | U,
): [(...args: T) => Promise<U>, boolean] {
  const [loading, setLoading] = useState(false);

  const run = async (...args: T) => {
    setLoading(true);
    const res = await request(...args);
    setLoading(false);
    return res;
  };

  return [run, loading];
}

export default useRequest;
