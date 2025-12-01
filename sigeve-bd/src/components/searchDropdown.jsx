import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Autocomplete, 
  Box,
  Typography
} from '@mui/material';

export default function SearchDropdown({ 
  data, 
  onFilterSelect, 
  filterType, 
  label,
  width = 300 
}) {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  // Mapeo de tipos de filtro a campos de datos
  const fieldMap = {
    cliente: 'cliente',
    pais: 'pais', 
    ciudad: 'ciudad',
    producto: 'producto',
    categoria: 'categoria',
    pedido: 'idPedido',
    region: 'region'
  };

  // Extraer opciones únicas basadas en el tipo de filtro
  useEffect(() => {
    if (data && data.length > 0 && fieldMap[filterType]) {
      const field = fieldMap[filterType];
      const opcionesUnicas = [...new Set(data.map(item => item[field]))]
        .filter(item => item != null && item !== '') // Filtrar nulos/vacíos
        .sort();
      setOptions(opcionesUnicas);
    }
  }, [data, filterType]);

  const handleChange = (event, newValue) => {
    setSelectedValue(newValue);
    onFilterSelect(newValue || '');
  };

  return (
    <Box sx={{ width }}>
      <Autocomplete
        value={selectedValue}
        onChange={handleChange}
        options={options}
        getOptionLabel={(option) => option?.toString() || ''}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label || `Buscar ${filterType}...`}
            variant="outlined"
            size="small"
          />
        )}
        freeSolo
        clearOnBlur={false}
        renderOption={(props, option) => (
          <li {...props}>
            <Typography noWrap>{option}</Typography>
          </li>
        )}
      />
    </Box>
  );
}