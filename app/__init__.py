from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import DATABASE_TRACK_MODIFICATIONS, DATABASE_URL

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = DATABASE_TRACK_MODIFICATIONS

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import routes, models
