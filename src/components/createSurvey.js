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
import Snackbar from '@mui/material/Snackbar';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Nav from './nav';
import PreviewDialog from './previewDialog';

function CreateSurvey(props) {
  const { surveyTemplate, userID, update, showMessage, hideMessage, fromExisting, setFromExisting } = props;

  // Contains survey questions
  const [questions, setQuestions] = useState([]);

  const [survey, setSurvey] = useState({ name: surveyTemplate.name, id: surveyTemplate.id });

  // On survey submission, determines whether errors should be displayed (if there are any empty fields)
  const [empty, setEmpty] = useState(false);

  // Determines whether the Dialog component for creating MC questions is open or closed
  const [openMC, setOpenMC] = useState(false);

  // Determines whether the Dialog component for previewing surveys is open or closed
  const [openPreview, setOpenPreview] = useState(false);

  // Gets the question types, prompts, and choices associated with an existing survey and populates the questions state
  const getFromExisting = useCallback(async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    let questions = await fetch("/getQuestionsAndChoices/" + surveyTemplate.id, requestOptions)
      .then(response => { return response.json() });

    setQuestions(questions);
  }, [surveyTemplate.id]);

  // Adds survey to the database
  const addSurvey = useCallback(async () => {
    const timeCreated = new Date().getTime();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Autosaving...");

    let req = await fetch("/addSurvey/" + userID + "/" + timeCreated + "/" + surveyTemplate.name, requestOptions)
      .then(response => { return response.json() });

    setSurvey({ name: surveyTemplate.name, id: req.result });
    hideMessage("Saved");
  }, [surveyTemplate.name, hideMessage, showMessage, userID]);

  // Creates a survey from an existing one
  const createFromExisting = useCallback(async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Creating Survey...");

    // Add questions
    for (let question of questions) {
      let req = await fetch("/addQuestion/" + survey.id + "/" + question.type + "/" + question.prompt, requestOptions)
        .then(response => { return response.json() });
      const questionID = req.result;
      question.id = questionID;

      // If a question has choices (i.e. is a MCQ), add them to the database
      for (let choice in question.choices) {
        req = await fetch("/addChoice/" + questionID + "/" + question.choices[choice].choice, requestOptions)
          .then(response => { return response.json() });
        question.choices[choice].id = req.result;
      }
    }

    hideMessage("Survey '" + survey.name + "' created");
    setFromExisting(false);
  }, [hideMessage, showMessage, survey, questions, setFromExisting]);

  // Set to true upon creation of new survey/retrieval of existing survey questions from database to prevent infinite loop on rerender
  const hasUpdatedStates = useRef(false);

  // Creates new surveys (from scratch or from existing) and gets questions from existing surveys (creation from existing or editing draft)
  useEffect(() => {
    if (!hasUpdatedStates.current) {
      // Add a new survey
      if (surveyTemplate.id === -1 || fromExisting) {
        addSurvey();
      }
      // Get existing survey questions
      if (surveyTemplate.id !== -1) {
        getFromExisting();
      }
      hasUpdatedStates.current = true;
    }

    // Only calls createFromExisting if the boolean 'fromExisting' is true and there are questions to add
    if (questions.length !== 0 && fromExisting) {
      createFromExisting();
    }
  }, [surveyTemplate.id, fromExisting, getFromExisting, addSurvey, createFromExisting, questions]);

  // Updates the survey name in both the survey state and the database
  const updateSurveyName = async (e) => {
    setSurvey({ name: e.target.value, id: survey.id });

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Autosaving...");

    await fetch("/updateSurveyName/" + survey.id + "/" + e.target.value, requestOptions)
      .then(response => {
        hideMessage("Saved");
        return response.json()
      });

  }

  // Adds an FRQ question object to the questions state and the database
  const addFRQ = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Autosaving...");

    let req = await fetch("/addFRQ/" + survey.id, requestOptions)
      .then(response => { return response.json() });

    const question = {
      id: req.result,
      type: 0,
      prompt: "",
      choices: [],
    };

    setQuestions([...questions, question]);
    hideMessage("Saved");
  };

  // Checks if no questions have been created or if any fields are empty, including survey name, question prompts, and MC choices.
  const isEmpty = questions.some(
    (question) =>
      question.prompt.trim() === "" ||
      (question.type === 1 &&
        question.choices.some((choice) => choice.choice.trim() === ""))
  ) || !survey.name.trim() || questions.length === 0;

  // On submission, prevents submission and displays errors if any fields are empty. Otherwise, adds the survey to the surveys list.
  const handleSubmit = (e) => {
    if (isEmpty) {
      e.preventDefault();
      setEmpty(true);
    } else {
      /* TODO: set survey from draft to active */

      showMessage("Publishing survey...");
      hideMessage("Survey '" + survey.name + "' published");
    }
  };

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
                  showMessage={showMessage}
                  hideMessage={hideMessage}
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
                  showMessage={showMessage}
                  hideMessage={hideMessage}
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
                error={!survey.name && empty}
                label="Survey Name"
                variant="outlined"
                onChange={updateSurveyName}
                value={survey.name}
                inputProps={{ maxLength: 50 }}
              />
              <Button
                variant="contained"
                onClick={addFRQ} sx={{ my: 2 }}
              >
                + FRQ
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpenMC(true)} sx={{ mb: 2 }}
              >
                + MC
              </Button>
              <Button
                variant="contained"
                disabled={isEmpty}
                onClick={() => setOpenPreview(true)} sx={{ mb: 2 }}
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
          surveyID={survey.id}
          showMessage={showMessage}
          hideMessage={hideMessage}
        />
        <PreviewDialog
          open={openPreview}
          setOpen={setOpenPreview}
          questions={questions}
          name={survey.name}
        />
        <Snackbar
          open={update.updating}
          message={update.message}
        />
      </Container>
    </Box>
  );
}

export default CreateSurvey;
