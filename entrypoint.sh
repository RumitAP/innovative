#!/bin/sh
# Run Flask database migrations
flask db upgrade
# Start the Flask application
exec "$@"
