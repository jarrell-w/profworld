# PROFWORLD is a Full-Stack question bank study tool for students of Rowan's School 
# of Osteopathic Medicine

This web application was originally a group project for my Software Engineering course at Rowan University

**Link to project:** https://107.22.94.12/


## How We Made It:

**Tech used:** HTML, CSS (bootstrap and pure mix), JavaScript, Python/Flask, AWS, mySQL

We used a linux EC2 in aws in order to host the project and within AWS oppened various ports in order to utilizes services such as GUNICORN in python for the flask server persistence even when we exited the virtual machine and to host the remote mySQL database to hold users and question data. We used apache in order to have our website be hosted at the ip address of our instance. 

## Possible Optimizations

Decemeber 30, 2023
We never got a chance to add in cookie management so in the future, that is something I would like to add. And also attach each test to a user and save user stats as we originally intended but didn't have enough time to do.


## Lessons Learned:

Using flask, mySQL, AWS, bootstrap, and apache were all new to me. But I'm glad to have at least some experience with them now, it was a fun challenge!