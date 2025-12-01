import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';

export default function ExportExcelButton({ 
  data, 
  filename = 'reporte', 
  buttonText = 'Exportar Excel',
  variant = 'contained',
  color = 'primary',
  startIcon = <DownloadIcon /> 
}) {
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    try {
      // Crear workbook y worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      
      // Generar y descargar archivo
      XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      alert('Error al exportar el archivo Excel');
    }
  };

  return (
    <Button
      variant={variant}
      color={color}
      startIcon={startIcon}
      onClick={exportToExcel}
      disabled={!data || data.length === 0}
    >
      {buttonText}
    </Button>
  );
}