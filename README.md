# Feedback Friend

Note: HIGHLY recommended to use WSL/MacOS/Linux for running these commands and accessing OCI resources.

## Commands

    npm install

npm install is used to install all packages needed to run React. This command is necessary to run when first cloning the repo.

    ./start.sh

    OR

    # running npm run build to update frontend
    npm run build
    # specifying the flask main file so flask can find it. Does NOT work in powershell
    export FLASK_APP=src/backend/main.py
    # running flask run to start backend with updated frontend code
    python3 -m flask run -p 3000




The start bash script runs the command to build the React code into static files and start the backend server.

