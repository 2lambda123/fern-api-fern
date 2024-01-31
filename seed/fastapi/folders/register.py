# This file was auto-generated by Fern from our API Definition.

import glob
import importlib
import os
import types
import typing

import fastapi
import starlette
from fastapi import params

from .core.abstract_fern_service import AbstractFernService
from .core.exceptions import default_exception_handler, fern_http_exception_handler, http_exception_handler
from .core.exceptions.fern_http_exception import FernHTTPException
from .resources.a.resources.b.service.service import AbstractABService
from .resources.a.resources.c.service.service import AbstractACService
from .resources.folder.resources.service.service.service import AbstractFolderServiceService
from .resources.folder.service.service import AbstractFolderService
from .service.service import AbstractRootService


def register(
    _app: fastapi.FastAPI,
    *,
    root: AbstractRootService,
    a_b: AbstractABService,
    a_c: AbstractACService,
    folder: AbstractFolderService,
    folder_service: AbstractFolderServiceService,
    dependencies: typing.Optional[typing.Sequence[params.Depends]] = None
) -> None:
    _app.include_router(__register_service(root), dependencies=dependencies)
    _app.include_router(__register_service(a_b), dependencies=dependencies)
    _app.include_router(__register_service(a_c), dependencies=dependencies)
    _app.include_router(__register_service(folder), dependencies=dependencies)
    _app.include_router(__register_service(folder_service), dependencies=dependencies)

    _app.add_exception_handler(FernHTTPException, fern_http_exception_handler)
    _app.add_exception_handler(starlette.exceptions.HTTPException, http_exception_handler)
    _app.add_exception_handler(Exception, default_exception_handler)


def __register_service(service: AbstractFernService) -> fastapi.APIRouter:
    router = fastapi.APIRouter()
    type(service)._init_fern(router)
    return router


def register_validators(module: types.ModuleType) -> None:
    validators_directory: str = os.path.dirname(module.__file__)  # type: ignore
    for path in glob.glob(os.path.join(validators_directory, "**/*.py"), recursive=True):
        if os.path.isfile(path):
            relative_path = os.path.relpath(path, start=validators_directory)
            module_path = ".".join([module.__name__] + relative_path[:-3].split("/"))
            importlib.import_module(module_path)
