set FLASK_APP=src/backend/main.py
call npm run build
call python -m flask run -p 3000