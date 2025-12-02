"""
Router para la entidad Reserva (Resevas)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import Plan as PlanModel
from schemas import Plan, PlanCreate

# ==================== CONFIGURACIÓN DEL ROUTER ====================
router = APIRouter(prefix="/plan", tags=["Planes"])


# ==================== ENDPOINTS CRUD ====================

@router.get("/")
def list_planes(db: Session = Depends(get_db)):
    """
    Obtiene todas las entidades.
    Retorna: {"reservas": [lista de reservas]}
    """
    try:
        planes = db.query(ReservaModel).all()
        
        # Transformar cada entidad: convertir objetos SQLAlchemy a dict y transformar IDs
        planes_dict = []
        for plan in planes:
            plan_dict = {
                'id_plan': plan.id_plan,
                'nombre_plan': plan.nombre_plan,
                'categoria_plan': plan.categoria_plan,
                'descuento_plan': plan.descuento_plan,
            }
            planes_dict.append(plan_dict)
        
        return {"planes": planes_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener los planes: {str(e)}")


@router.post("/")
def create_plan(plan: PlanCreate, db: Session = Depends(get_db)):
    """
    Crea una nueva entidad.
    Retorna: {"mensaje": "mensaje de éxito", "reserva": reserva creada}
    """
    try:
        # Crear instancia del modelo con los datos del schema
        db_plan = PlanModel(
            id_plan = plan.id_plan,
            nombre_plan = plan.nombre_plan,
            categoria_plan = plan.categoria_plan,
            descuento_plan = plan.descuento_plan,
        )
        
        db.add(db_plan)
        db.commit()
        db.refresh(db_plan)
        
        # Transformar la respuesta
        plan_dict = {
            'id_plan': db_plan.id_plan,
            'nombre_plan': db_plan.nombre_plan,
            'categoria_plan': db_plan.categoria_plan,
            'descuento_plan': db_plan.descuento_plan,
        }
        
        return {
            "mensaje": "Plan creado correctamente",
            "plan": plan_dict
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al crear el nuevo plan: {str(e)}")


@router.put("/{plan_id}")
def update_plan(
    plan_id: int,
    plan_update: PlanCreate,
    db: Session = Depends(get_db)
):
    """
    Actualiza una entidad existente.
    Retorna: {"mensaje": "mensaje de éxito", "reserva": reserva actualizada}
    """
    try:
        plan = db.query(PlanModel).filter(PlanModel.id_plan == plan_id).first()
        
        if not plan:
            raise HTTPException(status_code=404, detail="Plan no encontrado")
        
        # Actualizar todos los campos
        plan.nombre_plan = plan_update.nombre_plan
        plan.categoria_plan = plan_update.categoria_plan
        plan.descuento_plan = plan_update.descuento_plan
        

        
        db.commit()
        db.refresh(plan)
        
        # Transformar la respuesta
        plan_dict = {
            'id_plan': db_plan.id_plan,
            'nombre_plan': db_plan.nombre_plan,
            'categoria_plan': db_plan.categoria_plan,
            'descuento_plan': db_plan.descuento_plan,
        }
        
        return {
            "mensaje": "Plan actualizado",
            "plan": plan_dict
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al actualizar el plan: {str(e)}")


@router.delete("/{plan_id}")
def delete_plan(plan_id: int, db: Session = Depends(get_db)):
    """
    Elimina una entidad.
    Valida Foreign Keys antes de eliminar.
    Retorna: {"mensaje": "mensaje de éxito"}
    """
    try:
        plan = db.query(PlanModel).filter(PlanModel.id_plan == plan_id).first()
        
        if not plan:
            raise HTTPException(status_code=404, detail="Plan no encontrado")
        
        # ==================== VALIDACIÓN DE FOREIGN KEYS ====================
        # Verificar si hay usuarios relacionados con este producto
        from models.models import User as UserModel
        usuarios_relacionados = db.query(UserModel).filter(
            UserModel.id_reserva == plan_id
        ).first()
        
        if usuarios_relacionados:
            raise HTTPException(
                status_code=400,
                detail="No se puede eliminar este plan porque tiene usuarios relacionados."
            )
        
        db.delete(plan)
        db.commit()
        
        return {"mensaje": "Plan eliminado"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al eliminar el plan: {str(e)}")
