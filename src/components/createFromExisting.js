import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Nav from './nav'

function CreateFromExisting(props) {
    const { surveys, setName, setQuestions } = props;

    // The index of the selected list item
    const [selectedIndex, setSelectedIndex] = useState(0);

    // When a list item is selected, set its index and the name/questions of the selected survey
    const handleListItemClick = (e, survey, index) => {
        setSelectedIndex(index);
        setName(survey.name);
        setQuestions(survey.questions);
    }

    return (
        <Box>
            <Nav />
            <Container sx={{ width: 1 / 2, textAlign: "center", my: 2 }}>
                <Typography variant="h3">Choose a Survey</Typography>
                <List>
                    {surveys.map((survey, index) => {
                        return (
                            <ListItemButton
                                key={index}
                                selected={selectedIndex === index}
                                onClick={(e) => handleListItemClick(e, survey, index)}
                            >
                                <ListItemText primary={survey.name} />
                                <ListItemText primary="9/18/2022" sx={{ textAlign: "right" }} />
                            </ListItemButton>
                        );
                    })}
                </List>
                <Button variant="contained" component={Link} to="../create">Create</Button>
            </Container>
        </Box>
    );
}

export default CreateFromExisting;