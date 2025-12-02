"""
Router para la entidad Users (Usuarios)
Ejemplo de implementación usando la plantilla TEMPLATE_ROUTER.py
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import User as UserModel
from schemas import User, UserCreate

# ==================== CONFIGURACIÓN DEL ROUTER ====================
router = APIRouter(prefix="/users", tags=["Users"])


# ==================== ENDPOINTS CRUD ====================

@router.get("/")
def list_users(db: Session = Depends(get_db)):
    """
    Obtiene todas las entidades.
    Retorna: {"usuarios": [lista de usuarios]}
    """
    try:
        users = db.query(UserModel).all()
        
        # Transformar cada entidad: convertir objetos SQLAlchemy a dict y transformar IDs
        users_dict = []
        for user in users:
            user_dict = {
                'id_usuario': user.id_usuario,
                'nombre_usuario': user.nombre_usuario,
                'correo_usuario': user.correo_usuario,
                'telefono_usuario': user.telefono_usuario,
                'id_reserva': user.id_reserva,
                'fecha_creacion': user.fecha_creacion,
                'fecha_actualizacion': user.fecha_actualizacion,
            }
            users_dict.append(user_dict)
        
        return {"usuarios": users_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener los usuarios: {str(e)}")


@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Crea una nueva entidad.
    Retorna: {"mensaje": "mensaje de éxito", "user": usuario creado}
    """
    try:
        # Crear instancia del modelo con los datos del schema
        db_user = UserModel(
            nombre_usuario=user.nombre_usuario,
            correo_usuario=user.correo_usuario,
            telefono_usuario=user.telefono_usuario,
            id_producto=None  # Opcional, se puede asignar después
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Transformar la respuesta
        user_dict = {
            'id_usuario': db_user.id_usuario,
            'nombre_usuario': db_user.nombre_usuario,
            'correo_usuario': db_user.correo_usuario,
            'telefono_usuario': db_user.telefono_usuario,
            'id_producto': db_user.id_producto,
            'fecha_creacion': db_user.fecha_creacion,
            'fecha_actualizacion': db_user.fecha_actualizacion,
        }
        
        return {
            "mensaje": "Usuario creado correctamente",
            "user": user_dict
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al crear el usuario: {str(e)}")


@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Obtiene una entidad por su ID.
    Retorna: la entidad encontrada o 404 si no existe
    """
    try:
        user = db.query(UserModel).filter(UserModel.id_usuario == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        # Transformar la respuesta
        user_dict = {
            'id_usuario': user.id_usuario,
            'nombre_usuario': user.nombre_usuario,
            'correo_usuario': user.correo_usuario,
            'telefono_usuario': user.telefono_usuario,
            'id_producto': user.id_producto,
            'fecha_creacion': user.fecha_creacion,
            'fecha_actualizacion': user.fecha_actualizacion,
        }
        
        return user_dict
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener el usuario: {str(e)}")


@router.put("/{user_id}")
def update_user(
    user_id: int,
    user_update: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Actualiza una entidad existente.
    Retorna: {"mensaje": "mensaje de éxito", "user": usuario actualizado}
    """
    try:
        user = db.query(UserModel).filter(UserModel.id_usuario == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        # Actualizar todos los campos
        user.nombre_usuario = user_update.nombre_usuario
        user.correo_usuario = user_update.correo_usuario
        user.telefono_usuario = user_update.telefono_usuario
        
        db.commit()
        db.refresh(user)
        
        # Transformar la respuesta
        user_dict = {
            'id_usuario': user.id_usuario,
            'nombre_usuario': user.nombre_usuario,
            'correo_usuario': user.correo_usuario,
            'telefono_usuario': user.telefono_usuario,
            'fecha_creacion': user.fecha_creacion,
            'fecha_actualizacion': user.fecha_actualizacion,
        }
        
        return {
            "mensaje": "Usuario actualizado",
            "user": user_dict
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al actualizar el usuario: {str(e)}")


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Elimina una entidad.
    Valida Foreign Keys antes de eliminar.
    Retorna: {"mensaje": "mensaje de éxito"}
    """
    try:
        user = db.query(UserModel).filter(UserModel.id_usuario == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        # ==================== VALIDACIÓN DE FOREIGN KEYS ====================
        # En este ejemplo, User no tiene relaciones, pero si las tuviera:
        # 
        # registros_relacionados = db.query(EntidadRelacionadaModel).filter(
        #     EntidadRelacionadaModel.id_usuario == user_id
        # ).first()
        # 
        # if registros_relacionados:
        #     raise HTTPException(
        #         status_code=400,
        #         detail="No se puede eliminar este usuario porque tiene registros relacionados."
        #     )
        
        db.delete(user)
        db.commit()
        
        return {"mensaje": "Usuario eliminado"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al eliminar el usuario: {str(e)}")

