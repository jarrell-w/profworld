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
#   number_of_problems  - self explanatory
#   category_tag        - str with category tags
#   region_tag          - str with region tags
#   treatment_tag       - str with treatment tags

# Generates a JSON with all the problem information
# based on the number of questions and tags provided
query =  (
    "SELECT JSON_ARRAYAGG(JSON_OBJECT( "
    "'problem_id', problem_id "
    #", "
    #"'question', question, "
    #"'answer', answer, "
    #"'incorrect1', incorrect1, "
    #"'incorrect2', incorrect2, "
    #"'incorrect3', incorrect3, "
    #"'incorrect4', incorrect4, "
    #"'explanation', explanation, "
    #"'category_tag', category_tag, "
    #"'region_tag', region_tag, "
    #"'treatment_tag', treatment_tag "
    ") ) "
    "FROM ( "
    "SELECT * FROM problem "
)

if(params["category_tag"] or
    params["region_tag"] or
    params["treatment_tag"]):
    query += "WHERE "
    if(params["category_tag"]):
        category_list = params["category_tag"].split()
        query += "( "
        for category in range(len(category_list)):
            query += "category_tag REGEXP '" 
            query += category_list[category]
            query += "' "
            if(category != len(category_list) - 1):
                query += " || "
        query += " ) "
        if (params["region_tag"] or params["treatment_tag"]):
            query += " && "
    if(params["region_tag"]):
        region_list = params["region_tag"].split()
        query += "( "
        for region in range(len(region_list)):
            query += "region_tag REGEXP '"
            query += region_list[region]
            query += "' "
            if(region != len(region_list) - 1):
                query += " || "
        query += " ) "
        if (params["treatment_tag"]):
            query += " && "
    if(params["treatment_tag"]):
        treatment_list = params["treatment_tag"].split()
        query += "( "
        for treatment in range(len(treatment_list)):
            query += "treatment_tag REGEXP '"
            query += treatment_list[treatment]
            query += "' "
            if(treatment != len(treatment_list) - 1):
                query += " || "
        query += " ) "

query += "ORDER BY RAND() LIMIT "
query += str(params["problem_count"])
query += " ) q"

# Connect the cursor and execute the query
cursor = db_connection.cursor()
cursor.execute(query)
record = cursor.fetchall()

print( record )

cursor.close()
db_connection.close()
