import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';

const { Footer } = Layout;

const MyFooter = styled(Footer)`
  background-color: ${(props) => props.theme['panel-background']};
`;

function index() {
  return (
    <MyFooter style={{ textAlign: 'center' }}>
      the garden of sinners@syfless
    </MyFooter>
  );
}

export default index;
