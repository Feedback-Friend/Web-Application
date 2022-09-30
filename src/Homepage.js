import './App.css';
import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import CreateSurvey from './components/createSurvey';
import CreateFromExisting from './components/createFromExisting';
import TakeSurvey from './components/takeSurvey';
import EndPage from './components/endPage';
import Results from './components/results';
import RowAndColumnSpacing from './components/profilePage';
function Homepage(props) {
  const { userID } = props;

  //Contains a list of survey names and ids
  const [surveys, setSurveys] = useState([]);

  // If creating a survey from existing, contains the name and id of the template survey. Otherwise, contains -1.
  const [survey, setSurvey] = useState({ name: "", id: -1 });

  /* 
  When surveys are in the process of being created or deleted, this state prevents retrieving surveys from the database until all operations
  are completed. It also contains a message corresponding to the current operation to be displayed to the user.
  */
  const [update, setUpdate] = useState({ creating: false, deleting: false, message: '' });

  // Gets the names, ids, and response counts for every survey the user has created, and sets the survey state
  const getSurveys = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const res = await fetch('/getSurveys/' + userID, requestOptions)
      .then(response => { return response.json() });
    setSurveys(res);
  };

  return (
    <HashRouter>
      {/* React Router routes to pages by loading different elements depending on the path */}
      <Routes>
        {/* Home page */}
        <Route
          exact
          path="/"
          element={
            <Home surveys={surveys} getSurveys={getSurveys} setSurvey={setSurvey} update={update} setUpdate={setUpdate} />
          }
        />
        {/* CreateSurvey page */}
        <Route
          path="/create"
          element={
            <CreateSurvey survey={survey} userID={userID} update={update} setUpdate={setUpdate} />
          }
        />
        {/* CreateFromExisting page */}
        <Route
          path="/createFromExisting"
          element={
            <CreateFromExisting surveys={surveys} getSurveys={getSurveys} setSurvey={setSurvey} update={update} />
          }
        />
        {/* TakeSurvey page */}
        <Route
          path="/survey/:id"
          element={
            <TakeSurvey />
          }
        />
        {/* End page */}
        <Route
          path="endPage"
          element={
            <EndPage />
          }
        />
        {/* Results page */}
        <Route
          path="/results"
          element={
            <Results surveys={surveys} />
          }
        />
        {/* Profile Page*/}
        <Route
          path="myProfile"
          element={
            <RowAndColumnSpacing userID={userID} />
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default Homepage;
