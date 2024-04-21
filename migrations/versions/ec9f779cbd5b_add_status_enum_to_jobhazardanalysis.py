"""Add status enum to JobHazardAnalysis

Revision ID: ec9f779cbd5b
Revises: bda9869ff183
Create Date: 2024-04-21 19:05:19.017441

"""
from alembic import op
import sqlalchemy as sa
from app.models import StatusEnum


# revision identifiers, used by Alembic.
revision = 'ec9f779cbd5b'
down_revision = 'bda9869ff183'
branch_labels = None
depends_on = None


def upgrade():
    status_enum = sa.Enum('Draft', 'Completed', name='statusenum')
    status_enum.create(op.get_bind(), checkfirst=True)

    # Add the column using the new enum type
    with op.batch_alter_table('job_hazard_analysis', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', status_enum, nullable=False))

def downgrade():
    # Drop the column
    with op.batch_alter_table('job_hazard_analysis', schema=None) as batch_op:
        batch_op.drop_column('status')

    # Drop the enum type
    op.execute('DROP TYPE statusenum')
