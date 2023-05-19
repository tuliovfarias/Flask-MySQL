import json
from flask import Flask, redirect, render_template
import pymysql
import os


app = Flask(__name__)
database = 'db_test'
db_creds_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),'database','db_creds.json')
with open(db_creds_path, 'r') as json_file:
        db_creds = json.load(json_file)


@app.route('/favicon.ico')
def fav():
    return redirect("static/database.ico")

@app.route('/')
def home():
    with pymysql.connect(**db_creds, db='db_test') as conn:
        query = f"SHOW TABLES"
        cursor = conn.cursor()
        cursor.execute(query)
        tables = [item[0] for item in cursor.fetchall()]
    return render_template('home.html', tables=tables)

@app.route('/<table_name>')
def index(table_name):
    with pymysql.connect(**db_creds, db='db_test') as conn:
        query = f"SELECT * FROM {table_name}"
        cursor = conn.cursor()
        cursor.execute(query)
        data = cursor.fetchall()
        data = [[col if col is not None else "-" for col in row] for row in data]
        fields = [field[0] for field in cursor.description]
        fields_length = len(fields)

    return render_template('table.html', table=table_name, data=data, fields=fields, fields_length=fields_length)


if __name__ == '__main__':
    app.run(debug=True)
