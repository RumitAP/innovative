# innovative
Innovative Refrigeration Systems Challenge

### Please keep in mind that I chose to use Flask to show my ability to learn a new framework. 

`Running on python 3.10`

# Set up

First, create an empty postgres database and either `export DATABASE URL='postgresql://rumit:password@localhost/innovative'` or adjust the `config.py` file. 

```
$ pip install virtualenv

$ virtualenv venv

$ source venv/bin/activate

$ pip install -r requirements.txt

$ flask db upgrade

$ export FLASK_APP=app

$ python3 run.py
```


# Explanations

* Why did I use Flask?

I wanted to show my ability to pick up new frameworks in a short period of time. I'm not an expert in Flask but this app shows my ability to pick up a new framework and implement it in a functional manner in a couple of days. This was much more different than Django than I originally expected. BUT it was a fun learning experience. 

* Why did I choose to the database relationship schema the way they did?

The instructions from the Washington website said this:

```
A JHA involves doing the following:

1. Select the job/activity to be analyzed.

2. Break the job/activity down into a series of tasks.

3. Identify potential hazards and consequences in each task.

4. Determine preventive measures to overcome these hazards.
```

The first bullet points tells me that the parent model will be the Job Hazard Analysis model. The second bullet point tells me that tasks are children of JHA's 
and they are ordered (hence why it has the field "step"). The third bullet point tells me that each task has hazards and consequences associated with it. However, it made most sense to me to structure my form such that each hazard had a consequence. It made more sense to me that each hazard has a potential consequence -- whether it's a business consequence or personal injury consequence. Each hazard should be able to have more than one consequence. The last bullet point tells us that preventative measures are tied to each hazard and each hazard can have many preventative measures. 

* Why did I choose to add the concept of a `status`?

I wanted to keep extensibility in mind when building out this application. If we wanted to add administrative steps in order to approve a JHA, we could and have each step correspond to a specific status (`Draft`, `Submitted`, `Completed`, `Under Review`).

* Why did I choose to implement pagination?

It improves both readability and performance.


* Why do I have so much stuff exposed in the config?

It's just an example that I put in there so that it can work for everyone.


# Home Page

![alt text](image-1.png)

# Add JHA Page 1

![alt text](image-2.png)

# Add JHA Page 2
![alt text](image.png)


# Eye Icon 

![alt text](image-3.png)


# Trashcan Icon

`Deletes item`

# Pencil Icon on Homescreen

Can update the JHA title and author.

![alt text](image-4.png)

