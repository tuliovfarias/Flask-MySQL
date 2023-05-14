from flask import Flask, render_template
import pymysql

app = Flask(__name__)

table_name = 'table_test'

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'computer',
    'db': 'db_test'
}


@app.route('/')
def index():
    conn = pymysql.connect(**db_config)
    query = f"SELECT * FROM {table_name}"
    cursor = conn.cursor()
    cursor.execute(query)
    data = cursor.fetchall()
    fields = [field[0] for field in cursor.description]
    fields_length = len(fields)
    conn.close()

    return render_template('index.html', table=table_name, data=data, fields=fields, fields_length=fields_length)


if __name__ == '__main__':
    app.run(debug=True)
