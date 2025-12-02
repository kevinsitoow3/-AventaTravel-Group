from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine, Base
# Importar todos los modelos para que se registren en Base.metadata
from models import models
from routers.users import router as users_router
from routers.reserva import router as reservas_router

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AventaTravel Group API",
    version="1.0.0",
)

# Configurar CORS para permitir conexiones desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Puerto por defecto de React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Bienvenido a la API de AventaTravel Group",
        "version": "1.0.0",
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc"
        },
        "endpoints": {
            "users": "/api/users/"
        }
    }

API_PREFIX = "/api"
app.include_router(users_router, prefix=API_PREFIX)
app.include_router(reservas_router, prefix=API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
