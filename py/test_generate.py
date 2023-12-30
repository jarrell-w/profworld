import mysql.connector
import sys
import json

# Connect to the database
db_connection = mysql.connector.connect(
    host="localhost", 
    user="root", 
    password="toor", 
    database="question_bank"
)

# JSON File gets passed as a parameter:
params = json.loads(sys.argv[1]) 
# Keys in the JSON:
#   - user_id 		- id of the user who generated the test
#   - problem_count	- number of problems to include
#   - category_tag	- str og category tags
#   - region_tag	- str of region tags
#   - treatment_tag	- str of treatment tags
#   - question_mode	- Types of questions to include (not implemented)

query =  "INSERT INTO test (test_id, user_id, problem_count, "
query += "	category_tag, region_tag, treatment_tag )"
query += "SELECT MAX(test_id) + 1, "
query += params['user_id']
query += ", "
query += params['problem_count']
query += ", "
query += params['category_tag']
query += ", "
query += params['region_tag']
query += ", "
query += params['treatment_tag']
query += " FROM test; "

# Connect the cursor and execute the query
cursor = db_connection.cursor()
cursor.execute(query)
record = cursor.fetchall()

cursor.close()
db_connection.close()
