import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import Nav from './nav'

function CreateFromExisting(props) {
    const { surveys, getSurveys, setSurvey, update, setFromExisting } = props;

    // The index of the selected list item
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // When a list item is selected, set its index and the id of the selected survey
    const handleListItemClick = (survey, index) => {
        setSelectedIndex(index);
        const name = "Copy of " + (survey.name || "Untitled Survey");
        setSurvey({ id: survey.id, name: name });
    }

    // Determines whether the latest surveys have been retrieved from the database
    const gottenSurveys = useRef(false);

    // Retrieves surveys from the database only after creating and deleting operations are completed
    useEffect(() => {
        if (!gottenSurveys.current) {
            setSurvey({ id: -1 });
            if (!update.updating) {
                getSurveys();
                gottenSurveys.current = true;
            }
        }
    }, [update.updating, setSurvey, getSurveys]);

    return (
        <Box>
            <Nav />
            <Container sx={{ width: 1 / 2, textAlign: "center", my: 2 }}>
                <Typography variant="h3">Choose a Survey</Typography>
                <List>
                    {surveys.map((survey, index) => {
                        return (
                            <Box>
                                <ListItemButton
                                    key={survey.id}
                                    selected={selectedIndex === index}
                                    onClick={() => handleListItemClick(survey, index)}
                                >
                                    <ListItemText primary={survey.name || "Untitled Survey"} />
                                    <ListItemText primary={new Date(survey.time).toLocaleString()} sx={{ textAlign: "right" }} />
                                </ListItemButton>
                                <Divider />
                            </Box>
                        );
                    })}
                </List>
                <Button variant="contained" component={Link} to="../create" onClick={() => setFromExisting(true)} disabled={selectedIndex === -1}>Create</Button>
            </Container>
            <Snackbar
                open={update.updating}
                message={update.message}
            />
        </Box>
    );
}

export default CreateFromExisting;