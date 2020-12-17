import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';

const { Footer } = Layout;

const MyFooter = styled(Footer)`
  text-align:center;
`;

function index() {
  return (
    <MyFooter>
      the garden of sinners@syfless
    </MyFooter>
  );
}

export default index;
