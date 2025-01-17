from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision: str = 'df966c51e5aa'
down_revision: Union[str, None] = '39a7efb44ec2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create the new table `team_members`
    # op.create_table(
    #     'team_members',
    #     sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    #     sa.Column('team_id', sa.Integer(), nullable=True),
    #     sa.Column('user_id', sa.Integer(), nullable=True),
    #     sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
    #     sa.Column('is_leader', sa.Boolean(), nullable=True, default=False),
    #     sa.Column('create_time', sa.DateTime(), nullable=True, default=datetime.utcnow),
    #     sa.Column('update_time', sa.DateTime(), nullable=True, default=datetime.utcnow),
    #     sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ondelete='CASCADE'),
    #     sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    #     sa.PrimaryKeyConstraint('id')
    # )
    # op.create_index(op.f('ix_team_members_id'), 'team_members', ['id'], unique=False)

    # Use batch mode to handle dropping the constraint and modifying the `teams` table
    with op.batch_alter_table('teams', schema=None) as batch_op:
        # batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('team_leader_id')


def downgrade() -> None:
    # Revert the changes
    op.add_column(
        'teams', sa.Column('team_leader_id', sa.INTEGER(), nullable=True)
    )
    # op.create_foreign_key(
    #     None, 'teams', 'users', ['team_leader_id'], ['id'], ondelete='CASCADE'
    # )
    # op.drop_index(op.f('ix_team_members_id'), table_name='team_members')
    # op.drop_table('team_members')
