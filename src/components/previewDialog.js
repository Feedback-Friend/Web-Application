import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import React from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

function PreviewDialog(props) {
    const { open, setOpen, questions, name } = props;

    // Closes the preview Dialog
    const handleClose = () => {
        setOpen(false);
    };

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Generates the list of prompts and form fields for FRQ and MC questions
    const prompts = questions.map((question, index) => {
        const primary = index + 1 + ". " + question.prompt;
        return (
            <ListItem key={index} sx={{ display: "inline-block" }}>
                <ListItemText primary={primary} />
                {question.type === 0 ? (
                    <TextField
                        margin="normal"
                        fullWidth
                    />
                ) : (
                    <FormControl>
                        <RadioGroup>
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
                        </RadioGroup>
                    </FormControl>
                )}
            </ListItem>
        );
    });

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{name}</DialogTitle>
                <DialogContent>
                    <List sx={{ mx: "auto" }}>
                        {prompts}
                    </List>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default PreviewDialog;