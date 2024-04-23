"""add steps to hazard

Revision ID: 36ba4f09a8ef
Revises: 944bf36812cc
Create Date: 2024-04-23 01:21:19.083958

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '36ba4f09a8ef'
down_revision = '944bf36812cc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('job_hazard_analysis_task', schema=None) as batch_op:
        batch_op.add_column(sa.Column('step', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('job_hazard_analysis_task', schema=None) as batch_op:
        batch_op.drop_column('step')

    # ### end Alembic commands ###