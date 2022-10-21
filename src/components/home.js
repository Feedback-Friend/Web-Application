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
    const { surveys, getSurveys, update, showMessage, hideMessage, setFromExisting } = props;

    // Determines whether the Dialog component for deleting surveys is open or closed
    const [openDelete, setOpenDelete] = useState(false);

    // Contains the name and id of the survey up for deletion
    const [surveyToDelete, setSurveyToDelete] = useState('');

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
    const handleOpen = (survey) => {
        setOpenDelete(true);
        setSurveyToDelete(survey);
    }

    // Deletes the survey with the given id
    const deleteSurvey = (id) => {
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
            localStorage.setItem("survey", JSON.stringify({ name: "", id: -1 }));
        }

        const name = surveyToDelete.name || "Untitled Survey";
        hideMessage("Survey '" + name + "' deleted", func, "deleteSurvey" + id);
    }

    return (
        <Box>
            <Nav />
            <Container>
                <Grid container spacing={2} textAlign="center">
                    <Grid item xs={12}>
                        <Typography variant="h2">Welcome Back!</Typography>
                        {surveys.length === 0 && <Typography variant="h3">Get started by creating a survey.</Typography>}
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
                                                    <IconButton onClick={() => handleOpen(survey)} disabled={update.updating}>
                                                        <Clear />
                                                    </IconButton>
                                                }
                                                title={survey.name || "Untitled Survey"}
                                                subheader={new Date(survey.time).toLocaleString()}
                                            />
                                            <CardContent>
                                                <Typography variant="h6">{survey.count} Response{survey.count !== 1 && "s"}</Typography>
                                            </CardContent>
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
                                                    <IconButton onClick={() => handleOpen(survey)} disabled={update.updating}>
                                                        <Clear />
                                                    </IconButton>
                                                }
                                                title={survey.name || "Untitled Survey"}
                                                subheader={new Date(survey.time).toLocaleString()}
                                            />
                                            <CardActions textAlign="left">
                                                <Button component={Link} to="create" onClick={() => localStorage.setItem("survey", JSON.stringify({ name: survey.name, id: survey.id }))}>Edit</Button>
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
                        <Button variant="inherit" component={Link} to="create" onClick={() => localStorage.setItem("survey", JSON.stringify({ name: "", id: -1 }))}>Create from scratch</Button>
                        <Button variant="inherit" component={Link} to="createFromExisting" disabled={surveys.length === 0}>Create from existing</Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>
                    Are you sure you want to delete {surveyToDelete.name || "Untitled Survey"}?
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center" }}>
                    <Button onClick={() => deleteSurvey(surveyToDelete.id)}>Yes</Button>
                    <Button onClick={() => setOpenDelete(false)}>No</Button>
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