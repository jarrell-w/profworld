from flask import Flask, request, render_template, jsonify, session, redirect, url_for
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.secret_key = 'OMM_key'  # Change this to a random secret key


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Extract email, password, and isAdmin from the JSON data
    email = data.get('email')
    password = data.get('password')
    is_admin = int(data.get('isAdmin', 0))  # Ensure 'isAdmin' is present in the JSON data
    
    # Hash the password
    hashed_password = generate_password_hash(password, method='sha256')
    cnx = mysql.connector.connect(user='root', password='toor',
                                  host='localhost',
                                  database='question_bank')
    cursor = cnx.cursor()
    try:
        # Insert the user information into the 'users' table
        cursor.execute("INSERT INTO user (email, password, isAdmin) VALUES (%s, %s, %s)",
                       (email, hashed_password, is_admin))
        cnx.commit()
        return jsonify({'success': True, 'message': 'Registration successful!'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': f'Registration failed: {err}'})

        
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    cnx = mysql.connector.connect(user='root', password='toor',
                                  host='localhost',
                                  database='question_bank')
    cursor = cnx.cursor()
    email = data.get('email')
    password = data.get('password')
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and check_password_hash(user[2], password):
        session['user_id'] = user[0]
        session['isAdmin'] = user[3]
        return jsonify({'success': True, 'message': 'Login successful!'})
    else:
        return jsonify({'success': False, 'message': 'Incorrect email or password.'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=443, debug=True)
