"""remove team leader from the projcet object

Revision ID: 0d4742aea7f6
Revises: 192cbc60a8c8
Create Date: 2025-02-14 16:08:17.134036

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0d4742aea7f6'
down_revision: Union[str, None] = '192cbc60a8c8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Use batch mode for SQLite compatibility
    with op.batch_alter_table("projects") as batch_op:
        # batch_op.drop_constraint("" , type_="foreignkey")  # Adjust constraint name
        batch_op.drop_column("team_leader_id")

def downgrade() -> None:
    with op.batch_alter_table("projects") as batch_op:
        batch_op.add_column(sa.Column("team_leader_id", sa.Integer(), nullable=True))
        
