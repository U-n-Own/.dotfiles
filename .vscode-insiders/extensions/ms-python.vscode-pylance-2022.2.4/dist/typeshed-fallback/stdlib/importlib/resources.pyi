import os
import sys
from contextlib import AbstractContextManager
from pathlib import Path
from types import ModuleType
from typing import Any, BinaryIO, Iterator, TextIO, Union

Package = Union[str, ModuleType]
Resource = Union[str, os.PathLike[Any]]

def open_binary(package: Package, resource: Resource) -> BinaryIO: ...
def open_text(package: Package, resource: Resource, encoding: str = ..., errors: str = ...) -> TextIO: ...
def read_binary(package: Package, resource: Resource) -> bytes: ...
def read_text(package: Package, resource: Resource, encoding: str = ..., errors: str = ...) -> str: ...
def path(package: Package, resource: Resource) -> AbstractContextManager[Path]: ...
def is_resource(package: Package, name: str) -> bool: ...
def contents(package: Package) -> Iterator[str]: ...

if sys.version_info >= (3, 9):
    from importlib.abc import Traversable
    def files(package: Package) -> Traversable: ...
    def as_file(path: Traversable) -> AbstractContextManager[Path]: ...

if sys.version_info >= (3, 10):
    from importlib.abc import ResourceReader as ResourceReader