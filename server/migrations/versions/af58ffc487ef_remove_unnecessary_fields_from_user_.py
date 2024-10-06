"""Remove unnecessary fields from User table

Revision ID: af58ffc487ef
Revises: eab857ac4e5e
Create Date: 2024-09-19 20:30:14.885153

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'af58ffc487ef'
down_revision = 'eab857ac4e5e'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_index('ix_user_username')
        batch_op.drop_column('password_hash')
        batch_op.drop_column('username')

def downgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.VARCHAR(length=64)))
        batch_op.add_column(sa.Column('password_hash', sa.VARCHAR(length=256), nullable=True))

    op.execute("UPDATE user SET username = CAST(user.id AS VARCHAR(64))")
    
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('username', nullable=False)
    
    op.create_index('ix_user_username', 'user', ['username'], unique=True)