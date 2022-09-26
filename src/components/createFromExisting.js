import React, { useState, useEffect } from 'react';
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
    const { surveys, getSurveys, setSurveyID, update } = props;

    // The index of the selected list item
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // When a list item is selected, set its index and the id of the selected survey
    const handleListItemClick = (e, survey, index) => {
        setSelectedIndex(index);
        setSurveyID(survey.id);
    }

    // Retrieves surveys from the database only after creating and deleting operations are completed
    useEffect(() => {
        setSurveyID(-1);
        if (!update.creating && !update.deleting) {
            getSurveys();
        }
    }, [update]);

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
                                    onClick={(e) => handleListItemClick(e, survey, index)}
                                >
                                    <ListItemText primary={survey.name} />
                                    <ListItemText primary="9/18/2022" sx={{ textAlign: "right" }} />
                                </ListItemButton>
                                <Divider />
                            </Box>
                        );
                    })}
                </List>
                <Button variant="contained" component={Link} to="../create" disabled={selectedIndex === -1}>Create</Button>
            </Container>
            <Snackbar
                open={update.creating || update.deleting}
                message={update.message}
            />
        </Box>
    );
}

export default CreateFromExisting;