from flask import request, jsonify, make_response
from flask.views import MethodView
from sqlalchemy.exc import IntegrityError
from app import db
from app.models import JobHazardAnalysis
from config import DEFAULT_PER_PAGE

class CRUDView(MethodView):

    def __init__(self, model, schema):
        self.model = model
        self.schema = schema

    def get(self, id):
        if id is None:
            # Return a list of the model
            items = self.model.query.all()
            return jsonify(self.schema(many=True).dump(items))
        else:
            # Return a single item
            item = self.model.query.get_or_404(id)
            return jsonify(self.schema().dump(item))

    def post(self):
        # Create a new record
        data = request.json
        item = self.model(**data)
        if type(item) is JobHazardAnalysis:
            item.validate_completion()
        db.session.add(item)
        db.session.commit()
        return jsonify(self.schema().dump(item))

    def put(self, id):
        # Update an existing record
        item = self.model.query.get_or_404(id)
        data = request.json
        for key, value in data.items():
            setattr(item, key, value)
        if type(item) is JobHazardAnalysis:
            item.validate_completion()
        db.session.commit()
        return jsonify(self.schema().dump(item))

    def delete(self, id):
        # Delete a record
        item = self.model.query.get_or_404(id)
        db.session.delete(item)
        db.session.commit()
        return '', 204
    
    
class JobHazardAnalysisCRUDView(CRUDView):
    def get(self, id):
        query_params = request.args

        if id is None:
            page = int(query_params.get('page', 1))
            per_page = int(query_params.get('per_page', DEFAULT_PER_PAGE))
            paginated_items = self.model.query.order_by(self.model.created_utc.desc()).paginate(page=page, per_page=per_page, error_out=False)
            items = paginated_items.items
            total_pages = paginated_items.pages
            current_page = paginated_items.page

            response = {
                'total_pages': total_pages,
                'current_page': current_page,
                'items': self.schema(many=True).dump(items),
            }
            return jsonify(response)
        else:
            # Return a single item
            item = self.model.query.get_or_404(id)
            return jsonify(self.schema().dump(item))
        
    def post(self):
        # Create a new record
        data = request.json
        item = self.model(**data)
        if type(item) is JobHazardAnalysis:
            try:
                item.validate_completion()
            except IntegrityError as e:
                db.session.rollback()
                # Instead of raising ValidationError, create a response with status code 400
                error_message = f"JHA with Title '{data.get('title')}' has already been created."
                return make_response(jsonify({"error": error_message}), 400)
        return jsonify(self.schema().dump(item))
    
class JobHazardAnalysisTasksCRUDView(CRUDView):
    def post(self):
        # Create a new record
        data = request.json
        jha_id = data.pop("jha_id")
        data["job_hazard_analysis_id"] = jha_id
        item = self.model(**data)
        try:
            db.session.add(item)
            db.session.commit()
        except IntegrityError as e:
            db.session.rollback()
            error_message = "Error."
            return make_response(jsonify({"error": error_message}), 400)
        item.job_hazard_analysis.validate_completion()
        return jsonify(self.schema().dump(item))
    
class JobHazardAnalysisTasksHazardsCRUDView(CRUDView):
    def post(self):
        data = request.json
        jha_id = data.pop("task_id")
        data["job_harazrd_analysis_task_id"] = jha_id
        item = self.model(**data)
        try:
            db.session.add(item)
            db.session.commit()
        except IntegrityError as e:
            db.session.rollback()
            error_message = "Error."
            return make_response(jsonify({"error": error_message}), 400)
        item.task.job_hazard_analysis.validate_completion()
        return jsonify(self.schema().dump(item))
    
class JobHazardAnalysisTasksConsequencesAndPreventativeMeasuresCRUDView(CRUDView):
    def post(self):
        data = request.json
        jha_id = data.pop("job_hazard_analysis_task_hazard_id")
        data["job_hazard_analysis_task_hazard_id"] = jha_id
        item = self.model(**data)
        try:
            db.session.add(item)
            db.session.commit()
        except IntegrityError as e:
            db.session.rollback()
            error_message = "Error."
            return make_response(jsonify({"error": error_message}), 400)
        item.hazard.task.job_hazard_analysis.validate_completion()
        return jsonify(self.schema().dump(item))
        