import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import Nav from "./nav";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function NestedGrid(props) {
  // Contains the current userID
  const [userID, setUserID] = React.useState(localStorage.getItem("userID"));

  // Use {} in usestate for json objects
  const [userInfo, setUserInfo] = React.useState({});
  const [fields, setFields] = React.useState({}); //text fields values

  const TOP_MARGIN_CONST = 1;

  // update the text boxes' field variables
  function updateFields(event) {
    var name = event.target.name;
    var value = event.target.value;
    // only update value of credential that is actually updated
    setFields(fields => ({...fields, [name]: value}));
  }

  // update fields in db call
  function submit(e) {
    alert(JSON.stringify(fields));
    e.preventDefault(); //prevents default actions of form from happening (reloads page contents)
    /*
      *
      * This is where we are calling backend component
      *
      */
    // update firstname
    if(fields.hasOwnProperty("firstName")) {
      if(fields["firstName"] !== "") {
        fetch("/updateFirstName/" + userID + "/" + fields["firstName"])
          .then(response => response.json())
          .then(data => {
          }).catch(error => {
              console.log(error);
          });
      }
    }
    // update lastname
    if(fields.hasOwnProperty("lastName")) {
      if(fields["firstName"] !== "") {
        fetch("/updateLastName/" + userID + "/" + fields["lastName"])
          .then(response => response.json())
          .then(data => {
          }).catch(error => {
              console.log(error);
          });
      }
    }
    // update email
    if(fields.hasOwnProperty("email")) {
      if(fields["email"] !== "") {
        fetch("/updateEmailAddress/" + userID + "/" + fields["email"])
          .then(response => response.json())
          .then(data => {
          }).catch(error => {
              console.log(error);
          });
      }
    }
    // update username
    if(fields.hasOwnProperty("username")) {
      if(fields["username"] !== "") {
        fetch("/updateUsername/" + userID + "/" + fields["username"])
          .then(response => response.json())
          .then(data => {
          }).catch(error => {
              console.log(error);
          });
      }
    }
    // update password
    if(fields.hasOwnProperty("password")) {
      if(fields["password"] !== "") {
        fetch("/updatePassword/" + userID + "/" + fields["password"])
          .then(response => response.json())
          .then(data => {
          }).catch(error => {
              console.log(error);
          });
      }
    }
  }


  // This calls our function
  // [] means that it will run once
  React.useEffect(() => {
    retrieveUserInfoFromDB();
    console.log(userInfo.firstName);
    console.log(userInfo.lastName);
    console.log(userInfo.first_name);
    console.log(userInfo.last_name);
  }, []);

  const retrieveUserInfoFromDB = async () => {
    let res = await fetch("/getUserInfo/" + userID).then((response) => {
      return response.json();
    });
    setUserInfo(res);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Nav />
      <Grid container textAlign="center" spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={0.25} />
        <Grid item xs={1.25} textAlign="left" sx={{ mt: 2 }}>
          <TextField required sx={{"fieldset": { border: 'none' }}} type="text" disabled value="Name:" />
          <TextField required sx={{"fieldset": { border: 'none' }, mt: 0.5}} type="text" disabled value="Email:" />
          <TextField required sx={{"fieldset": { border: 'none' }, mt: 0.5}} type="text" disabled value="Username:" />
        </Grid>
        <Grid item xs={2.5} textAlign="left" sx={{ mt: 2 }}>
          <TextField required sx={{ width: "100%" }} type="text" disabled value={userInfo.firstName + " " + userInfo.lastName} />
          <TextField required sx={{ width: "100%", mt: TOP_MARGIN_CONST }} type="text" disabled value={userInfo.email} />
          <TextField required sx={{ width: "100%", mt: TOP_MARGIN_CONST }} type="text" disabled value={userInfo.username} />
        </Grid>
        <Grid item xs={1.5} />
        <Grid item xs={5} textAlign="left" sx={{ mt: 2 }}>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                required
                type="text"
                label={"Change First Name"}
                name="firstName"
                onChange={updateFields}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                sx={{ mt: TOP_MARGIN_CONST }}
                type="text"
                label={"Change Email"}
                name="email"
                onChange={updateFields}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                sx={{ mt: TOP_MARGIN_CONST }}
                type="text"
                label={"Change Username"}
                name="username"
                onChange={updateFields}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                sx={{ mt: TOP_MARGIN_CONST }}
                type="text"
                name="password"
                onChange={updateFields}
                label={"Change Password"}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                type="text"
                name="lastName"
                label={"Change Last Name"}
                onChange={updateFields}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1.5} />
      </Grid>
      <Grid item xs={12} textAlign="center" sx={{ mt: 3 }}>
        <Button variant="contained" onClick={submit}>Apply Changes</Button>
      </Grid>
    </Box>
  );
}
