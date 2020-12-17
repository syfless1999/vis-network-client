import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export default function index() {
  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <TextField id="outlined-search" label="Search field" type="search" variant="outlined" />
      </Grid>
      <Grid item xs>
        file
      </Grid>
      <Grid item xs>
        method
      </Grid>
      <Grid item xs>
        submit
      </Grid>
    </Grid>
  );
}
