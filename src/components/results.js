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
import {Switch, FormControlLabel, ToggleButton, ToggleButtonGroup} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  PointElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
);

export const options = {
  responsive: true,
};



function Results(props) {
  const { surveys, getSurveys, update, selectedSurvey, setSelectedSurvey } = props;

  const [frq, setFRQ] = React.useState([])
  const [lineData, setLineData] = React.useState(null)

  const gottenSurveys = useRef(false)
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [alignment, setAlignment] = React.useState('left');

  const handleSwitchChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  
  // Retrieves surveys from the database only after creating and deleting operations are completed
  useEffect(() => {
    if (!gottenSurveys.current) {
      if (!update.updating) {
        getSurveys()
        gottenSurveys.current = true
        if (selectedSurvey) {
            fetch_and_set(selectedSurvey)
            fetch_and_set_line(selectedSurvey)
        }
      }
    }
    if (!checked){
      fetch_and_set(selectedSurvey)
      fetch_and_set_line(selectedSurvey)
    }
    if (startDate && endDate){
      fetch_and_set_filtered(selectedSurvey)
      fetch_and_set_line(selectedSurvey)
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
    const response = await fetch('/getSurveyResultsFiltered/' + survey.id + '/' + startDate.getTime() + '/' + endDate.getTime())
    const survey_info = await response.json()
    setFRQ(survey_info)
  }

  const fetch_and_set_line = async (survey) => {
    const response3 = await fetch('/getSurveyResultsHourlyBuckets/' + survey.id)
    const survey_info3 = await response3.json()
    setLineData(survey_info3)
  }

  const columns = [
    { field: 'result', headerName: 'Results', width: 150 },
  ];

  const children = [
    <ToggleButton value="left" key="left">
      <Typography variant="subtitle1">Overall Stats</Typography>
    </ToggleButton>,
    <ToggleButton value="right" key="right">
      <Typography variant="subtitle1">Individual Questions</Typography>
    </ToggleButton>,
  ];
  const control = {
    value: alignment,
    onChange: handleSwitchChange,
    exclusive: true,
  };

  function createData(id, result) {
    return { id, result };
  }
  function parseJSONFRQ(projects) {
    const rows = []
    for (let j = 0; j < projects['response_list'].length; j++) {
      rows.push(createData(j, projects['response_list'][j]['reply']));
    }
    return rows;
  }
  function createLineGraphData(projects) {
    const timeStamps = []
    // const labels = []
    const labels = [];
    for (let j = 0; j < projects["time_range"].length; j++) {
        labels.push(projects["time_range"][j])
        if(projects["time_range"][j] in projects["hours"]){
            timeStamps.push(projects["hours"][projects["time_range"][j]])
        }else{
          timeStamps.push(0)
        }
    }
    const data = {
        labels,
        datasets: [
        {
            label: 'Response Counts',
            data: timeStamps,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        ],
    };
    return data;
  }
  const handleCheckedChange = (event) => {
    setChecked(event.target.checked);
    if (!event.target.checked){
      setEndDate(null);
      setStartDate(null);
    }
  };


  function parseJSONMC(projects) {
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
    const labels = Object.keys(dict)
    const values = []
    for (const [key, value] of Object.entries(dict)) {
      values.push(value)
    }
    const data = {
      labels,
      datasets: [
        {
          data: values,
          label: "Counts",
          backgroundColor: 'rgba(242, 121, 53, 1)',
        },
      ],
    }
    return data;
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
                onChange={(e) => fetch_and_set(e.target.value) && fetch_and_set_line(e.target.value)}
                value={surveys.find(obj => { return obj.id === selectedSurvey.id })}
              >
                {surveys?.map((survey, index) => {
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
          <ToggleButtonGroup size="small" {...control}>
              {children}
            </ToggleButtonGroup>
          <Grid container spacing={8}>
            {alignment == "left" && lineData &&
            <Grid item xs={12}>
              <Typography variant="h6">Number of Responses Over Time</Typography>
              <Line options={options} data={createLineGraphData(lineData)}/>
              </Grid>
            }
            {alignment == "right" && frq.map((question, index) => {
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
                        <Bar options={options} data={parseJSONMC(question)} />
                      }
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
