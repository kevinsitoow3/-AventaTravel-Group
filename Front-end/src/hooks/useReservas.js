import { useState, useEffect } from 'react';
import { reservasAPI } from '../services/api';
import { validations } from '../utils/validations';

export const useReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre_destino: '',
    monto_reserva: 0,
    cuotas_reserva: 0
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const data = await reservasAPI.getAll();
      setReservas(data);
    } catch (error) {
      console.error('Error fetching reservas:', error);
      const errorMessage = error.response?.data?.detail || 'Error al cargar las reservas';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.nombre_destino = validations.name(formData.nombre_destino);
    newErrors.monto_reserva = formData.monto_reserva >= 0 ? '' : 'La cantidad debe ser mayor o igual a 0';
    newErrors.cuotas_reserva = formData.cuotas_reserva >= 0 ? '' : 'La cantidad debe ser mayor o igual a 0';
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      let error = '';
      switch (field) {
        case 'nombre_destino':
          error = validations.name(value);
          break;
        case 'monto_reserva':
          const numValue = typeof value === 'number' ? value : parseInt(value) || 0;
          error = numValue >= 0 ? '' : 'La cantidad debe ser mayor o igual a 0';
          break;
        case 'cuotas_reserva':
          error = validations.positiveNumber;
          break;
        default:
          break;
      }
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      if (editingId) {
        await reservasAPI.update(editingId, formData);
        alert('Reserva actualizada exitosamente');
      } else {
        await reservasAPI.create(formData);
        alert('Reserva creada exitosamente');
      }
      resetForm();
      fetchReservas();
    } catch (error) {
      console.error('Error saving reserva:', error);
      const errorMessage = error.response?.data?.detail || 'Error al guardar la reserva';
      alert(errorMessage);
    }
  };

  const handleEdit = (reserva) => {
    setEditingId(reserva.id_reserva);
    setFormData({
      nombre_destino: reserva.nombre_destino,
      monto_reserva: reserva.monto_reserva,
      cuotas_reserva: reserva.cuotas_reserva
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      try {
        await reservasAPI.delete(id);
        alert('Reserva eliminada exitosamente');
        fetchReservas();
      } catch (error) {
        console.error('Error deleting reserva:', error);
        const errorMessage = error.response?.data?.detail || 'Error al eliminar la reserva';
        alert(errorMessage);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre_destino: '',
      monto_reserva: 0,
      cuotas_reserva: 0
    });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      resetForm();
    }
  };

  return {
    reservas,
    loading,
    showForm,
    editingId,
    formData,
    errors,
    setFormData,
    handleFieldChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    toggleForm
  };
};