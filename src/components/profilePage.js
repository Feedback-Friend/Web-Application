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

  const TOP_MARGIN_CONST = 1;

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
                value={userInfo.firstName}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                sx={{ mt: TOP_MARGIN_CONST }}
                type="text"
                label={"Change Email"}
                value={userInfo.email}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                sx={{ mt: TOP_MARGIN_CONST }}
                type="text"
                label={"Change Username"}
                value={userInfo.username}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                type="text"
                label={"Change Last Name"}
                value={userInfo.lastName}
                InputLabelProps={{ shrink: true }}
              />
              <TextField sx={{ mt: TOP_MARGIN_CONST, visibility: "hidden" }} />
              <TextField
                required
                sx={{ mt: TOP_MARGIN_CONST }}
                type="text"
                label={"Change Password"}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1.5} />
      </Grid>
      <Grid item xs={12} textAlign="center" sx={{ mt: 3 }}>
        <Button variant="contained">Apply Changes</Button>
      </Grid>
    </Box>
  );
}
