"""Initial schema baseline (tables created via init_db at startup).

Revision ID: 001_initial
Revises:
Create Date: 2026-07-15
"""

from typing import Sequence, Union

revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Schema is bootstrapped by SQLAlchemy create_all() on existing deployments.
    pass


def downgrade() -> None:
    pass
