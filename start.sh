#!/bin/bash
# running npm run build to update frontend
npm run build
# specifying the flask main file so flask can find it
export FLASK_APP=src/backend/main.py
# running flask run to start backend with updated frontend code
python3 -m flask run -p 3000