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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function TakeSurvey(props) {
  const { surveys, setSurveys, surveyIndex } = props;

  // Contains a list of responses to each question.
  const [responses, setResponses] = useState([""]);

  // Determines whether to display an error on submission if any of the questions are left unanswered
  const [unanswered, setUnanswered] = useState(false);

  // On submission, prevents submission and displays an error if any questions are left unanswered. Otherwise, adds the list of responses to the survey just taken in the 'surveys' state.
  const handleSubmit = (e) => {
    const unanswered = responses.length !== surveys[surveyIndex].questions.length || responses.some((response) => response === "");
    if (unanswered) {
      e.preventDefault();
      setUnanswered(unanswered);
    } else {
      let newArr = [...surveys];
      newArr[surveyIndex].responses = [...surveys[surveyIndex].responses, responses];
      setSurveys(newArr);
    }
  };

  // Sets the response for each question. For FRQ, response is a string, and for MC, response is the integer index of the selected choice.
  const setResponse = (index) => (e) => {
    let type = surveys[surveyIndex].questions[index].type;
    let newArr = [...responses];
    newArr[index] = (type === "MC") ? surveys[surveyIndex].questions[index].choices.indexOf(e.target.value) : e.target.value;
    setResponses(newArr);
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Displays the list of question prompts and either a TextField or RadioGroup depending on whether the question is FRQ or MC.
  const prompts = surveys[surveyIndex].questions.map((question, index) => {
    const primary = index + 1 + ". " + question.prompt;
    return (
      <ListItem key={index} sx={{ display: "inline-block" }}>
        <ListItemText primary={primary} />
        {question.type === "FRQ" ? (
          <TextField
            error={unanswered && !responses[index]}
            onChange={setResponse(index)}
            margin="normal"
            fullWidth
          />
        ) : (
          <FormControl error={unanswered && !responses[index]}>
            <RadioGroup onChange={setResponse(index)}>
              {question.choices.map((choice, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    value={question.choices[index]}
                    control={<Radio />}
                    label={alphabet.charAt(index) + ". " + question.choices[index]}
                  />
                );
              })}
              {unanswered && !responses[index] && (
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
      <Typography>{surveys[surveyIndex].name}</Typography>
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
