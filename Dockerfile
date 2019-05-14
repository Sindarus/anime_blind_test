FROM python:3.7-alpine3.9

COPY requirements-src.txt /requirements.txt
RUN pip install -r /requirements.txt --ignore-installed
RUN rm requirements.txt

COPY app /app
COPY settings.py /settings.py

ENV FLASK_APP /app/index.py
ENV FLASK_ENV development

ENTRYPOINT flask run --host 0.0.0.0