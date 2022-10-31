import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, getByText, render } from '@testing-library/react';
import LoginPage from '../components/loginPage';

test('login page correct submission', () => {
    // render page
    const { getByLabelText, getByText } = render(<LoginPage setUserID={() => {}} />);
    const username = getByLabelText(/Username/i); //searches for substring 'username' ignoring case
    const password = getByLabelText(/Password/i);

    // enter values in username/password field, and submit
    fireEvent.change(username, { target: { value: "jh" } });
    expect(username.value).toBe("jh");
    fireEvent.change(password, { target: { value: "password!!!" } });
    expect(password.value).toBe("password!!!");
    fireEvent.click(getByText(/Submit/i));
});
