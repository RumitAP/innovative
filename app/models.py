from app import db

class JobHazardAnalysisPreventativeMeasure(db.Model):
    # One to one with Hazard
    __tablename__ = 'job_hazard_analysis_task_hazard_preventative_measure'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_harazrd_analysis_task_hazard_id = db.Column(db.Integer, db.ForeignKey('job_hazard_analysis_task_hazard.id'), nullable=False, index=True)
    description = db.Column(db.String, nullable=False)
    
    hazard = db.relationship('JobHazardAnalysisTaskHazard', back_populates='preventative_measure', uselist=False)

class JobHazardAnalysisTaskConsequences(db.Model):
    # One to many with Hazard
    __tablename__ = 'job_hazard_analysis_task_consequence'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_harazrd_analysis_task_hazard_id = db.Column(db.Integer, db.ForeignKey('job_hazard_analysis_task_hazard.id'), nullable=False, index=True)
    description = db.Column(db.String, nullable=False)
    
    hazard = db.relationship('JobHazardAnalysisTaskHazard', back_populates='consequences')

class JobHazardAnalysisTaskHazard(db.Model):
    # One to many with Task
    __tablename__ = 'job_hazard_analysis_task_hazard'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_harazrd_analysis_task_id = db.Column(db.Integer, db.ForeignKey('job_hazard_analysis_task.id'), nullable=False, index=True)
    description = db.Column(db.String, nullable=False)
    
    task = db.relationship('JobHazardAnalysisTask', back_populates='hazards')
    consequences = db.relationship('JobHazardAnalysisTaskConsequences', order_by=JobHazardAnalysisTaskConsequences.id, back_populates='hazard')
    preventative_measure = db.relationship('JobHazardAnalysisPreventativeMeasure', back_populates='hazard', uselist=False)

class JobHazardAnalysisTask(db.Model):
    # One to many with JHA
    __tablename__ = 'job_hazard_analysis_task'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_hazard_analysis_id = db.Column(db.Integer, db.ForeignKey('job_hazard_analysis.id'), nullable=False, index=True)
    task_description = db.Column(db.String, nullable=False)
    step = db.Column(db.Integer, nullable=False)
    
    job_hazard_analysis = db.relationship('JobHazardAnalysis', back_populates='tasks')
    hazards = db.relationship('JobHazardAnalysisTaskHazard', order_by=JobHazardAnalysisTaskHazard.id, back_populates='task')
    
    
    def __init__(self, **kwargs):
        super(JobHazardAnalysisTask, self).__init__(**kwargs)
        self.set_step()

    def set_step(self):
        # Added step because a JHA has a "series" of steps. Assuming they are completed in order.
        # Find the current max step for the associated JobHazardAnalysis
        if self.job_hazard_analysis_id:
            max_step = db.session.query(db.func.max(JobHazardAnalysisTask.step)).filter_by(
                job_hazard_analysis_id=self.job_hazard_analysis_id
            ).scalar()
            self.step = (max_step or 1) + 1


class JobHazardAnalysis(db.Model):
    __tablename__ = 'job_hazard_analysis'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(128), nullable=False)
    author = db.Column(db.String(50), nullable=False)
    
    tasks = db.relationship('JobHazardAnalysisTask', order_by=JobHazardAnalysisTask.id, back_populates='job_hazard_analysis')