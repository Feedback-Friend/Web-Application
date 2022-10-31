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
import Contacts from './components/contactsPage';

function Homepage(props) {
  const { userID } = props;

  //Contains a list of created surveys. Each survey has an id, name, time created, and # of responses.
  const [surveys, setSurveys] = useState([]);

  //Contains a list of contact lists and their respective contacts. 
  const [contactList, setContactList] = useState([]);

  /* 
  When surveys are in the process of being created or deleted, this state prevents retrieving surveys from the database until all operations
  are completed. It also contains a message corresponding to the current operation to be displayed to the user.
  */
  const [update, setUpdate] = useState({ updating: false, message: '' });

  // Contains the timer for hiding the update message
  const timerRef = useRef(null);

  // Contains the name of the current fetch being attempted and a surveyID/questionID/choiceID, if applicable
  const idRef = useRef(null);

  // Shows the update message
  const showMessage = useCallback((message) => {
    setUpdate({ updating: true, message: message });
  }, []);

  // Hides the update message after one second
  const hideMessage = useCallback((message, func, id) => {
    // Put off autosaving until later in cases where the same operation is being attempted (e.g. updating an FRQ with id=0)
    if (timerRef.current && idRef.current === id) {
      clearTimeout(timerRef.current);
    }

    idRef.current = id;
    timerRef.current = setTimeout(async () => {
      await func().then(response => { setUpdate({ updating: false, message: message }) });
    }, 1000);
    return () => clearTimeout(timerRef.current);
  }, []);

  // Determines if a survey should be created from an existing one
  const [fromExisting, setFromExisting] = useState(false);

  // Gets the names, ids, time created, and response counts for every survey the user has created, and sets the survey state
  const getSurveys = useCallback(() => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    showMessage("Getting surveys...");

    const func = async () => {
      let res = await fetch('/getSurveys/' + userID, requestOptions)
        .then(response => { return response.json() });
      setSurveys(res);
    };

    hideMessage("Done", func, "getSurveys");
  }, [userID, showMessage, hideMessage]);

  // Gets the names, ids, time created, and response counts for every survey the user has created, and sets the survey state
  const getContactLists = useCallback(() => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const func = async () => {
      let res = await fetch('/getContactInfo/' + userID, requestOptions)
        .then(response => {
          let jsonResponse = response.json();
          console.log(jsonResponse); 
          return jsonResponse; 
        });
      setContactList(res);
    };

    func();

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
              update={update}
              setFromExisting={setFromExisting}
              getContactLists={getContactLists}
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
            <Results surveys={surveys} getSurveys={getSurveys} update={update} />
          }
        />
        {/* Profile Page*/}
        <Route
          path="myProfile"
          element={
            <RowAndColumnSpacing userID={userID} />
          }
        />
        {/* Contacts Page */}
        <Route
          path="contacts"
          element={
            <Contacts 
              userID={userID}
              contactList={contactList}
              setContactList={setContactList}
              getContactLists={getContactLists}
            />
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default Homepage;
