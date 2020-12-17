import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import 'fontsource-roboto-condensed/700.css';

import routers from 'src/config/router';
import Header from 'src/page/common/Header';

const SPaper = styled(Paper)`
  margin: 16px auto;
  padding: 10px;
`;

function App() {
  const Content = () => (
    <SPaper variant="outlined">
      <Switch>
        {routers.map((item) => (
          <Route key={item.key} path={item.url}>
            {item.component}
          </Route>
        ))}
        <Route path="/">
          <h1>home</h1>
        </Route>
      </Switch>
    </SPaper>
  );
  return (
    <Container maxWidth="lg">
      <Header />
      <Content />
    </Container>
  );
}

export default App;
