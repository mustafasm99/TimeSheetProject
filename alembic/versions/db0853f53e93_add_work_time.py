"""add work time

Revision ID: db0853f53e93
Revises: 8a0bf349f1d7
Create Date: 2025-03-21 13:10:13.682136

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'db0853f53e93'
down_revision: Union[str, None] = '8a0bf349f1d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('tasks', sa.Column('work_time', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('tasks', 'work_time')
    # ### end Alembic commands ###
