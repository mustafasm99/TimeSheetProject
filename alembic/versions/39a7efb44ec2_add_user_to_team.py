from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic
revision: str = '39a7efb44ec2'
down_revision: str | None = 'a1ade1290e0a'
branch_labels: str | list[str] | None = None
depends_on: str | list[str] | None = None


def upgrade() -> None:
    # Use batch mode to handle SQLite's limitations
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(sa.Column('team_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            'fk_users_team_id',
            'teams',
            ['team_id'],
            ['id'],
            ondelete='CASCADE'
        )


def downgrade() -> None:
    # Use batch mode to handle SQLite's limitations
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_constraint('fk_users_team_id', type_='foreignkey')
        batch_op.drop_column('team_id')
