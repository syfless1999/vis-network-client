import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';

import routers from 'src/config/router';

const MenuGrid = styled(Grid)`
  padding: 65px 0 15px;
`;
const TitleGrid = styled(Grid)`
  text-align: justify;
  font-size: 4em;
  font-weight: 600;
  font-family: "Roboto Condensed";
`;
const MenuItem = styled.div`
  box-sizing: border-box;
  height: 40px;
  padding: 3px 0;
  border-bottom: 2px solid ${(props) => props.theme[props.color as string]};
  font-weight: 600;
  font-size: 1.5em;
  font-family: 'Roboto Condensed';
  cursor: pointer;

  & a {
    text-decoration: none;
    display: inline-block;
    width: 100%;
    color: ${(props) => props.theme['link-color']};
  }

  :hover {
    border-bottom-width: 5px;
  }
`;

const MItem = (props: { color: string, text: string, to: string }) => {
  const { color, text, to } = props;
  return (
    <MenuItem color={color}>
      <Link to={to}>{text}</Link>
    </MenuItem>
  );
};

const Header = () => (
  <Grid container wrap="wrap-reverse" justify="space-around" spacing={2}>
    <Grid item xs={7}>
      <MenuGrid container justify="space-between">
        <Grid item xs={2}>
          <MItem color="red" text="Home" to="/" />
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
    <TitleGrid item xs>Visualization Network</TitleGrid>
  </Grid>
);

export default Header;
