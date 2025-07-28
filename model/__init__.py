# app/__init__.py

from flask_cors import CORS
import os
from flask import Flask
from flask_pymongo import PyMongo
from dotenv import load_dotenv

load_dotenv()  # load from .env file

app = Flask(__name__)
CORS(app)  

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

mongodb_client = PyMongo(app)
db = mongodb_client.db

import routes  # this line attaches routes directly
