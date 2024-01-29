# This file was auto-generated by Fern from our API Definition.

import abc
import functools
import inspect
import logging
import typing

import fastapi

from ....core.abstract_fern_service import AbstractFernService
from ....core.exceptions.fern_http_exception import FernHTTPException
from ....core.route_args import get_route_args
from ....security import ApiAuth, FernAuth
from ...types.resources.object.types.object_with_optional_field import ObjectWithOptionalField


class AbstractNoReqBodyService(AbstractFernService):
    """
    AbstractNoReqBodyService is an abstract class containing the methods that you should implement.

    Each method is associated with an API route, which will be registered
    with FastAPI when you register your implementation using Fern's register()
    function.
    """

    @abc.abstractmethod
    def get_with_no_request_body(self, *, auth: ApiAuth) -> ObjectWithOptionalField:
        ...

    @abc.abstractmethod
    def post_with_no_request_body(self, *, auth: ApiAuth) -> str:
        ...

    """
    Below are internal methods used by Fern to register your implementation.
    You can ignore them.
    """

    @classmethod
    def _init_fern(cls, router: fastapi.APIRouter) -> None:
        cls.__init_get_with_no_request_body(router=router)
        cls.__init_post_with_no_request_body(router=router)

    @classmethod
    def __init_get_with_no_request_body(cls, router: fastapi.APIRouter) -> None:
        endpoint_function = inspect.signature(cls.get_with_no_request_body)
        new_parameters: typing.List[inspect.Parameter] = []
        for index, (parameter_name, parameter) in enumerate(endpoint_function.parameters.items()):
            if index == 0:
                new_parameters.append(parameter.replace(default=fastapi.Depends(cls)))
            elif parameter_name == "auth":
                new_parameters.append(parameter.replace(default=fastapi.Depends(FernAuth)))
            else:
                new_parameters.append(parameter)
        setattr(cls.get_with_no_request_body, "__signature__", endpoint_function.replace(parameters=new_parameters))

        @functools.wraps(cls.get_with_no_request_body)
        def wrapper(*args: typing.Any, **kwargs: typing.Any) -> ObjectWithOptionalField:
            try:
                return cls.get_with_no_request_body(*args, **kwargs)
            except FernHTTPException as e:
                logging.getLogger(f"{cls.__module__}.{cls.__name__}").warn(
                    f"Endpoint 'get_with_no_request_body' unexpectedly threw {e.__class__.__name__}. "
                    + f"If this was intentional, please add {e.__class__.__name__} to "
                    + "the endpoint's errors list in your Fern Definition."
                )
                raise e

        # this is necessary for FastAPI to find forward-ref'ed type hints.
        # https://github.com/tiangolo/fastapi/pull/5077
        wrapper.__globals__.update(cls.get_with_no_request_body.__globals__)

        router.get(
            path="/no-req-body",
            response_model=ObjectWithOptionalField,
            description=AbstractNoReqBodyService.get_with_no_request_body.__doc__,
            **get_route_args(cls.get_with_no_request_body, default_tag="no_req_body"),
        )(wrapper)

    @classmethod
    def __init_post_with_no_request_body(cls, router: fastapi.APIRouter) -> None:
        endpoint_function = inspect.signature(cls.post_with_no_request_body)
        new_parameters: typing.List[inspect.Parameter] = []
        for index, (parameter_name, parameter) in enumerate(endpoint_function.parameters.items()):
            if index == 0:
                new_parameters.append(parameter.replace(default=fastapi.Depends(cls)))
            elif parameter_name == "auth":
                new_parameters.append(parameter.replace(default=fastapi.Depends(FernAuth)))
            else:
                new_parameters.append(parameter)
        setattr(cls.post_with_no_request_body, "__signature__", endpoint_function.replace(parameters=new_parameters))

        @functools.wraps(cls.post_with_no_request_body)
        def wrapper(*args: typing.Any, **kwargs: typing.Any) -> str:
            try:
                return cls.post_with_no_request_body(*args, **kwargs)
            except FernHTTPException as e:
                logging.getLogger(f"{cls.__module__}.{cls.__name__}").warn(
                    f"Endpoint 'post_with_no_request_body' unexpectedly threw {e.__class__.__name__}. "
                    + f"If this was intentional, please add {e.__class__.__name__} to "
                    + "the endpoint's errors list in your Fern Definition."
                )
                raise e

        # this is necessary for FastAPI to find forward-ref'ed type hints.
        # https://github.com/tiangolo/fastapi/pull/5077
        wrapper.__globals__.update(cls.post_with_no_request_body.__globals__)

        router.post(
            path="/no-req-body",
            response_model=str,
            description=AbstractNoReqBodyService.post_with_no_request_body.__doc__,
            **get_route_args(cls.post_with_no_request_body, default_tag="no_req_body"),
        )(wrapper)