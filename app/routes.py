from flask import render_template, redirect, url_for, flash, request
from app import app
from app.models import *
from app.schemas import *
from app.views import CRUDView, JobHazardAnalysisCRUDView, JobHazardAnalysisTasksCRUDView, JobHazardAnalysisTasksHazardsCRUDView, JobHazardAnalysisTasksConsequencesAndPreventativeMeasuresCRUDView

# Register the generic CRUD endpoints for JobHazardAnalysis
jha_view = JobHazardAnalysisCRUDView.as_view('jha_view', model=JobHazardAnalysis, schema=JobHazardAnalysisSchema)
app.add_url_rule('/job-hazard-analysis/', defaults={'id': None}, view_func=jha_view, methods=['GET',])
app.add_url_rule('/job-hazard-analysis/', view_func=jha_view, methods=['POST',])
app.add_url_rule('/job-hazard-analysis/<int:id>', view_func=jha_view, methods=['GET', 'PUT', 'DELETE'])

# Register the generic CRUD endpoints for JobHazardAnalysisTask
jhat_view = JobHazardAnalysisTasksCRUDView.as_view('jhat_view', model=JobHazardAnalysisTask, schema=JobHazardAnalysisTaskSchema)
app.add_url_rule('/job-hazard-analysis-task/', defaults={'id': None}, view_func=jhat_view, methods=['GET',])
app.add_url_rule('/job-hazard-analysis-task/', view_func=jhat_view, methods=['POST',])
app.add_url_rule('/job-hazard-analysis-task/<int:id>', view_func=jhat_view, methods=['GET', 'PUT', 'DELETE'])

# Register the generic CRUD endpoints for JobHazardAnalysisTaskHazard
jhath_view = JobHazardAnalysisTasksHazardsCRUDView.as_view('jhath_view', model=JobHazardAnalysisTaskHazard, schema=JobHazardAnalysisTaskHazardSchema)
app.add_url_rule('/job-hazard-analysis-task-hazard/', defaults={'id': None}, view_func=jhath_view, methods=['GET',])
app.add_url_rule('/job-hazard-analysis-task-hazard/', view_func=jhath_view, methods=['POST',])
app.add_url_rule('/job-hazard-analysis-task-hazard/<int:id>', view_func=jhath_view, methods=['GET', 'PUT', 'DELETE'])

# Register the generic CRUD endpoints for JobHazardAnalysisTaskConsequences
jhatc_view = JobHazardAnalysisTasksConsequencesAndPreventativeMeasuresCRUDView.as_view('jhatc_view', model=JobHazardAnalysisTaskConsequences, schema=JobHazardAnalysisTaskConsequencesSchema)
app.add_url_rule('/job-hazard-analysis-task-consequences/', defaults={'id': None}, view_func=jhatc_view, methods=['GET',])
app.add_url_rule('/job-hazard-analysis-task-consequences/', view_func=jhatc_view, methods=['POST',])
app.add_url_rule('/job-hazard-analysis-task-consequences/<int:id>', view_func=jhatc_view, methods=['GET', 'PUT', 'DELETE'])

# Register the generic CRUD endpoints for JobHazardAnalysisPreventativeMeasure
jhatpm_view = JobHazardAnalysisTasksConsequencesAndPreventativeMeasuresCRUDView.as_view('jhatpm_view', model=JobHazardAnalysisPreventativeMeasure, schema=JobHazardAnalysisPreventativeMeasureSchema)
app.add_url_rule('/job-hazard-analysis-preventative-measure/', defaults={'id': None}, view_func=jhatpm_view, methods=['GET',])
app.add_url_rule('/job-hazard-analysis-preventative-measure/', view_func=jhatpm_view, methods=['POST',])
app.add_url_rule('/job-hazard-analysis-preventative-measure/<int:id>', view_func=jhatpm_view, methods=['GET', 'PUT', 'DELETE'])


@app.route('/')
def home():
    return render_template('home.html')