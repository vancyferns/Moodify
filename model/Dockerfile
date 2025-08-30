# Use a lightweight official Python image as the base
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file first to leverage Docker's build cache
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
# This includes app.py, the dnn folder, and other directories
COPY . .

# Expose the port where the Flask API will run
# This should match the app_port defined in your README.md
EXPOSE 7860

# Define the command to run the application using Gunicorn
# 'app:app' means the Flask instance named 'app' is in the 'app.py' file.
# The --bind 0.0.0.0:7860 makes Gunicorn listen on all available network interfaces on port 7860.
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "app:app"]