from .users import user_router

# add routers to this list
routers = [
    user_router
]

def add_routers(app):
    for router in routers:
        app.include_router(router)