from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_enum import EnumField
from app.models import *

class JobHazardAnalysisSchema(SQLAlchemyAutoSchema):
    
    status = EnumField(StatusEnum, by_value=True)
    
    class Meta:
        model = JobHazardAnalysis
        include_relationships = True
        load_instance = True

class JobHazardAnalysisTaskSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = JobHazardAnalysisTask
        include_relationships = True
        load_instance = True

class JobHazardAnalysisTaskHazardSchema(SQLAlchemyAutoSchema):
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