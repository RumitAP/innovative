import os

DATABASE_URL=os.getenv("DATABASE_URL", default='postgresql://rumit:password@localhost/innovative')
DATABASE_TRACK_MODIFICATIONS=os.getenv("DATABASE_TRACK_MODIFICATIONS", default=False)
DEFAULT_PER_PAGE=os.getenv("DEFAULT_PER_PAGE", default=10)
DEFAULT_CORS=os.getenv("DEFAULT_CORS",default=["http://localhost", "http://localhost:5000"])
SECRET_KEY=os.getenv("SECRET_KEY", "your_random_secret_key_here")