from app import db

class HazardMixin:
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_hazard_analysis_task_hazard_id = db.Column(db.Integer, db.ForeignKey('job_hazard_analysis_task_hazard.id'), nullable=False, index=True)
    description = db.Column(db.String, default="", nullable=False)
    
    def validate_completion(self):
        return bool(self.description)