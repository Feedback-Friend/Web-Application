import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Nav from "./nav";
import { getListItemAvatarUtilityClass } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const NameRow = (props) => {
  const { firstName } = props;

  return (
    <>
      {/* Row Type */}
      <Grid item xs={2}>
        <Item>Name: </Item>
      </Grid>

      {/* Current First Name */}
      <Grid item xs={2}>
        <TextField
          required
          type="text"
          disabled
          // label={firstName.first_name}
          value={firstName}
        />
      </Grid>
      {/* Current Last Name */}
      <Grid item xs={2}>
        <TextField required type="text" disabled label={"Last Name"} />
      </Grid>

      {/* Field to Edit First Name */}
      <Grid item xs={2}>
        <TextField
          required
          type="text"
          label={"Change First Name"}
          placeholder={"Enter if applicable"}
        />
      </Grid>
      {/* Field to Edit Last Name */}
      <Grid item xs={2}>
        <TextField
          required
          type="text"
          label={"Change Last Name"}
          placeholder={"Enter if applicable"}
        />
      </Grid>

      {/* Button to change first name to name from fields */}
      <Grid item xs={2}>
        <Button variant="contained">Change</Button>
      </Grid>
    </>
  );
};

const UsernameRow = (props) => {
  return (
    <>
      {/* Row Type */}
      <Grid item xs={3}>
        <Item>Username: </Item>
      </Grid>

      {/* Current Username */}
      <Grid item xs={3}>
        <TextField required type="text" disabled label={"Username"} />
      </Grid>

      {/* Field to Edit Username */}
      <Grid item xs={3}>
        <TextField
          required
          type="text"
          label={"Change Username"}
          placeholder={"Enter if applicable"}
        />
      </Grid>

      {/* Button to change first name to name from field */}
      <Grid item xs={3}>
        <Button variant="contained">Change</Button>
      </Grid>
    </>
  );
};

const EmailRow = (props) => {
  return (
    <>
      {/* Row Type */}
      <Grid item xs={3}>
        <Item>Email: </Item>
      </Grid>

      {/* Current Email */}
      <Grid item xs={3}>
        <TextField required type="text" disabled label={"Email"} />
      </Grid>

      {/* Field to Edit Email */}
      <Grid item xs={3}>
        <TextField
          required
          type="text"
          label={"Change Email"}
          placeholder={"Enter if applicable"}
        />
      </Grid>

      {/* Button to change email to email from field */}
      <Grid item xs={3}>
        <Button variant="contained">Change</Button>
      </Grid>
    </>
  );
};

export default function NestedGrid(props) {
  // Contains the current userID
  const [userID, setUserID] = React.useState(localStorage.getItem("userID"));

  // const [firstName, setFirstName] = React.useState("");
  // const [lastName, setLastName] = React.useState("");
  // const [username, setUsername] = React.useState("");
  // const [email, setEmail] = React.useState("");

  const [userInfo, setUserInfo] = React.useState("");

  // This calls our function
  // [] means that it will run once
  React.useEffect(() => {
    retrieveUserInfoFromDB();
    setVars();
    // getFirstName();
    // getLastName();
    // getUsername();
    // getEmail();
  }, []);

  const retrieveUserInfoFromDB = async () => {
    let res = await fetch("/getFirstName/" + userID).then((response) => {
      return response.json();
    });
    setFirstName(res.first_name);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Nav />
      <Grid container spacing={1}>
        <Grid container item spacing={3}>
          <NameRow firstName={firstName} />
        </Grid>
        <Grid container item spacing={3}>
          <UsernameRow />
        </Grid>
        <Grid container item spacing={3}>
          <EmailRow />
        </Grid>
      </Grid>
    </Box>
  );
}
