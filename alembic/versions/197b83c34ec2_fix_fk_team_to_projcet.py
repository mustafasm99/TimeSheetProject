from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '197b83c34ec2'
down_revision: Union[str, None] = '4f55dc316e2d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Use batch mode to add the foreign key constraint (since SQLite doesn't support ALTER directly)
    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.create_foreign_key(
            "fk_team",       # Name of the foreign key constraint
            'teams',         # The referenced table
            ['team_id'],     # The local column in the 'projects' table
            ['id'],          # The referenced column in the 'teams' table
            ondelete='CASCADE'  # Cascade delete behavior
        )

def downgrade() -> None:
    # Use batch mode to drop the foreign key constraint (if rolling back)
    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.drop_constraint("fk_team", type_='foreignkey')
