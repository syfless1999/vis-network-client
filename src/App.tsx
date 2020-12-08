import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

const Header = styled.div`
  text-align:center;
`;

function App() {
  const header = useRef(null);
  useEffect(() => {
    d3.select(header.current)
      .text('hello network visualization with React and D3');
  }, []);

  return (
    <Header ref={header}>
      ....
    </Header>
  );
}

export default App;
