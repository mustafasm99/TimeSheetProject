# to magrate the db

alembic revision --autogenerate -m "migration message"
alembic upgrade head