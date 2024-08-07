"""Create Animal and AnimalType tables

Revision ID: bd41686b4deb
Revises: ce2aa47546d9
Create Date: 2024-08-07 19:44:58.846248

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bd41686b4deb'
down_revision = 'ce2aa47546d9'
branch_labels = None
depends_on = None


def upgrade():
    animal_type_table = op.create_table('animal_type',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=30), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.bulk_insert(
        animal_type_table,
        [
            {"name": "Cat"},
            {"name": "Dog"},
            {"name": "Rabbit"},
        ],
    )
    with op.batch_alter_table('animal_type', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_animal_type_name'), ['name'], unique=True)

    op.create_table('animal',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=30), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('animal_type_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['animal_type_id'], ['animal_type.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('animal', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_animal_animal_type_id'), ['animal_type_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_animal_name'), ['name'], unique=False)
        batch_op.create_index(batch_op.f('ix_animal_user_id'), ['user_id'], unique=False)


def downgrade():
    with op.batch_alter_table('animal', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_animal_user_id'))
        batch_op.drop_index(batch_op.f('ix_animal_name'))
        batch_op.drop_index(batch_op.f('ix_animal_animal_type_id'))

    op.drop_table('animal')
    with op.batch_alter_table('animal_type', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_animal_type_name'))

    op.drop_table('animal_type')
