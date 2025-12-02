from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.sql import func
from database.database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"
    
    id_usuario = Column(Integer, primary_key=True, autoincrement=True)
    nombre_usuario = Column(String(150), nullable=False)
    correo_usuario = Column(String(150), nullable=False)
    telefono_usuario = Column(String(30), nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    id_reserva = Column(Integer, ForeignKey("reserva.id_reserva"), nullable=True)

    # Relationship
    reservas = relationship("Reservas", back_populates="user")



class Reserva(Base):
    __tablename__ = "reserva"

    id_reserva = Column(Integer, primary_key=True, autoincrement=True)
    nombre_destino = Column(Integer, nullable=False) 
    fecha_inicio = Column(String(100), nullable=False)
    fecha_fin = Column(String(100), nullable=False)
    monto_reserva = Column(Integer, nullable=False)
    cuotas_reserva = Column(Integer, nullable=False)

    id_usuario = Column(String(100), ForeignKey("users.id_usuario"), nullable=False)

    # Relationship
    user = relationship("User", back_populates="reservas")


class Plan(Base):
    __tablename__ = "plan"

    id_plan = Column(Integer, primary_key=True, autoincrement=True)
    nombre_plan = Column(String(100), nullable=False) 
    categoria_plan = Column(String(100), nullable=False)
    descuento_plan = Column(Integer,nullable=False)

    id_usuario = Column(String(100), ForeignKey("users.id_usuario"), nullable=False)

    # Relationship
    user = relationship("User", back_populates="planes")
