"""Create Profile Table

Revision ID: eb29106a6afe
Revises: bba15c98790f
Create Date: 2024-11-24 14:57:01.525452

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'eb29106a6afe'
down_revision: Union[str, None] = 'bba15c98790f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Use batch mode for SQLite to apply foreign key changes
    with op.batch_alter_table("projects", schema=None) as batch_op:
        batch_op.create_foreign_key(
            "fk_project_status", "project_status", ["project_status_id"], ["id"], ondelete="CASCADE"
        )
    
    with op.batch_alter_table("tasks", schema=None) as batch_op:
        batch_op.create_foreign_key(
            "fk_task_status", "task_status", ["status_id"], ["id"], ondelete="SET NULL"
        )
        batch_op.create_foreign_key(
            "fk_task_category", "task_category", ["category_id"], ["id"], ondelete="SET NULL"
        )


def downgrade() -> None:
    # Use batch mode for SQLite to drop foreign keys
    with op.batch_alter_table("projects", schema=None) as batch_op:
        batch_op.drop_constraint("fk_project_status", type_="foreignkey")
    
    with op.batch_alter_table("tasks", schema=None) as batch_op:
        batch_op.drop_constraint("fk_task_status", type_="foreignkey")
        batch_op.drop_constraint("fk_task_category", type_="foreignkey")
