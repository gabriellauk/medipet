import inspect
from functools import wraps
from typing import Any, Callable, Concatenate, ParamSpec, TypeAlias, TypeVar, cast
from uuid import UUID

from flask import session
from werkzeug.exceptions import BadRequest, Forbidden, Unauthorized

from app import models, store

P = ParamSpec("P")
R = TypeVar("R")

CallableToWrap: TypeAlias = Callable[Concatenate[models.Animal, models.User, P], R]
WrappedCallable: TypeAlias = Callable[P, R]


def requires_animal_permission(func: CallableToWrap[P, R]) -> WrappedCallable[P, R]:
    @wraps(func)
    def _check_user_permission(*args: P.args, **kwargs: P.kwargs) -> R:
        animal_id = _get_animal_id(func, args, kwargs)

        user_session = session.get("user")
        if user_session is None or (user := store.get_user_by_email(user_session["email"])) is None:
            raise Unauthorized("No user logged in")

        if (animal := store.get_animal(animal_id)) is None:
            raise BadRequest("Animal not found")

        if animal.user != user:
            raise Forbidden("User cannot access this animal")

        return func(user, animal, *args, **kwargs)

    return _check_user_permission


def _get_animal_id(func: Callable, args: tuple[Any, ...], kwargs: dict[str, Any]) -> UUID:
    sig = inspect.signature(func)
    new_sig = sig.replace(parameters=[v for k, v in sig.parameters.items() if k not in ["animal", "user"]])
    bound = new_sig.bind(*args, **kwargs)

    if "animal_id" not in bound.arguments:
        raise BadRequest("animal_id not supplied")

    return cast(UUID, bound.arguments["animal_id"])
