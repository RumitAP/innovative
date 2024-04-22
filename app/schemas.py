from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from marshmallow_sqlalchemy.fields import Nested
from marshmallow_enum import EnumField
from app.models import *

class JobHazardAnalysisSchema(SQLAlchemyAutoSchema):
    status = EnumField(StatusEnum, by_value=True)
    
    tasks = Nested('JobHazardAnalysisTaskSchema', many=True)
    
    class Meta:
        model = JobHazardAnalysis
        include_relationships = True
        load_instance = True

class JobHazardAnalysisTaskSchema(SQLAlchemyAutoSchema):
    
    hazards = Nested('JobHazardAnalysisTaskHazardSchema', many=True)
    
    class Meta:
        model = JobHazardAnalysisTask
        include_relationships = True
        load_instance = True

class JobHazardAnalysisTaskHazardSchema(SQLAlchemyAutoSchema):
    
    consequences = Nested('JobHazardAnalysisTaskConsequencesSchema', many=True)
    preventative_measures = Nested('JobHazardAnalysisPreventativeMeasureSchema', many=True)
    
    class Meta:
        model = JobHazardAnalysisTaskHazard
        include_relationships = True
        load_instance = True

class JobHazardAnalysisTaskConsequencesSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = JobHazardAnalysisTaskConsequences
        include_relationships = True
        load_instance = True
        
class JobHazardAnalysisPreventativeMeasureSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = JobHazardAnalysisPreventativeMeasure
        include_relationships = True
        load_instance = True