import React, { useState, useEffect, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import IconButton from "@mui/material/IconButton";
import Clear from "@mui/icons-material/Clear";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link } from 'react-router-dom';
import Nav from './nav';

function Home(props) {
    const { surveys, getSurveys, update, showMessage, hideMessage, setFromExisting, setSelectedSurvey } = props;

    // Determines whether the Dialog component for deleting surveys is open or closed
    const [openDelete, setOpenDelete] = useState(false);

    // Determines whether the Dialog component for ending surveys is open or closed
    const [openEnd, setOpenEnd] = useState(false);

    // Contains the name and id of the survey up for deletion or ending
    const [survey, setSurvey] = useState('');

    // Contains two arrays, one for drafts and one for active surveys
    const [groupedSurveys, setGroupedSurveys] = useState([]);

    // Divide the array of all surveys into an array for drafts and an array for active surveys
    const groupSurveys = useCallback(() => {
        return surveys.reduce((memo, cur) => {
            memo[cur["status"]] = [...memo[cur["status"]] || [], cur];
            return memo;
        }, {});
    }, [surveys]);

    // Determines if the latest surveys have been retrieved from the database
    const gottenSurveys = useRef(false);

    // Retrieves surveys from the database only after creating and deleting operations are completed
    useEffect(() => {
        if (!gottenSurveys.current) {
            setFromExisting(false);
            if (!update.updating) {
                getSurveys();
                gottenSurveys.current = true;
            }
        } else {
            setGroupedSurveys(groupSurveys());
        }
    }, [setFromExisting, update.updating, getSurveys, groupSurveys]);

    // Opens the Dialog component for deleting surveys
    const handleOpenDelete = (survey) => {
        setOpenDelete(true);
        setSurvey(survey);
    }

    // Deletes the survey with the given id
    const deleteSurvey = (id) => {
        setSelectedSurvey('');
        setOpenDelete(false); // Close the Dialog
        showMessage("Deleting Survey...");

        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };

        gottenSurveys.current = false;

        const func = async () => {
            await fetch("/deleteSurvey/" + id, requestOptions)
                .then(response => { return response.json(); });
            localStorage.setItem("survey", JSON.stringify({ name: "", id: -1, contactListID: -1 }));
        }

        const name = survey.name || "Untitled Survey";
        hideMessage("Survey '" + name + "' deleted", func, "deleteSurvey" + id);
    }

    // Opens the Dialog component for ending surveys
    const handleOpenEnd = (survey) => {
        setOpenEnd(true);
        setSurvey(survey);
    }

    // Updates the time stored in the database after a survey is ended
    const updateTime = async () => {
        const time = new Date().getTime();

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        };

        await fetch("/updateTime/" + survey.id + "/" + time, requestOptions)
            .then(response => { return response.json() });
    };

    // Ends the survey with the given id
    const endSurvey = (id) => {
        setOpenEnd(false);
        showMessage("Ending Survey...");

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        };

        gottenSurveys.current = false;

        let func = async () => {
            await fetch("/endSurvey/" + id, requestOptions)
                .then(response => { return response.json() });
            await updateTime();
        }

        hideMessage("Survey '" + survey.name + "' ended", func, "endSurvey");
    }

    return (
        <Box>
            <Nav />
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} textAlign="center">
                        <Typography variant="h2">Welcome Back!</Typography>
                        {surveys.length === 0 && !update.updating && <Typography variant="h3">Get started by creating a survey.</Typography>}
                    </Grid>
                    {"1" in groupedSurveys &&
                        <>
                            <Grid item xs={12}>
                                <Typography variant="h3">{groupedSurveys["1"].length} Active Survey{groupedSurveys["1"].length !== 1 && "s"}</Typography>
                            </Grid>
                            {groupedSurveys["1"].map((survey) => {
                                return (
                                    <Grid item xs={12} md={6} key={survey.id}>
                                        <Card>
                                            <CardHeader
                                                action={
                                                    <IconButton onClick={() => handleOpenDelete(survey)} disabled={update.updating}>
                                                        <Clear />
                                                    </IconButton>
                                                }
                                                title={survey.name || "Untitled Survey"}
                                                subheader={"Published " + new Date(survey.time).toLocaleString()}
                                            />
                                            <CardContent>
                                                <Typography variant="h6">{survey.count} Response{survey.count !== 1 && "s"}</Typography>
                                            </CardContent>
                                            <CardActions textAlign="left">
                                                <Button component={Link} to="results" onClick={() => setSelectedSurvey(survey)}>View Results</Button>
                                                <Button onClick={() => handleOpenEnd(survey)}>End Survey</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </>
                    }
                    {"0" in groupedSurveys &&
                        <>
                            <Grid item xs={12}>
                                {"1" in groupedSurveys && <Divider />}
                                <Typography variant="h3">{groupedSurveys["0"].length} Draft{groupedSurveys["0"].length !== 1 && "s"}</Typography>
                            </Grid>
                            {groupedSurveys["0"].map((survey) => {
                                return (
                                    <Grid item xs={12} md={6} key={survey.id}>
                                        <Card>
                                            <CardHeader
                                                action={
                                                    <IconButton onClick={() => handleOpenDelete(survey)} disabled={update.updating}>
                                                        <Clear />
                                                    </IconButton>
                                                }
                                                title={survey.name || "Untitled Survey"}
                                                subheader={"Last edited " + new Date(survey.time).toLocaleString()}
                                            />
                                            <CardActions textAlign="left">
                                                <Button component={Link} to="create" onClick={() => localStorage.setItem("survey", JSON.stringify({ name: survey.name, id: survey.id, contactListID: survey.contactListID }))}>Edit</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </>
                    }
                    {"2" in groupedSurveys &&
                        <>
                            <Grid item xs={12}>
                                {("0" in groupedSurveys || "1" in groupedSurveys) && <Divider />}
                                <Typography variant="h3">{groupedSurveys["2"].length} Completed Survey{groupedSurveys["2"].length !== 1 && "s"}</Typography>
                            </Grid>
                            {groupedSurveys["2"].map((survey) => {
                                return (
                                    <Grid item xs={12} md={6} key={survey.id}>
                                        <Card>
                                            <CardHeader
                                                action={
                                                    <IconButton onClick={() => handleOpenDelete(survey)} disabled={update.updating}>
                                                        <Clear />
                                                    </IconButton>
                                                }
                                                title={survey.name || "Untitled Survey"}
                                                subheader={"Completed " + new Date(survey.time).toLocaleString()}
                                            />
                                            <CardContent>
                                                <Typography variant="h6">{survey.count} Response{survey.count !== 1 && "s"}</Typography>
                                            </CardContent>
                                            <CardActions textAlign="left">
                                                <Button component={Link} to="results" onClick={() => setSelectedSurvey(survey)}>View Results</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </>
                    }
                </Grid>
            </Container>
            <Toolbar />
            <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar>
                    <Box textAlign="center" sx={{ flexGrow: 1 }}>
                        <Button variant="inherit" component={Link} to="create" onClick={() => localStorage.setItem("survey", JSON.stringify({ name: "", id: -1, contactListID: -1 }))}>Create from scratch</Button>
                        <Button variant="inherit" component={Link} to="createFromExisting" disabled={surveys.length === 0}>Create from existing</Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>
                    Are you sure you want to delete {survey.name || "Untitled Survey"}? This can't be undone.
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center" }}>
                    <Button onClick={() => deleteSurvey(survey.id)}>Yes</Button>
                    <Button onClick={() => setOpenDelete(false)}>No</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={openEnd} onClose={() => setOpenEnd(false)}>
                <DialogTitle>
                    Are you sure you want to end {survey.name || "Untitled Survey"}? This can't be undone.
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center" }}>
                    <Button onClick={() => endSurvey(survey.id)}>Yes</Button>
                    <Button onClick={() => setOpenEnd(false)}>No</Button>
                </DialogContent>
            </Dialog>
            <Snackbar
                open={update.updating}
                message={update.message}
            />
        </Box >
    );
}

export default Home;