import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';
import Nav from './nav';

function Home(props) {
    const { surveys, setSurveys, setSurveyIndex, setName, setQuestions } = props;

    // Determines whether the Dialog component for deleting surveys is open or closed
    const [open, setOpen] = useState(false);

    // When a 'take survey' button is clicked, set the index of the corresponding survey
    const handleClick = (index) => {
        setSurveyIndex(index);
    }

    // Opens the Dialog component for deleting surveys
    const handleOpen = () => {
        setOpen(true);
    }

    // Closes the Dialog component for deleting surveys
    const handleClose = () => {
        setOpen(false);
    }

    // Deletes the survey at the given index
    const deleteSurvey = (index) => (e) => {
        let newArr = [...surveys];
        newArr.splice(index, 1);
        setSurveys(newArr);
        handleClose();
    }

    // If creating a survey from scratch, resets the name and questions states to empty values
    const fromScratch = () => {
        setName('');
        setQuestions([]);
    }

    return (
        <Box>
            <Nav />
            <Container sx={{ width: 1 / 2 }} spacing={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h2" textAlign="center" sx={{ mt: 2 }}>Active surveys: {surveys.length}</Typography>
                    </Grid>
                    {surveys.map((survey, index) => {
                        return (
                            <Grid item xs={6} key={index}>
                                <Card>
                                    <CardHeader
                                        action={
                                            <IconButton onClick={handleOpen}>
                                                <Clear />
                                            </IconButton>
                                        }
                                        title={survey.name}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{survey.questions.length} Question{survey.questions.length !== 1 && "s"}</Typography>
                                        <Typography variant="h6">{survey.responses.length} Response{survey.responses.length !== 1 && "s"}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button component={Link} to="/survey" onClick={handleClick(index)}>Take Survey</Button>
                                    </CardActions>
                                </Card>
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>
                                        Are you sure you want to delete {survey.name}?
                                    </DialogTitle>
                                    <DialogContent sx={{ textAlign: "center" }}>
                                        <Button onClick={deleteSurvey(index)}>Yes</Button>
                                        <Button onClick={handleClose}>No</Button>
                                    </DialogContent>
                                </Dialog>
                            </Grid>
                        );
                    })}
                </Grid>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
                        <Typography variant="h5">Create a new survey...</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Button variant="contained" component={Link} to="create" onClick={fromScratch}>from scratch</Button>
                    </Grid>
                    <Grid item xs={6} textAlign="left">
                        <Button variant="contained" component={Link} to="createFromExisting" disabled={surveys.length === 0}>from existing</Button>
                    </Grid>
                </Grid>
            </Container>
        </Box >
    );
}

export default Home;