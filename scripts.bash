# to magrate the db

alembic revision --autogenerate -m "migration message"
alembic upgrade head

# start frontend server : npm run dev
# activate the env with :  ./env/Secript/Activate
# uvicorn app.main:app --relaod

# from projcet go to TimeSheetProject using command [ CD foldername ]
#  cd TimeSheetProject , cd frontend , cd time_sheet , npm run dev

# For backend 
# cd TimeSheetProject , env\Scripts\activate , uvicorn app.main:app --reload
