import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FRQ from './FRQ';
import MC from './MC';
import MCDialog from './MCDialog';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from 'react';
import Nav from './nav';
import PreviewDialog from './previewDialog';

function CreateSurvey(props) {
  const { survey, userID, update, setUpdate } = props;

  // Contains survey name
  const [name, setName] = useState('');

  // Contains survey questions
  const [questions, setQuestions] = useState([]);

  // On survey submission, determines whether errors should be displayed (if there are any empty fields)
  const [empty, setEmpty] = useState(false);

  // Determines whether the Dialog component for creating MC questions is open or closed
  const [openMC, setOpenMC] = useState(false);

  // Determines whether the Dialog component for previewing surveys is open or closed
  const [openPreview, setOpenPreview] = useState(false);


  // If a survey is created from existing, gets the questions associated with that survey on page load
  useEffect(() => {
    if (survey.id !== -1) {
      getFromExisting();
    }
  }, []);

  // Gets the question types, prompts, and choices associated with an existing survey and populates the questions state
  const getFromExisting = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    let questions = await fetch("/getQuestionsAndChoices/" + survey.id, requestOptions)
      .then(response => { return response.json() });
    setQuestions(questions);
  };

  // Opens the Dialog component for creating MC questions
  const handleOpenMC = () => {
    setOpenMC(true);
  };

  // Opens the Dialog component for previewing surveys
  const handleOpenPreview = () => {
    setOpenPreview(true);
  };

  // Adds an FRQ question object to the questions list. Question fields include 'type', 'prompt', and 'choices'.
  const addFRQ = () => {
    const question = {
      type: 0,
      prompt: "",
      choices: [],
    };

    setQuestions([...questions, question]);
  };

  // Checks if no questions have been created or if any fields are empty, including survey name, question prompts, and MC choices.
  const isEmpty = questions.some(
    (question) =>
      question.prompt.trim() === "" ||
      (question.type === 1 &&
        question.choices.some((choice) => choice.choice.trim() === ""))
  ) || !name.trim() || questions.length === 0;

  // On submission, prevents submission and displays errors if any fields are empty. Otherwise, adds the survey to the surveys list.
  const handleSubmit = (e) => {
    if (isEmpty) {
      e.preventDefault();
      setEmpty(true);
    } else {
      setUpdate({ creating: true, deleting: false, message: "Creating Survey...", open: true });
      addSurvey().then(response => {
        setUpdate({ creating: false, deleting: false, message: "Survey '" + name + "' created", open: true });
        const timer = setTimeout(() => {
          setUpdate({ creating: update.creating, deleting: false, message: "", open: false });
        }, 3000);
        return () => clearTimeout(timer);
      });
    }
  };

  // Adds survey and its related questions and answer choices to the database
  const addSurvey = async () => {
    const timeCreated = new Date().getTime();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    let req = await fetch("/addSurvey/" + userID + "/" + name + "/" + timeCreated, requestOptions)
      .then(response => { return response.json() });
    const surveyID = req.result;

    // Add questions
    for (let question of questions) {
      req = await fetch("/addQuestion/" + surveyID + "/" + question.type + "/" + question.prompt, requestOptions)
        .then(response => { return response.json() });
      const questionID = req.result;

      // If a question has choices (i.e. is a MCQ), add them to the database
      for (let choice of question.choices) {
        req = await fetch("/addChoice/" + questionID + "/" + choice.choice, requestOptions)
          .then(response => { return response.json() });
      }
    }
  }

  return (
    <Box>
      <Nav />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            {questions.map((question, index) => {
              return question.type === 0 ? (
                <FRQ
                  questions={questions}
                  setQuestions={setQuestions}
                  index={index}
                  empty={empty && !question.prompt}
                  key={index}
                />
              ) : (
                <MC
                  questions={questions}
                  setQuestions={setQuestions}
                  index={index}
                  empty={
                    empty &&
                    (!question.prompt ||
                      question.choices.some((choice) => choice.choice === ""))
                  }
                  key={index}
                />
              );
            })}
            {empty && (
              <Box>
                <Alert severity="error" sx={{ mt: 1 }}>
                  Please fill out all fields
                </Alert>
              </Box>
            )}
          </Grid>
          <Grid item xs={2}>
            <Stack sx={{ border: "solid 1px black", backgroundColor: "ghostwhite", p: 2, mt: 2 }}>
              <TextField
                autoFocus
                error={!name && empty}
                label="Survey Name"
                variant="outlined"
                onChange={(e) => { setName(e.target.value) }}
                value={name}
              />
              <Button
                variant="contained"
                onClick={addFRQ} sx={{ my: 2 }}
              >
                + FRQ
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenMC} sx={{ mb: 2 }}
              >
                + MC
              </Button>
              <Button
                variant="contained"
                disabled={isEmpty}
                onClick={handleOpenPreview} sx={{ mb: 2 }}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                disabled={isEmpty}
                component={Link}
                to="/"
                onClick={handleSubmit}
              >
                Publish
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MCDialog
          open={openMC}
          setOpen={setOpenMC}
          questions={questions}
          setQuestions={setQuestions}
        />
        <PreviewDialog
          open={openPreview}
          setOpen={setOpenPreview}
          questions={questions}
          name={name}
        />
      </Container>
    </Box>
  );
}

export default CreateSurvey;
