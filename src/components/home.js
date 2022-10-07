import React, { useState, useEffect } from 'react';
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
import { Link } from 'react-router-dom';
import Nav from './nav';

function Home(props) {
    const { surveys, getSurveys, setSurvey, update, showMessage, hideMessage, setFromExisting } = props;

    // Determines whether the Dialog component for deleting surveys is open or closed
    const [openDelete, setOpenDelete] = useState(false);

    // Contains the name and id of the survey up for deletion
    const [surveyToDelete, setSurveyToDelete] = useState('');

    // Retrieves surveys from the database only after creating and deleting operations are completed
    useEffect(() => {
        setSurvey({ name: "", id: -1 });
        setFromExisting(false);
        if (!update.updating) {
            getSurveys();
        }
    }, [setSurvey, setFromExisting, update.updating, getSurveys]);

    // Opens the Dialog component for deleting surveys
    const handleOpen = (survey) => {
        setOpenDelete(true);
        setSurveyToDelete(survey);
    }

    // Deletes the survey with the given id
    const deleteSurvey = async (id) => {
        setOpenDelete(false); // Close the Dialog
        showMessage("Deleting Survey...");

        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };

        await fetch("/deleteSurvey/" + id, requestOptions)
            .then(response => {
                // Change message after deletion, but keep snackbar open for another 3 seconds
                const name = surveyToDelete.name || "Untitled Survey";
                hideMessage("Survey '" + name + "' deleted", 3);
            });
    }

    return (
        <Box>
            <Nav />
            <Container sx={{ width: 1 / 2 }} spacing={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h2" textAlign="center" sx={{ mt: 2 }}>Welcome back! You have {surveys.length} active survey{surveys.length !== 1 && "s"}.</Typography>
                    </Grid>
                    {surveys.map((survey) => {
                        return (
                            <Grid item xs={6} key={survey.id}>
                                <Card>
                                    <CardHeader
                                        action={
                                            <IconButton onClick={() => handleOpen(survey)}>
                                                <Clear />
                                            </IconButton>
                                        }
                                        title={survey.name || "Untitled Survey"}
                                        subheader={new Date(survey.time).toLocaleString()}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{survey.count} Response{survey.count !== 1 && "s"}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button component={Link} to="create" onClick={(e) => setSurvey({ name: survey.name, id: survey.id })}>Edit</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
                        <Typography variant="h5">Create a new survey...</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Button variant="contained" component={Link} to="create">from scratch</Button>
                    </Grid>
                    <Grid item xs={6} textAlign="left">
                        <Button variant="contained" component={Link} to="createFromExisting" disabled={surveys.length === 0}>from existing</Button>
                    </Grid>
                </Grid>
            </Container>
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