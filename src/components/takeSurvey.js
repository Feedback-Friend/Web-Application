import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function TakeSurvey(props) {
  const { survey } = props;

  const [questions, setQuestions] = useState([]);

  // Determines whether to display an error on submission if any of the questions are left unanswered
  const [unanswered, setUnanswered] = useState(false);

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    let questions = await fetch("/getQuestionsAndChoices/" + survey.id, requestOptions)
      .then(response => { return response.json(); });
    setQuestions(questions);
    console.log(questions);
  }

  // On submission, prevents submission and displays an error if any questions are left unanswered. Otherwise, adds the list of responses to the survey just taken in the 'surveys' state.
  const handleSubmit = (e) => {
    const unanswered = questions.some((question) => !question.response);
    if (unanswered) {
      e.preventDefault();
      setUnanswered(unanswered);
    } else {
      /* TODO: fetch */
    }
  };

  // Sets the response for each question. For FRQ, response is a string, and for MC, response is the integer index of the selected choice.
  const setResponse = (index) => (e) => {
    let newArr = [...questions];
    newArr[index].response = e.target.value;
    setQuestions(newArr);
    console.log(newArr);
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Displays the list of question prompts and either a TextField or RadioGroup depending on whether the question is FRQ or MC.
  const prompts = questions.map((question, index) => {
    const primary = index + 1 + ". " + question.prompt;
    return (
      <ListItem key={question.id} sx={{ display: "inline-block" }}>
        <ListItemText primary={primary} />
        {question.type === 0 ? (
          <TextField
            error={unanswered && !question.response}
            onChange={setResponse(index)}
            margin="normal"
            fullWidth
          />
        ) : (
          <FormControl error={unanswered && !question.response}>
            <RadioGroup onChange={setResponse(index)}>
              {question.choices.map((choice, index) => {
                return (
                  <FormControlLabel
                    key={choice.id}
                    value={choice.id}
                    control={<Radio />}
                    label={alphabet.charAt(index) + ". " + choice.choice}
                  />
                );
              })}
              {unanswered && !question.response && (
                <FormHelperText>Please select an option</FormHelperText>
              )}
            </RadioGroup>
          </FormControl>
        )}
      </ListItem>
    );
  });

  return (
    <List sx={{ width: 1 / 2, mx: "auto" }}>
      <Typography variant="h3" textAlign="center">{survey.name}</Typography>
      {prompts}
      <Button
        variant="contained"
        component={Link}
        to="/results"
        onClick={handleSubmit}
        sx={{ ml: 2 }}
      >
        Submit
      </Button>
    </List>
  );
}

export default TakeSurvey;