import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// import { Button } from 'react'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary
}));

function FormRow() {
  return (
    <React.Fragment>

      {/* Row Type */}
      <Grid item xs={3}>
        <Item>First Name: </Item>
      </Grid>

      {/* Current First Name */}
      <Grid item xs={3}>
        <TextField 
          required type="text" disabled
          label={"Your First Name"}
        />
      </Grid>

      {/* Field to Edit First Name */}
      <Grid item xs={3}>
        <TextField 
          required type="text" 
          label={"NewFirstNameTextField"}
          placeholder={"Your New First Name"}
          />
      </Grid>

      {/* Button to change first name to name in Field */}
      <Grid item xs={3}>
        <Button variant="contained">Change</Button>
      </Grid>

    </React.Fragment>
  );
}

export default function NestedGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid container item spacing={3}>
          <FormRow />
        </Grid>
        <Grid container item spacing={3}>
          <FormRow />
        </Grid>
        <Grid container item spacing={3}>
          <FormRow />
        </Grid>
      </Grid>
    </Box>
  );
}
