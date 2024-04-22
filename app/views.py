from flask import request, jsonify
from flask.views import MethodView
from app import db
from app.models import JobHazardAnalysis

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
