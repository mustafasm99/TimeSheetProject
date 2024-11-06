"""second init

Revision ID: 31b0b8f2bbda
Revises: 90fc1da1d9fb
Create Date: 2024-11-06 10:25:17.662358

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '31b0b8f2bbda'
down_revision: Union[str, None] = '90fc1da1d9fb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
