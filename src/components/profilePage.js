import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary
}));

function FormNameRow() {
  return (
    <React.Fragment>

      {/* Row Type */}
      <Grid item xs={2}>
        <Item>Name: </Item>
      </Grid>

      {/* Current First Name */}
      <Grid item xs={2}>
        <TextField 
          required type="text" disabled
          label={"First Name"}
        />
      </Grid>
      {/* Current Last Name */}
      <Grid item xs={2}>
        <TextField 
          required type="text" disabled
          label={"Last Name"}
        />
      </Grid>

      {/* Field to Edit First Name */}
      <Grid item xs={2}>
        <TextField 
          required type="text" 
          label={"Change First Name"}
          placeholder={"Enter if applicable"}
          />
      </Grid>
      {/* Field to Edit Last Name */}
      <Grid item xs={2}>
        <TextField 
          required type="text" 
          label={"Change Last Name"}
          placeholder={"Enter if applicable"}
          />
      </Grid>

      {/* Button to change first name to name from fields */}
      <Grid item xs={2}>
        <Button variant="contained">Change</Button>
      </Grid>

    </React.Fragment>
  );
}

function FormUsernameRow() {
  return (
    <React.Fragment>

      {/* Row Type */}
      <Grid item xs={3}>
        <Item>Username: </Item>
      </Grid>

      {/* Current Username */}
      <Grid item xs={3}>
        <TextField 
          required type="text" disabled
          label={"Username"}
        />
      </Grid>

      {/* Field to Edit Username */}
      <Grid item xs={3}>
        <TextField 
          required type="text" 
          label={"Change Username"}
          placeholder={"Enter if applicable"}
          />
      </Grid>

      {/* Button to change first name to name from field */}
      <Grid item xs={3}>
        <Button variant="contained">Change</Button>
      </Grid>

    </React.Fragment>
  );
}

function FormEmailRow() {
  return (
    <React.Fragment>

      {/* Row Type */}
      <Grid item xs={3}>
        <Item>Email: </Item>
      </Grid>

      {/* Current Email */}
      <Grid item xs={3}>
        <TextField 
          required type="text" disabled
          label={"Email"}
        />
      </Grid>

      {/* Field to Edit Email */}
      <Grid item xs={3}>
        <TextField 
          required type="text" 
          label={"Change Email"}
          placeholder={"Enter if applicable"}
          />
      </Grid>

      {/* Button to change email to email from field */}
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
          <FormNameRow />
        </Grid>
        <Grid container item spacing={3}>
          <FormUsernameRow />
        </Grid>
        <Grid container item spacing={3}>
          <FormEmailRow />
        </Grid>
      </Grid>
    </Box>
  );
}

