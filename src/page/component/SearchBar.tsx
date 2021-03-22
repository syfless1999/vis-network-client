import React from 'react';
import { Input } from 'antd';

import useRequest from 'src/util/hook/useRequest';
import styled from 'styled-components';

export interface SearchBarProps {
  onSearch: (value: string) => Promise<void>;
}

const { Search } = Input;

const ISearch = styled(Search)`
  width: auto;
  .ant-input {
    border-radius: 15px 0 0 15px;
  }
`;

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const { onSearch } = props;
  const [run, loading] = useRequest(onSearch);

  const handleSearch = async (value: string) => {
    await run(value);
  };

  return (
    <ISearch
      enterButton
      onSearch={handleSearch}
      loading={loading}
      placeholder="input search text"
    />
  );
};

export default SearchBar;
