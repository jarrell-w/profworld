import mysql.connector
import sys
import subprocess
import json
from importlib import reload

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
#   - test_id   -   key of the test

query = (
	"SELECT JSON_OBJECT( "
        "'test_id', q.test_id, "
        "'user_id', q.user_id, "
        "'question_list', q.question_list, "
        "'time_taken', q.time_taken, "
        "'submitted', q.submitted "
	") FROM ( "
	" SELECT t.test_id, "
	"	FIRST_VALUE(t.user_id) OVER() AS 'user_id', "
        "	FIRST_VALUE(t.time_taken) OVER() AS 'time_taken', "
        "	FIRST_VALUE(t.submitted) OVER() AS 'submitted', "
        "	JSON_ARRAYAGG(JSON_OBJECT( "
        "		'problem_id', p.problem_id, "
	"		'question', p.question, "
	"		'answer', p.answer, "
	"		'incorrect1', p.incorrect1, "
        "		'incorrect2',p.incorrect2, "
	"		'incorrect3',p.incorrect3, "
	"		'incorrect4',p.incorrect4, "
	"		'explanation', p.explanation, "
	"		'category_tag', p.category_tag, "
	"		'region_tag', p.region_tag, "
	"		'treatment_tag', p.treatment_tag "
	"		)  "
	"        ) AS 'question_list' "
        "FROM test t "
        "JOIN question_list ql USING (test_id) "
        "JOIN problem p USING (problem_id) "
        "WHERE t.test_id = "
)

query += str(params['test_id'])
query += " GROUP BY t.test_id "
query += " ) q ;"

# Connect the cursor and execute the query
cursor = db_connection.cursor()
cursor.execute(query)
record = cursor.fetchone()

cmd = "ls ~/html/json | grep 'test' | awk '{sub(/test/,\"\")sub(/.json/,\"\")}1'"
cmd += " | tail -n 1"

output = subprocess.check_output(cmd, shell=True)
output = int(output.decode("utf-8")) + 1

file_name = "~/html/json/test" +  str(output) + ".json"
cmd = "touch "
cmd += file_name

subprocess.run(cmd, shell=True)

with open(file_name, "w") as output_file:
	output_file.write(record[0])

cursor.close()
db_connection.close()
