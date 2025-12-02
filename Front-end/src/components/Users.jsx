/**
 * Componente para la entidad Users (Usuarios)
 * Ejemplo de implementación usando la plantilla TEMPLATE_COMPONENT.jsx
 * NO crear archivo CSS separado - usar App.css
 */

import React from 'react';
import { useUsers } from '../hooks/useUsers';

const Users = () => {
  const {
    users,
    loading,
    showForm,
    editingId,
    formData,
    errors,
    handleFieldChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    toggleForm
  } = useUsers();

  return (
    <div className="users-container">
      {/* ==================== ENCABEZADO ==================== */}
      <div className="section-header">
        <h2>Usuarios</h2>
        <button className="btn-primary" onClick={toggleForm}>
          {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {/* ==================== FORMULARIO ==================== */}
      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Usuario *</label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              value={formData.nombre_usuario}
              onChange={(e) => handleFieldChange('nombre_usuario', e.target.value)}
              className={errors.nombre_usuario ? 'error' : ''}
            />
            {errors.nombre_usuario && <span className="error-message">{errors.nombre_usuario}</span>}
          </div>
          
          <div className="form-group">
            <label>Correo Electrónico *</label>
            <input
              type="email"
              placeholder="Ej: juan.perez@email.com"
              value={formData.correo_usuario}
              onChange={(e) => handleFieldChange('correo_usuario', e.target.value)}
              className={errors.correo_usuario ? 'error' : ''}
            />
            {errors.correo_usuario && <span className="error-message">{errors.correo_usuario}</span>}
          </div>
          
          <div className="form-group">
            <label>Teléfono *</label>
            <input
              type="tel"
              placeholder="Ej: +57 300 1234567"
              value={formData.telefono_usuario}
              onChange={(e) => handleFieldChange('telefono_usuario', e.target.value)}
              className={errors.telefono_usuario ? 'error' : ''}
            />
            {errors.telefono_usuario && <span className="error-message">{errors.telefono_usuario}</span>}
          </div>
          
          <button type="submit" className="btn-submit">
            {editingId ? 'Actualizar' : 'Crear'} Usuario
          </button>
        </form>
      )}

      {/* ==================== LISTA DE ENTIDADES ==================== */}
      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="cards">
          {users.map((user) => (
            <div key={user.id_usuario} className="card">
              <h3>{user.nombre_usuario}</h3>
              <p>📧 {user.correo_usuario}</p>
              <p>📞 {user.telefono_usuario}</p>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleEdit(user)}>
                  Editar
                </button>
                <button className="btn-delete" onClick={() => handleDelete(user.id_usuario)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;

