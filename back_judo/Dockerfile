FROM python:3.7-alpine

RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev
RUN pip install flask psycopg2-binary coloredlogs flask-cors

WORKDIR /opt/workspace

CMD python app.py