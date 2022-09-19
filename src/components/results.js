import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import React, { useState } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Nav from './nav';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

function Results(props) {
  const { surveys } = props;

  // Contains the chosen survey
  const [survey, setSurvey] = useState('');

  // Contains the chosen question
  const [question, setQuestion] = useState('');

  // Contains a list of the number of responses for each choice, if the currently chosen question is MC
  const [counts, setCounts] = useState([]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Contains the data to be displayed on the bar graph (letter and number of responses for that letter).
  const data = counts.map((count, index) => {
    return (
      {
        name: alphabet.charAt(index),
        count: count
      }
    )
  });

  // If the chosen question is MC, determines the number of responses for each choice and updates the 'counts' state
  const handleQuestion = (e) => {
    setQuestion(e.target.value);
    if (survey.questions[e.target.value].type === "MC") {
      let newArr = [...counts];
      survey.questions[e.target.value].choices.map((choice, index) => {
        newArr[index] = 0;
      });
      survey.responses.map((response, index) => {
        newArr[response[e.target.value]]++;
      });
      setCounts(newArr);
    }
  };

  return (
    <Box>
      <Nav />
      <Container>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Survey</InputLabel>
              <Select
                label="Survey"
                onChange={(e) => setSurvey(e.target.value)}
                defaultValue=""
              >
                {surveys.map((survey, index) => {
                  return (
                    <MenuItem key={index} value={survey}>
                      {survey.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

          </Grid>
          {survey && <Grid item xs={8}>
            <FormControl fullWidth>
              <InputLabel>Question</InputLabel>
              <Select
                label="Question"
                onChange={handleQuestion}
                defaultValue=""
              >
                {survey.questions.map((question, index) => {
                  return (
                    <MenuItem key={index} value={index}>{question.prompt}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {question !== "" && (survey.questions[question].type === "FRQ" ? (<List>
              {survey.responses.map((response, index) => {
                return (
                  <Box>
                    {index > 0 && <Divider />}
                    <ListItem key={index}>{response[question]}</ListItem>
                  </Box>
                );
              })}
            </List>) :
              (<Box sx={{ my: 2 }}>
                <BarChart
                  width={500}
                  height={300}
                  data={data}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
                <List sx={{ border: "solid 1px black" }}>
                  {survey.questions[question].choices.map((choice, index) => {
                    return (
                      <ListItem key={index}>{alphabet.charAt(index) + ": " + choice}</ListItem>
                    );
                  })}
                </List>
              </Box>)
            )}
          </Grid>}
        </Grid>
      </Container>
    </Box>
  );
}

export default Results;
