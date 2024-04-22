from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import DATABASE_TRACK_MODIFICATIONS, DATABASE_URL, DEFAULT_CORS

app = Flask(__name__)
CORS(app, origins=DEFAULT_CORS)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = DATABASE_TRACK_MODIFICATIONS

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import routes, models
