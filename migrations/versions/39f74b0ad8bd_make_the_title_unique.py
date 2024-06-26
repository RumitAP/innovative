"""make the title unique

Revision ID: 39f74b0ad8bd
Revises: ed2d5100f889
Create Date: 2024-04-22 00:20:10.261357

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '39f74b0ad8bd'
down_revision = 'ed2d5100f889'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('job_hazard_analysis', schema=None) as batch_op:
        batch_op.create_unique_constraint(None, ['title'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('job_hazard_analysis', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')

    # ### end Alembic commands ###
