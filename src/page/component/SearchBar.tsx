import React from 'react';
import { Input } from 'antd';

import useRequest from 'src/util/hook/useRequest';

export interface SearchBarProps {
  onSearch: (value: string) => Promise<void>;
}

const { Search } = Input;

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const { onSearch } = props;
  const [run, loading] = useRequest(onSearch);

  const handleSearch = async (value: string) => {
    await run(value);
  };

  return (
    <Search
      enterButton
      onSearch={handleSearch}
      loading={loading}
      placeholder="input search text"
    />
  );
};

export default SearchBar;
