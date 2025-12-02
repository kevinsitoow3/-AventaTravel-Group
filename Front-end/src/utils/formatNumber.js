// Función para formatear números con separador de miles usando punto
export const formatNumber = (number) => {
  if (number === null || number === undefined || number === '') {
    return '0';
  }
  const num = typeof number === 'string' ? parseFloat(number) : number;
  if (isNaN(num)) {
    return '0';
  }
  // Convertir a entero y formatear con separador de miles
  const integerPart = Math.floor(Math.abs(num));
  const formatted = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return num < 0 ? `-${formatted}` : formatted;
};

// Función para formatear números con decimales (para peso, temperatura, etc.)
// Solo formatea si el número es >= 1000
export const formatNumberWithDecimals = (number) => {
  if (number === null || number === undefined || number === '') {
    return '';
  }
  const num = typeof number === 'string' ? parseFloat(number) : number;
  if (isNaN(num)) {
    return '';
  }
  // Si el número es menor a 1000, no formatear (solo mostrar tal cual)
  if (Math.abs(num) < 1000) {
    return num.toString();
  }
  // Separar parte entera y decimal
  const parts = num.toString().split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decimalPart = parts[1] ? `.${parts[1]}` : '';
  return num < 0 ? `-${integerPart}${decimalPart}` : `${integerPart}${decimalPart}`;
};

// Función para remover el formato y obtener el número puro
export const unformatNumber = (formattedValue) => {
  if (!formattedValue || formattedValue === '') {
    return '';
  }
  // Remover puntos (separadores de miles) pero mantener decimales
  return formattedValue.toString().replace(/\.(?=\d{3})/g, '');
};

