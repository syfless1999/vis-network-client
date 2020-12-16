import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import 'fontsource-roboto-condensed/700.css';

import routers from 'src/config/router';

const MyContainer = styled(Container)`
  margin-top: 30px;
`;
const MenuGrid = styled(Grid)`
  padding: 65px 0 15px;
`;
const MenuItem = styled.div`
  box-sizing: border-box;
  height: 40px;
  padding: 3px 0;
  border-bottom: 2px solid ${(props) => props.theme[props.color as string]};
  font-weight: 700;
  font-size: 1.5em;
  cursor: pointer;
  font-family: "Roboto Condensed";

  & a {
    text-decoration: none;
  }

  :hover {
    border-bottom-width: 5px;
  }
`;

function App() {
  const MItem = (props: { color: string, text: string, to: string }) => {
    const { color, text, to } = props;
    return (
      <MenuItem color={color}>
        <Link to={to}>{text}</Link>
      </MenuItem>
    );
  };
  const Header = () => (
    <Grid container>
      <Grid item xs={7}>
        <MenuGrid container justify="space-around" wrap="wrap">
          <Grid item xs={2}>
            <MItem color="red" text="home" to="/" />
          </Grid>
          {routers.map((item, index) => {
            const color = index % 2 === 1 ? 'red' : 'blue';
            return (
              <Grid
                item
                key={item.key}
                xs={2}
              >
                <MItem color={color} text={item.text} to={item.url} />
              </Grid>
            );
          })}
        </MenuGrid>
      </Grid>
      <Grid item xs={5}>Hello Visualization</Grid>
    </Grid>
  );
  return (
    <MyContainer maxWidth="lg">
      <Header />
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
    </MyContainer>
  );
}

export default App;
