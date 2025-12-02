/**
 * Hook para la entidad Users (Usuarios)
 * Ejemplo de implementación usando la plantilla TEMPLATE_HOOK.js
 */

import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { validations } from '../utils/validations';

export const useUsers = () => {
  // ==================== ESTADOS ====================
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // ==================== FORM DATA ====================
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    correo_usuario: '',
    telefono_usuario: ''
  });
  
  const [errors, setErrors] = useState({});

  // ==================== EFECTOS ====================
  useEffect(() => {
    fetchUsers();
  }, []);

  // ==================== FUNCIONES DE CARGA ====================
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mostrar mensaje de error específico del backend si está disponible
      const errorMessage = error.response?.data?.detail || 'Error al cargar los usuarios';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ==================== VALIDACIÓN ====================
  const validateForm = () => {
    const newErrors = {};
    
    newErrors.nombre_usuario = validations.name(formData.nombre_usuario);
    newErrors.correo_usuario = validations.email(formData.correo_usuario);
    newErrors.telefono_usuario = validations.phone(formData.telefono_usuario);
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // ==================== MANEJO DE CAMBIOS ====================
  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Validar en tiempo real si ya hay un error en ese campo
    if (errors[field]) {
      let error = '';
      
      switch (field) {
        case 'nombre_usuario':
          error = validations.name(value);
          break;
        case 'correo_usuario':
          error = validations.email(value);
          break;
        case 'telefono_usuario':
          error = validations.phone(value);
          break;
        default:
          break;
      }
      
      setErrors({ ...errors, [field]: error });
    }
  };

  // ==================== MANEJO DE SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (editingId) {
        await usersAPI.update(editingId, formData);
        alert('Usuario actualizado exitosamente');
      } else {
        await usersAPI.create(formData);
        alert('Usuario creado exitosamente');
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      // Mostrar mensaje de error específico del backend
      const errorMessage = error.response?.data?.detail || 'Error al guardar el usuario';
      alert(errorMessage);
    }
  };

  // ==================== MANEJO DE EDICIÓN ====================
  const handleEdit = (user) => {
    setEditingId(user.id_usuario);
    setFormData({
      nombre_usuario: user.nombre_usuario,
      correo_usuario: user.correo_usuario,
      telefono_usuario: user.telefono_usuario
    });
    setShowForm(true);
  };

  // ==================== MANEJO DE ELIMINACIÓN ====================
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await usersAPI.delete(id);
        alert('Usuario eliminado exitosamente');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        // Mostrar mensaje de error específico del backend
        const errorMessage = error.response?.data?.detail || 'Error al eliminar el usuario';
        alert(errorMessage);
      }
    }
  };

  // ==================== RESET Y TOGGLE ====================
  const resetForm = () => {
    setFormData({
      nombre_usuario: '',
      correo_usuario: '',
      telefono_usuario: ''
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

  // ==================== RETORNO ====================
  return {
    users,
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

