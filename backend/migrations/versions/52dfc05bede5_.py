"""empty message

Revision ID: 52dfc05bede5
Revises: cda354bc609a
Create Date: 2026-01-04 15:10:59.304165

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '52dfc05bede5'
down_revision: Union[str, Sequence[str], None] = 'cda354bc609a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
