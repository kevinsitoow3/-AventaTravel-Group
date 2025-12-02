// Validaciones reutilizables para formularios

export const validations = {
  // Validar nombre (solo letras, espacios y algunos caracteres especiales)
  name: (value) => {
    if (!value || value.trim().length === 0) {
      return 'El nombre es requerido';
    }
    if (value.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value.trim())) {
      return 'El nombre solo puede contener letras y espacios';
    }
    return '';
  },

  // Validar teléfono (solo números, guiones, paréntesis y espacios)
  phone: (value) => {
    if (!value || value.trim().length === 0) {
      return 'El teléfono es requerido';
    }
    // Permite números, espacios, guiones, paréntesis y el signo +
    if (!/^[\d\s\-\+\(\)]+$/.test(value)) {
      return 'El teléfono solo puede contener números y caracteres especiales (+, -, espacios, paréntesis)';
    }
    // Debe tener al menos 7 dígitos numéricos
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      return 'El teléfono debe tener al menos 7 dígitos';
    }
    if (digitsOnly.length > 15) {
      return 'El teléfono no puede tener más de 15 dígitos';
    }
    return '';
  },

  // Validar email
  email: (value) => {
    if (!value || value.trim().length === 0) {
      return 'El correo electrónico es requerido';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  },

  // Validar dirección
  address: (value) => {
    if (!value || value.trim().length === 0) {
      return 'La dirección es requerida';
    }
    if (value.trim().length < 5) {
      return 'La dirección debe tener al menos 5 caracteres';
    }
    return '';
  },

  // Validar texto general (sin números)
  textOnly: (value, fieldName = 'Campo') => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} es requerido`;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value.trim())) {
      return `${fieldName} solo puede contener letras y espacios`;
    }
    return '';
  },

  // Validar número positivo
  positiveNumber: (value, fieldName = 'Campo') => {
    if (!value || value.toString().trim().length === 0) {
      return `${fieldName} es requerido`;
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return `${fieldName} debe ser un número válido`;
    }
    if (num <= 0) {
      return `${fieldName} debe ser mayor a 0`;
    }
    return '';
  },

  // Validar número decimal positivo
  positiveDecimal: (value, fieldName = 'Campo', min = 0.01, allowEqual = false) => {
    if (!value || value.toString().trim().length === 0) {
      return `${fieldName} es requerido`;
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return `${fieldName} debe ser un número válido`;
    }
    const minDisplay = min >= 1000 ? Math.floor(min).toLocaleString() : min;
    if (allowEqual) {
      if (num < min) {
        return `${fieldName} debe ser mayor o igual a ${minDisplay}`;
      }
    } else {
      if (num < min) {
        return `${fieldName} debe ser mayor a ${minDisplay}`;
      }
    }
    return '';
  },

  // Validar fecha
  date: (value, fieldName = 'Fecha') => {
    if (!value) {
      return `${fieldName} es requerida`;
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return `${fieldName} debe ser una fecha válida`;
    }
    // La fecha no debe ser futura para fecha de nacimiento
    // Comparar solo las fechas sin la hora
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar a medianoche
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0); // Normalizar a medianoche
    
    if (selectedDate > today) {
      return `${fieldName} no puede ser una fecha futura`;
    }
    return '';
  },

  // Validar fecha y hora
  datetime: (value, fieldName = 'Fecha y hora') => {
    if (!value) {
      return `${fieldName} es requerida`;
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return `${fieldName} debe ser una fecha y hora válida`;
    }
    return '';
  },

  // Validar selección (select)
  select: (value, fieldName = 'Campo') => {
    if (!value || value === '') {
      return `Debe seleccionar ${fieldName.toLowerCase()}`;
    }
    return '';
  },

  // Validar texto con longitud mínima
  textMinLength: (value, minLength, fieldName = 'Campo') => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} es requerido`;
    }
    if (value.trim().length < minLength) {
      return `${fieldName} debe tener al menos ${minLength} caracteres`;
    }
    return '';
  },

  // Validar texto solo letras con longitud mínima
  textOnlyMinLength: (value, minLength, fieldName = 'Campo') => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} es requerido`;
    }
    if (value.trim().length < minLength) {
      return `${fieldName} debe tener al menos ${minLength} caracteres`;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value.trim())) {
      return `${fieldName} solo puede contener letras y espacios`;
    }
    return '';
  },

  // Validar descripción (solo letras y signos de puntuación)
  description: (value, fieldName = 'Descripción') => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} es requerida`;
    }
    if (value.trim().length < 10) {
      return `${fieldName} debe tener al menos 10 caracteres`;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,;:!?()-]+$/.test(value.trim())) {
      return `${fieldName} solo puede contener letras, espacios y signos de puntuación`;
    }
    return '';
  },

  // Validar color (solo letras y espacios)
  color: (value) => {
    if (!value || value.trim().length === 0) {
      return 'El color es requerido';
    }
    if (value.trim().length < 2) {
      return 'El color debe tener al menos 2 caracteres';
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value.trim())) {
      return 'El color solo puede contener letras y espacios';
    }
    return '';
  },

  // Validar estado de mascota (debe ser uno de los valores predefinidos)
  petStatus: (value) => {
    if (!value || value === '') {
      return 'Debe seleccionar el estado de la mascota';
    }
    const validStatuses = [
      'Saludable',
      'En tratamiento',
      'En observación',
      'Crítico',
      'Recuperándose',
      'En cuarentena',
      'Fallecido',
      'Dado en adopción',
      'Pendiente de revisión'
    ];
    if (!validStatuses.includes(value)) {
      return 'Debe seleccionar un estado válido';
    }
    return '';
  },

  // Validar estado de cita (debe ser uno de los valores predefinidos)
  quoteStatus: (value) => {
    if (!value || value === '') {
      return 'Debe seleccionar el estado de la cita';
    }
    const validStatuses = [
      'Programada',
      'Confirmada',
      'En curso',
      'Completada',
      'Cancelada',
      'Reprogramada'
    ];
    if (!validStatuses.includes(value)) {
      return 'Debe seleccionar un estado válido';
    }
    return '';
  },

  // Validar estado (genérico para otros casos)
  status: (value) => {
    if (!value || value.trim().length === 0) {
      return 'El estado es requerido';
    }
    return '';
  },

  // Validar sexo
  gender: (value) => {
    if (!value || value === '') {
      return 'Debe seleccionar el sexo';
    }
    const validGenders = ['Macho', 'Hembra'];
    if (!validGenders.includes(value)) {
      return 'El sexo debe ser Macho o Hembra';
    }
    return '';
  },

  // Validar temperatura (rango razonable para animales)
  temperature: (value) => {
    if (!value || value.toString().trim().length === 0) {
      return 'La temperatura es requerida';
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return 'La temperatura debe ser un número válido';
    }
    if (num < 30 || num > 45) {
      return 'La temperatura debe estar entre 30°C y 45°C';
    }
    return '';
  },

  // Validar peso (rango razonable para animales)
  weight: (value) => {
    if (!value || value.toString().trim().length === 0) {
      return 'El peso es requerido';
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return 'El peso debe ser un número válido';
    }
    if (num <= 0) {
      return 'El peso debe ser mayor a 0';
    }
    if (num > 200) {
      return 'El peso no puede ser mayor a 200 kg';
    }
    return '';
  },

  // Validar que fecha fin sea después de fecha inicio
  dateRange: (startDate, endDate) => {
    if (!startDate || !endDate) {
      return '';
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    return '';
  }
};

// Función helper para validar un formulario completo
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach((field) => {
    const rule = validationRules[field];
    const value = formData[field];
    const error = rule(value, field);
    
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { errors, isValid };
};

