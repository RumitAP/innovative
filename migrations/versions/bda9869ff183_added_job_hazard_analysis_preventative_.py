"""Added job hazard analysis preventative measure

Revision ID: bda9869ff183
Revises: c1c7c735c18c
Create Date: 2024-04-21 16:41:59.746731

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bda9869ff183'
down_revision = 'c1c7c735c18c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('job_hazard_analysis_task_hazard_preventative_measure',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('job_harazrd_analysis_task_hazard_id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['job_harazrd_analysis_task_hazard_id'], ['job_hazard_analysis_task_hazard.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('job_hazard_analysis_task_hazard_preventative_measure', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_job_hazard_analysis_task_hazard_preventative_measure_job_harazrd_analysis_task_hazard_id'), ['job_harazrd_analysis_task_hazard_id'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('job_hazard_analysis_task_hazard_preventative_measure', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_job_hazard_analysis_task_hazard_preventative_measure_job_harazrd_analysis_task_hazard_id'))

    op.drop_table('job_hazard_analysis_task_hazard_preventative_measure')
    # ### end Alembic commands ###
