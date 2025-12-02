"""
Router para la entidad Reserva (Resevas)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import Reserva as ReservaModel
from schemas import Reserva, ReservaCreate

# ==================== CONFIGURACIÓN DEL ROUTER ====================
router = APIRouter(prefix="/reservas", tags=["Reservas"])


# ==================== ENDPOINTS CRUD ====================

@router.get("/")
def list_reservas(db: Session = Depends(get_db)):
    """
    Obtiene todas las entidades.
    Retorna: {"reservas": [lista de reservas]}
    """
    try:
        reservas = db.query(ReservaModel).all()
        
        # Transformar cada entidad: convertir objetos SQLAlchemy a dict y transformar IDs
        reservas_dict = []
        for reserva in reservas:
            reserva_dict = {
                'id_reserva': reserva.id_reserva,
                'nombre_destino': reserva.nombre_reserva,
                'fecha_inicio': reserva.fecha_inicio,
                'fecha_fin': reserva.fecha_fin,
                'monto_reserva': reserva.monto_reserva,
                'cuotas_reserva': reserva.cuotas_reserva,
            }
            reservas_dict.append(reserva_dict)
        
        return {"reservas": reservas_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener las reservas: {str(e)}")


@router.post("/")
def create_reserva(reserva: ReservaCreate, db: Session = Depends(get_db)):
    """
    Crea una nueva entidad.
    Retorna: {"mensaje": "mensaje de éxito", "reserva": reserva creada}
    """
    try:
        # Crear instancia del modelo con los datos del schema
        db_reserva = ReservaModel(
            id_reserva= reserva.id_reserva,
            nombre_destino = reserva.nombre_reserva,
            fecha_inicio = reserva.fecha_inicio,
            fecha_fin = reserva.fecha_fin,
            monto_reserva = reserva.monto_reserva,
            cuotas_reserva = reserva.cuotas_reserva,
        )
        
        db.add(db_reserva)
        db.commit()
        db.refresh(db_reserva)
        
        # Transformar la respuesta
        reserva_dict = {
            'id_reserva': db_reserva.id_reserva,
            'nombre_destino': db_reserva.nombre_destino,
            'fecha_inicio': db_reserva.fecha_inicio,
            'fecha_fin': db_reserva.fecha_fin,
            'monto_reserva': db_reserva.monto_reserva,
            'cuotas_reserva': db_reserva.cuotas_reserva,
        }
        
        return {
            "mensaje": "Reserva creada correctamente",
            "reserva": reserva_dict
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al crear la reserva: {str(e)}")


@router.put("/{reserva_id}")
def update_reserva(
    reserva_id: int,
    reserva_update: ReservaCreate,
    db: Session = Depends(get_db)
):
    """
    Actualiza una entidad existente.
    Retorna: {"mensaje": "mensaje de éxito", "reserva": reserva actualizada}
    """
    try:
        reserva = db.query(ReservaModel).filter(ReservaModel.id_reserva == reserva_id).first()
        
        if not reserva:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")
        
        # Actualizar todos los campos
        reserva.nombre_destino = reserva_update.nombre_destino
        reserva.fecha_inicio = reserva_update.fecha_inicio
        reserva.fecha_fin = reserva_update.fecha_fin
        reserva.monto_reserva = reserva_update.monto_reserva
        reserva.cuotas_reserva = reserva_update.cuotas_reserva

        
        db.commit()
        db.refresh(reserva)
        
        # Transformar la respuesta
        reserva_dict = {
            'id_reserva': db_reserva.id_reserva,
            'nombre_destino': db_reserva.nombre_destino,
            'fecha_inicio': db_reserva.fecha_inicio,
            'fecha_fin': db_reserva.fecha_fin,
            'monto_reserva': db_reserva.monto_reserva,
            'cuotas_reserva': db_reserva.cuotas_reserva,
        }
        
        return {
            "mensaje": "Reserva actualizado",
            "product": reserva_dict
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al actualizar la reserva: {str(e)}")


@router.delete("/{reserva_id}")
def delete_reserva(reserva_id: int, db: Session = Depends(get_db)):
    """
    Elimina una entidad.
    Valida Foreign Keys antes de eliminar.
    Retorna: {"mensaje": "mensaje de éxito"}
    """
    try:
        reserva = db.query(ReservaModel).filter(ReservaModel.id_reserva == reserva_id).first()
        
        if not reserva:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")
        
        # ==================== VALIDACIÓN DE FOREIGN KEYS ====================
        # Verificar si hay usuarios relacionados con este producto
        from models.models import User as UserModel
        usuarios_relacionados = db.query(UserModel).filter(
            UserModel.id_reserva == reserva_id
        ).first()
        
        if usuarios_relacionados:
            raise HTTPException(
                status_code=400,
                detail="No se puede eliminar esta reserva porque tiene usuarios relacionados."
            )
        
        db.delete(reserva)
        db.commit()
        
        return {"mensaje": "Reserva eliminada"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al eliminar la reserva: {str(e)}")
