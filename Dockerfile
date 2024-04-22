# Use an official Python runtime as a parent image
FROM python:3.10-slim

RUN apt-get -q -y update 
RUN apt-get install -y gcc

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in requirements.txt
RUN python3 -m pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app
ENV FLASK_RUN_HOST=0.0.0.0

# Run run.py when the container launches
CMD ["python3", "run.py"]
