"""create project status

Revision ID: 689b06341644
Revises: 70fe498bed30
Create Date: 2024-11-07 17:14:48.883172

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '689b06341644'
down_revision: Union[str, None] = '70fe498bed30'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
