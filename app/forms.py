from flask_wtf import FlaskForm
from wtforms import SelectField, StringField, SubmitField
from wtforms.validators import DataRequired


class CreateAnimalForm(FlaskForm):
    animal_type = SelectField("Type of Animal", coerce=int)
    name = StringField("Name", validators=[DataRequired()])
    submit = SubmitField("Create")
