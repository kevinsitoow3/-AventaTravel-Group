from pydantic import BaseModel
from datetime import datetime


# ==================== USERS SCHEMAS ====================
class UserBase(BaseModel):
    nombre_usuario: str
    correo_usuario: str
    telefono_usuario: str


class UserCreate(UserBase):
    pass


class User(UserBase):
    id_usuario: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    
    class Config:
        from_attributes = True

# ==================== RESERVA SCHEMAS ====================
class ReservaBase(BaseModel):
    nombre_destino: str
    monto_reserva: int
    cuotas_reserva: int


class ReservaCreate(ReservaBase):
    pass


class Reserva(ReservaBase):
    id_reserva: int
    fecha_inicio: datetime
    fecha_fin: datetime

    class Config:
        from_attributes: True

# ==================== PLAN SCHEMAS ====================
class PlanBase(BaseModel):
    nombre_plan: str
    categoria_plan: str
    descuento_plan: int


class PlanCreate(PlanBase):
    pass


class Plan(PlanBase):
    id_plan: int

    class Config:
        from_attributes: True

