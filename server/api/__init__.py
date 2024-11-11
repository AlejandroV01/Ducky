from .auth import auth_router
from .users import user_router
from .verification_attempts import verification_attempt_router

# TODO
# from .albums import album_router
# from .photos import photo_router

# add routers to this list
routers = [
    auth_router,
    user_router,
    verification_attempt_router
]

def add_routers(app):
    for router in routers:
        app.include_router(router)