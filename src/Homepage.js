import './App.css';
import React, { useState, useRef, useCallback } from 'react';
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

  //Contains a list of created surveys. Each survey has an id, name, time created, and # of responses.
  const [surveys, setSurveys] = useState([]);

  // If creating a survey from existing or editing a draft, contains the name and id of that survey. Otherwise, contains an empty string and -1.
  const [survey, setSurvey] = useState({ name: "", id: -1 });

  /* 
  When surveys are in the process of being created or deleted, this state prevents retrieving surveys from the database until all operations
  are completed. It also contains a message corresponding to the current operation to be displayed to the user.
  */
  const [update, setUpdate] = useState({ updating: false, message: '' });

  // Contains the timer for hiding the update message
  const timerRef = useRef(null);

  // Shows the update message
  const showMessage = useCallback((message) => {
    setUpdate({ updating: true, message: message });
  }, []);

  // Hides the update message after one second
  const hideMessage = useCallback((message) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setUpdate({ updating: false, message: message });
    }, 1000);
    return () => clearTimeout(timerRef.current);
  }, []);

  // Determines if a survey should be created from an existing one
  const [fromExisting, setFromExisting] = useState(false);

  // Gets the names, ids, time created, and response counts for every survey the user has created, and sets the survey state
  const getSurveys = useCallback(async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const res = await fetch('/getSurveys/' + userID, requestOptions)
      .then(response => { return response.json() });
    setSurveys(res);
  }, [userID]);

  return (
    <HashRouter>
      {/* React Router routes to pages by loading different elements depending on the path */}
      <Routes>
        {/* Home page */}
        <Route
          exact
          path="/"
          element={
            <Home
              surveys={surveys}
              getSurveys={getSurveys}
              setSurvey={setSurvey}
              update={update}
              showMessage={showMessage}
              hideMessage={hideMessage}
              setFromExisting={setFromExisting}
            />
          }
        />
        {/* CreateSurvey page */}
        <Route
          path="/create"
          element={
            <CreateSurvey
              surveyTemplate={survey}
              userID={userID}
              update={update}
              showMessage={showMessage}
              hideMessage={hideMessage}
              fromExisting={fromExisting}
              setFromExisting={setFromExisting}
            />
          }
        />
        {/* CreateFromExisting page */}
        <Route
          path="/createFromExisting"
          element={
            <CreateFromExisting
              surveys={surveys}
              getSurveys={getSurveys}
              setSurvey={setSurvey}
              update={update}
              setFromExisting={setFromExisting}
            />
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
