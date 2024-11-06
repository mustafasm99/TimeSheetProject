from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '719c34720458'
down_revision: Union[str, None] = '38d4b317f959'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Use batch mode to handle SQLite limitations on constraints
    with op.batch_alter_table("users_roll", schema=None) as batch_op:
        batch_op.create_foreign_key(
            constraint_name="user_to_roll",         # You can name the constraint or leave it as None
            referent_table="users",       # The table being referenced
            local_cols=["user_id"],       # The column in this table
            remote_cols=["id"],           # The column in the referenced table
            ondelete="CASCADE"            # Specify ON DELETE behavior
        )

def downgrade() -> None:
    # Use batch mode to drop the foreign key in case of rollback
    with op.batch_alter_table("users_roll", schema=None) as batch_op:
        batch_op.drop_constraint(
            constraint_name="user_to_roll",         # Same name used in `upgrade`
            type_="foreignkey"
        )
