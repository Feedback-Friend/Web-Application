# Feedback Friend

InstNote: HIGHLY recommended to use WSL/MacOS/Linux for running these commands and accessing OCI resources.

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

## Connecting to OCI Compute Instance

NOTE: this is currently accessing bennett-test1

(1) Get the ssh key from the #authentication channel in Discord.

(2) Connect via SSH using the following command:

    ssh -i ssh-key-2022-09-13.key opc@150.136.92.200

This should give you access to the database. If the SSH key throws an error about permissions, run this command:

    chmod 600 ssh-key-2022-09-13.key

(3) To connect to MySQL using the same user that accesses it in the web application, run the following command:

    mysql -u test -p

    password is in #authentication discord channel

(4) You should now be connected to the MySQL database in the compute instance.



