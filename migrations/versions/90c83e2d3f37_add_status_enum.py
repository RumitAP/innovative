"""add status enum

Revision ID: 90c83e2d3f37
Revises: bda9869ff183
Create Date: 2024-04-21 19:51:02.126538

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '90c83e2d3f37'
down_revision = 'bda9869ff183'
branch_labels = None
depends_on = None


def upgrade():
    status_enum = sa.Enum('Draft', 'Completed', name='statusenum')
    status_enum.create(op.get_bind(), checkfirst=True)
    
    # Add a column with the new enum type
    with op.batch_alter_table('job_hazard_analysis', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', status_enum, nullable=False, server_default='Draft'))

    # ### end Alembic commands ###


def downgrade():
    # Drop the column that uses the enum
    with op.batch_alter_table('job_hazard_analysis', schema=None) as batch_op:
        batch_op.drop_column('status')

    # Drop the enum type from PostgreSQL
    op.execute('DROP TYPE statusenum')
