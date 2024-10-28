from .users import user_router
from .album_roles import album_role_router

# add routers to this list
routers = [
    user_router,
    album_role_router
]

def add_routers(app):
    for router in routers:
        app.include_router(router)