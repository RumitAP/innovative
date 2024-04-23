from app import db
from sqlalchemy.orm import backref
from enum import Enum
import datetime


class StatusEnum(Enum):
    Draft = "Draft"
    Completed = "Completed"

class JobHazardAnalysisPreventativeMeasure( db.Model):
    # Many to one with Hazards
    __tablename__ = 'job_hazard_analysis_task_hazard_preventative_measure'
    hazard = db.relationship('JobHazardAnalysisTaskHazard', back_populates='preventative_measures')
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_hazard_analysis_task_hazard_id = db.Column(db.Integer, db.ForeignKey('job_hazard_analysis_task_hazard.id'), nullable=False, index=True)
    description = db.Column(db.String, default="", nullable=False)
    created_utc = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_utc = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))
    
    def validate_completion(self):
        return bool(self.description)

class JobHazardAnalysisTaskConsequences( db.Model):
    # Many to one with Hazards
    __tablename__ = 'job_hazard_analysis_task_consequence'
    hazard = db.relationship('JobHazardAnalysisTaskHazard', back_populates='consequences')
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_hazard_analysis_task_hazard_id = db.Column(db.Integer, db.ForeignKey('job_hazard_analysis_task_hazard.id'), nullable=False, index=True)
    description = db.Column(db.String, default="", nullable=False)
    created_utc = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_utc = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))
    
    def validate_completion(self):
        return bool(self.description)

class JobHazardAnalysisTaskHazard(db.Model):
    # Many to one with Task
    __tablename__ = 'job_hazard_analysis_task_hazard'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_harazrd_analysis_task_id = db.Column(db.Integer, db.ForeignKey('job_hazard_analysis_task.id'), nullable=False, index=True)
    description = db.Column(db.String, default="" ,nullable=False)
    created_utc = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_utc = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))
    
    task = db.relationship('JobHazardAnalysisTask', back_populates='hazards')
    preventative_measures = db.relationship(
        'JobHazardAnalysisPreventativeMeasure',
        cascade="all, delete, delete-orphan"
    )
    consequences = db.relationship(
        'JobHazardAnalysisTaskConsequences',
        cascade="all, delete, delete-orphan"
    )
    
    def validate_completion(self):
        if (len(self.consequences) >= 1 
            and all(consequence.validate_completion() for consequence in self.consequences) 
            and len(self.preventative_measures) >= 1
            and all(preventative_measure.validate_completion() for preventative_measure in self.preventative_measures)
        ):
            return True
        return False
            

class JobHazardAnalysisTask(db.Model):
    # One to many with JHA
    __tablename__ = 'job_hazard_analysis_task'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_hazard_analysis_id = db.Column(db.Integer, db.ForeignKey('job_hazard_analysis.id'), nullable=False, index=True)
    task_description = db.Column(db.String, nullable=False)
    step = db.Column(db.Integer, default=1, nullable=True)
    created_utc = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_utc = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))
    
    job_hazard_analysis = db.relationship(
        'JobHazardAnalysis',
        back_populates='tasks'
    )
    hazards = db.relationship(
        'JobHazardAnalysisTaskHazard',
        cascade="all, delete, delete-orphan",
        back_populates='task'
    )
            
    def validate_completion(self):
        if len(self.hazards) >= 1 and all(hazard.validate_completion() for hazard in self.hazards):
            return True
        return False


class JobHazardAnalysis(db.Model):
    __tablename__ = 'job_hazard_analysis'
    
    def validate_completion(self):
        if len(self.tasks) >= 1 and all(task.validate_completion() for task in self.tasks):
            self.status = StatusEnum.Completed
        else:
            self.status = StatusEnum.Draft
        db.session.add(self)
        db.session.commit()

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(128), nullable=False, unique=True)
    author = db.Column(db.String(50), nullable=False)
    status = db.Column(db.Enum(StatusEnum), default=StatusEnum.Draft, nullable=False)
    created_utc = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_utc = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))
    
    tasks = db.relationship(
        'JobHazardAnalysisTask',
        cascade="all, delete, delete-orphan",
        back_populates='job_hazard_analysis',
        order_by='JobHazardAnalysisTask.step'
    )