from .users import user_router
from .albums import album_router

# add routers to this list
routers = [
    user_router,
    album_router
]

def add_routers(app):
    for router in routers:
        app.include_router(router)