import React from 'react';
import styled from 'styled-components';
import Graph from './graph';

const GraphContainer = styled.div`
  border: 2px solid #ccc;
`;

export default function index() {
  return (
    <div>
      <h1>
        network
      </h1>
      <GraphContainer>
        <Graph />
      </GraphContainer>
    </div>
  );
}
