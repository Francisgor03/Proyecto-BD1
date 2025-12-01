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
  width = 300, 
  // orderdetaildropdown: Nuevas props para modo avanzado
  advancedMode = false,
  options = [],
  getOptionLabel,
  renderOption,
  loading = false
}) {
  const [internalOptions, setInternalOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  const fieldMap = {
    cliente: 'cliente',
    pais: 'pais', 
    ciudad: 'ciudad',
    producto: 'producto',
    categoria: 'categoria',
    pedido: 'idPedido',
    region: 'region'
  };

  // Modo simple: extraer opciones de data
  useEffect(() => {
    if (!advancedMode && data && data.length > 0 && fieldMap[filterType]) {
      const field = fieldMap[filterType];
      const opcionesUnicas = [...new Set(data.map(item => item[field]))]
        .filter(item => item != null && item !== '')
        .sort();
      setInternalOptions(opcionesUnicas);
    }
  }, [data, filterType, advancedMode]);
  // Usar options proporcionadas en modo avanzado, o internalOptions en modo simple
  const finalOptions = advancedMode ? options : internalOptions;

  const handleChange = (event, newValue) => {
    setSelectedValue(newValue);
    onFilterSelect(newValue || '');
  };

    return (
    <Box sx={{ width }}>
      <Autocomplete
        value={selectedValue}
        onChange={handleChange}
        options={finalOptions}
        getOptionLabel={advancedMode ? getOptionLabel : (option) => option?.toString() || ''}
        loading={loading}
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
        renderOption={advancedMode ? renderOption : (props, option) => (
          <li {...props}>
            <Typography noWrap>{option}</Typography>
          </li>
        )}
      />
    </Box>
  );
}