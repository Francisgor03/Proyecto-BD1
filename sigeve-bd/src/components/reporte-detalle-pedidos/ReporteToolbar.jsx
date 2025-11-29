import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as XLSX from 'xlsx';

export default function ReporteToolbar({ onSearch, onDateChange, data }) {
  const [search, setSearch] = useState('');
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    const fechaActual = new Date().toISOString().split('T')[0];
    const nombreArchivo = `detalle_pedidos_${fechaActual}.xlsx`;

    XLSX.writeFile(wb, nombreArchivo);
  };

  const handleSearch = e => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleFechaInicio = date => {
    setFechaInicio(date);
    onDateChange(date, fechaFin);
  };

  const handleFechaFin = date => {
    setFechaFin(date);
    onDateChange(fechaInicio, date);
  };

  return (

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        {/* BUSCADOR */}
        <TextField
          label='Buscar...'
          variant='outlined'
          size='small'
          sx={{ width: 250 }}
          value={search}
          onChange={handleSearch}
        />

        {/* FECHAS */}
        <DatePicker label='Fecha inicio' value={fechaInicio} onChange={handleFechaInicio} />

        <DatePicker label='Fecha fin' value={fechaFin} onChange={handleFechaFin} />

        {/* EXPORTAR */}
        <Button variant='contained' color='success' onClick={exportarExcel} sx={{ height: 40 }}>
          Exportar Excel
        </Button>
      </Box>
  );
}
