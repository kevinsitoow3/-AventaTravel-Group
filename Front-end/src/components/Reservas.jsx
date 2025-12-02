import React from 'react';
import { useReservas } from '../hooks/useReservas';

const Reservas = () => {
  const {
    reservas,
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
  } = useReservas();

  return (
    <div className="reservas-container">
      <div className="section-header">
        <h2>Reservas</h2>
        <button className="btn-primary" onClick={toggleForm}>
          {showForm ? 'Cancelar' : '+ Nuevo Reserva'}
        </button>
      </div>

      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la Reserva *</label>
            <input
              type="text"
              placeholder="Ej: Viaje a Cancun"
              value={formData.nombre_destino}
              onChange={(e) => handleFieldChange('nombre_destino', e.target.value)}
              className={errors.nombre_destino ? 'error' : ''}
            />
            {errors.nombre_reserva && <span className="error-message">{errors.nombre_reserva}</span>}
          </div>
          
          <div className="form-group">
            <label>Monto Total *</label>
            <input
              type="number"
              placeholder="Ej: 4.500.000"
              value={formData.monto_reserva}
              onChange={(e) => handleFieldChange('monto_reserva', parseInt(e.target.value) || 0)}
              className={errors.monto_reserva ? 'error' : ''}
              min="0"
            />
            {errors.monto_reserva && <span className="error-message">{errors.monto_reserva}</span>}
          </div>
          
          <div className="form-group">
            <label>Cuotas Reserva *</label>
            <input
              type="number"
              placeholder="Ej: 5"
              value={formData.cuotas_reserva}
              onChange={(e) => handleFieldChange('cuotas_reserva', e.target.value)}
              className={errors.cuotas_reserva ? 'error' : ''}
            />
            {errors.cuotas_reserva && <span className="error-message">{errors.cuotas_reserva}</span>}
          </div>
          
          <button type="submit" className="btn-submit">
            {editingId ? 'Actualizar' : 'Crear'} Reserva
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="cards">
          {reservas.map((reserva) => (
            <div key={reserva.id_reserva} className="card">
              <h3>{reserva.nombre_destino}</h3>
              <p>📦 Monto: {reserva.monto_reserva}</p>
              <p>🏷️ Cuotas: {reserva.cuotas_reserva}</p>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleEdit(reserva)}>
                  Editar
                </button>
                <button className="btn-delete" onClick={() => handleDelete(reserva.id_reservao)}>
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

export default Reservas;