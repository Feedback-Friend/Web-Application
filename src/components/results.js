import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Nav from './nav';
import { DataGrid } from '@mui/x-data-grid';
import BarChart from "react-bar-chart";
import Typography from '@mui/material/Typography';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



function Results(props) {
  const { surveys, getSurveys, update, selectedSurvey, setSelectedSurvey } = props;

  const [frq, setFRQ] = React.useState([])

  const gottenSurveys = useRef(false)
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [checked, setChecked] = React.useState(false);

  // Retrieves surveys from the database only after creating and deleting operations are completed
  useEffect(() => {
    if (!gottenSurveys.current) {
      if (!update.updating) {
        getSurveys()
        gottenSurveys.current = true
        if (selectedSurvey) {
            fetch_and_set(selectedSurvey);
        }
      }
    }
    if (!checked){
      fetch_and_set(selectedSurvey)
    }
    if (startDate && endDate){
      fetch_and_set_filtered(selectedSurvey)
    }
  }, [update.updating, getSurveys, startDate, endDate, checked]);

  const fetch_and_set = async (survey) => {
    setSelectedSurvey(survey);
    const response2 = await fetch('/getSurveyResults/' + survey.id)
    const survey_info2 = await response2.json()
    setFRQ(survey_info2)
  }

  const fetch_and_set_filtered = async (survey) => {
    setSelectedSurvey(survey);
    console.log('startDate', startDate.getTime(), 'endDate', endDate.getTime())
    const response = await fetch('/getSurveyResultsFiltered/' + survey.id + '/' + startDate.getTime() + '/' + endDate.getTime())
    const survey_info = await response.json()
    setFRQ(survey_info)
  }

  const columns = [
    { field: 'result', headerName: 'Results', width: 150 },
  ];

  function createData(id, result) {
    return { id, result };
  }
  function parseJSONFRQ(projects) {
    console.log('projects', projects)
    const rows = []
    for (let j = 0; j < projects['response_list'].length; j++) {
      console.log('projects[response]', projects['response_list'][j]['reply'])
      rows.push(createData(j, projects['response_list'][j]['reply']));
    }
    console.log("rows", rows)
    return rows;
  }

  const handleCheckedChange = (event) => {
    setChecked(event.target.checked);
    if (!event.target.checked){
      setEndDate(null);
      setStartDate(null);
    }
  };

  function createDataMC(text, value) {
    return { text, value };
  }

  function parseJSONMC(projects) {
    console.log('projects', projects)
    const rows = []
    var dict = {};
    for (let j = 0; j < projects['response_list'].length; j++) {
      if (dict[projects['response_list'][j]['reply']] !== undefined) {
        let count = dict[projects['response_list'][j]['reply']] + 1
        dict[projects['response_list'][j]['reply']] = count
      } else {
        dict[projects['response_list'][j]['reply']] = 1
      }

    }
    for (const [key, value] of Object.entries(dict)) {
      rows.push(createDataMC(key, value))
    }

    return rows;
  }


  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  return (
    <Box>
      <Nav />
      <Container>
        <Grid container spacing={6}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Survey</InputLabel>
              <Select
                label="Survey"
                onChange={(e) => fetch_and_set(e.target.value)}
                value={surveys.find(obj => { return obj.id === selectedSurvey.id })}
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
            <FormControlLabel control={<Switch checked={checked} onChange={handleCheckedChange}/>} label="Choose a Date Range" />
            {checked &&
              <div>
              <Typography variant="subtitle1">Select a Start Date: </Typography>
              <DatePicker
                selected={startDate}
                selectsStart
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mmaa"
                startDate={startDate}
                endDate={endDate}
                onChange={date => setStartDate(date)}
              />
              <Typography variant="subtitle1">Select a End Date: </Typography>
              <DatePicker
                selected={endDate}
                selectsEnd
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mmaa"
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                onChange={date => setEndDate(date)}
              />
              </div>}
          </Grid>
          <Grid item xs={8}>
          <Grid container spacing={8}>
            {frq.map((question, index) => {
              return (
                <Grid item xs={12}>
                  <Typography variant="h6">Question {index+1}: {question.prompt}</Typography>
                    {question.type < 1 &&
                        <div style={{ paddingTop: '20px', height: 400, width: '100%', float: 'left' }}>
                        <DataGrid
                          rows={parseJSONFRQ(question)}
                          columns={columns}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                        />
                        </div>}
                    {question.type > 0 &&
                        <BarChart
                          ylabel="Quantity"
                          width={500}
                          height={500}
                          margin={margin}
                          data={parseJSONMC(question)}
                          style={{ color: "blue" }}
                        />}
                </Grid>);})}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={update.updating}
        message={update.message}
      />
    </Box>
  );
}

export default Results;
