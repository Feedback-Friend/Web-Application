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
    const { surveys, getSurveys, setSurveyID, setSurveyIndex, update, setUpdate } = props;

    // Retrieves surveys from the database only after creating and deleting operations are completed
    useEffect(() => {
        setSurveyID(-1);
        if (!update.deleting && !update.creating) {
            getSurveys();
        }
    }, [update]);

    // Determines whether the Dialog component for deleting surveys is open or closed
    const [open, setOpen] = useState(false);

    // When a 'take survey' button is clicked, set the index of the corresponding survey
    const handleClick = (index) => {
        setSurveyIndex(index);
    }

    // Opens the Dialog component for deleting surveys
    const handleOpen = (survey, e) => {
        setOpen(true);
        setSurveyToDelete(survey);
    }

    // Closes the Dialog component for deleting surveys
    const handleClose = () => {
        setOpen(false);
        setSurveyToDelete('');
    }

    // Contains the name and id of the survey up for deletion
    const [surveyToDelete, setSurveyToDelete] = useState('');

    // Deletes the survey with the given id
    const deleteSurvey = async (id, e) => {
        handleClose();
        setUpdate({ creating: update.creating, deleting: true, message: "Deleting Survey..." });
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };
        const req = await fetch("/deleteSurvey/" + id, requestOptions)
            .then(response => {
                setUpdate({ creating: update.creating, deleting: false, message: update.message });
                return response.json();
            });
    }

    return (
        <Box>
            <Nav />
            <Container sx={{ width: 1 / 2 }} spacing={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h2" textAlign="center" sx={{ mt: 2 }}>Active surveys: {surveys.length}</Typography>
                    </Grid>
                    {surveys.map((survey) => {
                        return (
                            <Grid item xs={6} key={survey.id}>
                                <Card>
                                    <CardHeader
                                        action={
                                            <IconButton onClick={(e) => handleOpen(survey, e)} disabled={update.creating || update.deleting}>
                                                <Clear />
                                            </IconButton>
                                        }
                                        title={survey.name}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{survey.count} Response{survey.count !== 1 && "s"}</Typography>
                                    </CardContent>
                                    {/*<CardActions>
                                        <Button component={Link} to="/survey" onClick={handleClick(index)}>Take Survey</Button>
                                    </CardActions>*/}
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
            {surveyToDelete && <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Are you sure you want to delete {surveyToDelete.name}?
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center" }}>
                    <Button onClick={(e) => deleteSurvey(surveyToDelete.id, e)}>Yes</Button>
                    <Button onClick={handleClose}>No</Button>
                </DialogContent>
            </Dialog>}
            <Snackbar
                open={update.creating || update.deleting}
                message={update.message}
            />
        </Box >
    );
}

export default Home;