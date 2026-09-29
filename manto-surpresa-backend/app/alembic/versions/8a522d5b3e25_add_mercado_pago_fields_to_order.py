"""add mercado pago fields to order

Revision ID: 8a522d5b3e25
Revises: 98649ff1d4a7
Create Date: 2026-09-29 16:39:27.268014

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8a522d5b3e25'
down_revision: Union[str, Sequence[str], None] = '98649ff1d4a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # SQLite não suporta ALTER COLUMN diretamente.
    # O batch_alter_table faz a recriação da tabela internamente.
    with op.batch_alter_table('boxes', schema=None) as batch_op:
        batch_op.alter_column(
            'price',
            existing_type=sa.FLOAT(),
            type_=sa.Numeric(precision=10, scale=2),
            existing_nullable=False
        )

    op.add_column(
        'orders',
        sa.Column('mercado_pago_order_id', sa.String(), nullable=True)
    )

    op.add_column(
        'orders',
        sa.Column('mercado_pago_payment_id', sa.String(), nullable=True)
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column('orders', 'mercado_pago_payment_id')
    op.drop_column('orders', 'mercado_pago_order_id')

    with op.batch_alter_table('boxes', schema=None) as batch_op:
        batch_op.alter_column(
            'price',
            existing_type=sa.Numeric(precision=10, scale=2),
            type_=sa.FLOAT(),
            existing_nullable=False
        )