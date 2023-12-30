from flask import Flask, request, render_template, jsonify, session
import mysql.connector
from mysql.connector import IntegrityError
from werkzeug.security import generate_password_hash
import requests
import logging
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'OMM' 
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/delete_question', methods=['DELETE'])
def delete_question():
  data = request.get_json()
  problemID = data['problem_id']
  success={"Response" : "Question Deleted Successfully"}
  
  cnx = mysql.connector.connect(user='root', password='toor',
                                  host='localhost',
                                  database='question_bank')
  cursor = cnx.cursor()
  query = "DELETE FROM question_bank.problem WHERE problem_id = '%s';" % problemID
  cursor.execute(query)
  cnx.commit()
  cnx.close()
  return success
  
  
@app.route('/get_data', methods=['GET', 'POST'])
def get_questions():
    cnx = mysql.connector.connect(user='root', password='toor',
                                  host='localhost',
                                  database='question_bank')
    cursor = cnx.cursor()

    query = "SELECT problem_id, question, answer, incorrect1, incorrect2, incorrect3, incorrect4 FROM question_bank.problem"
    cursor.execute(query)

    result = cursor.fetchall()
    # Convert the result to a list of dictionaries for JSON serialization
    data = []
    for row in result:
     
      data.append({'problem_id': row[0], 'question': row[1], 'answer': row[2], 'incorrect1': row[3], 'incorrect2': row[4], 'incorrect3': row[5], 'incorrect4': row[6]})

    cnx.close()

    # Return the data as JSON
    return jsonify(data)

@app.route('/add_questions', methods=['POST'])
def add_questions():
  data = request.get_json()
  correct = data['correctAnswer']
  questionInfo = data['questionInfo']
  success={"Database Response" : "question added successfully"}
  
  cnx = mysql.connector.connect(user='root', password='toor',
                                  host='localhost',
                                  database='question_bank')
  cursor = cnx.cursor()
  
  query = "INSERT INTO question_bank.problem (question, answer, incorrect1,   incorrect2, incorrect3, incorrect4, explanation, category_tag, region_tag, treatment_tag, image) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
  data_tuple = (questionInfo, correct, data['incorrectAnswer1'], data['incorrectAnswer2'], data['incorrectAnswer3'], data['incorrectAnswer4'],  data['explanation'], data['categoryTag'], data['regionTag'], data['treatmentTag'],   data['image'])

  cursor.execute(query, data_tuple)
  cnx.commit()
  cursor.close()
  cnx.close()
  return success
  
@app.route('/get_question_by_id', methods=['POST'])
def get_question_by_id():
    data = request.get_json()
    problem_id = data['problem_id']

    cnx = mysql.connector.connect(user='root', password='toor',
                                  host='localhost',
                                  database='question_bank')
    cursor = cnx.cursor()

    query = "SELECT problem_id, question, answer, incorrect1, incorrect2, incorrect3, incorrect4, explanation, category_tag, region_tag, treatment_tag, image FROM question_bank.problem WHERE problem_id = %s"
    cursor.execute(query, (problem_id,))

    result = cursor.fetchall()

    cnx.close()

    # Convert the result to a list of dictionaries for JSON serialization
    data = []
    for row in result:
        data.append({
            'problem_id': row[0],
            'question': row[1],
            'answer': row[2],
            'incorrect1': row[3],
            'incorrect2': row[4],
            'incorrect3': row[5],
            'incorrect4': row[6],
            'explanation': row[7],
            'category_tag': row[8],
            'region_tag': row[9],
            'treatment_tag': row[10],
            'image': row[11]
        })

    # Return the data as JSON
    return jsonify(data)

@app.route('/edit_question', methods=['POST'])
def edit_question():
    data = request.get_json()
    problem_id = data['problem_id']
    question_info = data['questionInfo']

    success = {"Database Response": "Question edited successfully"}

    cnx = mysql.connector.connect(user='root', password='toor',
                                  host='localhost',
                                  database='question_bank')
    cursor = cnx.cursor()

    query = """
        UPDATE question_bank.problem
        SET
            question = %s,
            answer = %s,
            incorrect1 = %s,
            incorrect2 = %s,
            incorrect3 = %s,
            incorrect4 = %s,
            explanation = %s,
            category_tag = %s,
            region_tag = %s,
            treatment_tag = %s,
            image = %s
        WHERE problem_id = %s
    """

    data_tuple = (
        question_info['question'],
        question_info['correctAnswer'],
        question_info['incorrectAnswer1'],
        question_info['incorrectAnswer2'],
        question_info['incorrectAnswer3'],
        question_info['incorrectAnswer4'],
        question_info['explanation'],
        question_info['categoryTag'],
        question_info['regionTag'],
        question_info['treatmentTag'],
        question_info['image'],
        problem_id
    )

    cursor.execute(query, data_tuple)
    cnx.commit()
    cursor.close()
    cnx.close()

    return success
      
@app.route('/create_test', methods=['POST'])
def create_test():
    data = request.get_json()
    questions = []
    cnx = mysql.connector.connect(user='root', password='toor',
                                  host='localhost',
                                  database='question_bank')
    cursor = cnx.cursor()
    query = "SELECT problem_id, question, answer, incorrect1, incorrect2, incorrect3, incorrect4, explanation, image FROM question_bank.problem WHERE "
    
    for category in data["selected_categories"]:
      query += "category_tag = " + "'"+category+"'" + " OR "
      
    for region in data["selected_body_regions"]:
      query += "region_tag = " + "'"+region+"'" + " OR "
      
    for index, treatment in enumerate(data["selected_treatment_techniques"]):
      if index < len(data["selected_treatment_techniques"]) - 1:
        query += "treatment_tag = " + "'"+treatment+"'" + " OR "
      else:
        query += "treatment_tag = " + "'"+treatment+"' LIMIT " + str(data['problem_count']) + ";"
        
    cursor.execute(query)

    result = cursor.fetchall()
    
    for row in result:
      questions.append({'problem_id': row[0], 'question': row[1], 'answer': row[2], 'incorrect1': row[3], 'incorrect2': row[4], 'incorrect3': row[5], 'incorrect4': row[6], 'explanation':row[7], 'image':row[8]})

    cnx.close()

    # Return the data as JSON
    return jsonify(questions)
    

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')  # Assuming 'password' is the plaintext password
    success = {"Database Response": "User registered successfully"}

    cnx = mysql.connector.connect(user='root', password='toor',
                                  host='localhost',
                                  database='question_bank')
    cursor = cnx.cursor()
    query_max_id = "SELECT MAX(user_id) FROM question_bank.user"
    cursor.execute(query_max_id)
    max_id = cursor.fetchone()[0]

    # Check if max_id is None (i.e., no existing users in the table)
    # If None, set max_id to 0
    max_id = max_id if max_id is not None else 0

    # Increment max_id by 1 for the new user
    new_user_id = max_id + 1

    try:
        # Insert the new user with plaintext password (not recommended)
        query = "INSERT INTO question_bank.user (user_id, email, password, isAdmin, tests_taken, time_spent, average_score) VALUES (%s, %s, %s, 0, 0, '', 0)"
        data_tuple = (new_user_id, email, password)

        cursor.execute(query, data_tuple)
        cnx.commit()

    except IntegrityError as e:
        # Handle duplicate email registration
        print(f"IntegrityError: {e}")
        return jsonify({"Database Response": "User with this email already exists"}), 409

    except Exception as e:
        # Log the exception details to a file for further investigation
        logging.exception("An exception occurred during user registration")
        return jsonify({"Database Response": "Internal Server Error"}), 500  # HTTP 500 Internal Server Error

    finally:
        cursor.close()
        cnx.close()

    return success
    
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('username')  # Use 'username' as the key for email in the login form
    password = data.get('password')

    cnx = mysql.connector.connect(user='root', password='toor',
                                  host='localhost',
                                  database='question_bank')
    cursor = cnx.cursor()

    try:
        # Retrieve user information based on email
        query = "SELECT user_id, email, password, isAdmin FROM question_bank.user WHERE email = %s"
        cursor.execute(query, (email,))
        user_data = cursor.fetchone()

        if user_data and user_data[2] == password:
            # Successful login
            # Store user data in the session
            session['user_id'] = user_data[0]
            session['isAdmin'] = user_data[3]
            print("User ID and isAdmin stored in session:", session.get('user_id'), session.get('isAdmin'))
            return jsonify({"Database Response": "Login successful", "user_id": user_data[0]})
        else:
            # Invalid login credentials
            session.clear()  # Clear the session on login failure
            return jsonify({"Database Response": "Invalid login credentials"}), 401  # HTTP 401 Unauthorized

    except Exception as e:
        # Log the exception details to a file for further investigation
        logging.exception("An exception occurred during user login")
        return jsonify({"Database Response": "Internal Server Error"}), 500  # HTTP 500 Internal Server Error

    finally:
        cursor.close()
        cnx.close()
        
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"Database Response": "Logout successful"})

  
    
if __name__ == '__main__':
    logging.basicConfig(filename='app.log', level=logging.ERROR)
    app.run(host='0.0.0.0', port=443, debug=True)