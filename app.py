from flask import Flask, render_template
import pymysql

app = Flask(__name__)

table_name = 'table_test'

# MySQL database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'computer',
    'db': 'db_test'
}


@app.route('/')
def index():
    # MySQL connection
    conn = pymysql.connect(**db_config)

    # Query to retrieve all data from the table
    query = f"SELECT * FROM {table_name}"
    cursor = conn.cursor()
    cursor.execute(query)

    # Fetch all data
    data = cursor.fetchall()

    # Get the field names from the cursor description
    fields = [field[0] for field in cursor.description]

    # Pass the length of the fields list as a separate variable
    fields_length = len(fields)

    # Close the MySQL connection
    conn.close()

    # Render the template with the data and field names
    return render_template('index.html', table=table_name, data=data, fields=fields, fields_length=fields_length)


if __name__ == '__main__':
    app.run(debug=True)
