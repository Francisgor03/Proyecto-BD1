import React from "react";
import { Box, Typography } from "@mui/material";
import VentasCategoria from "./ventasCategoria/VentasCategoria";
import VentasMensuales from "./ventasMensuales/VentasMensuales";
import ProductosMasVendidos from "./productosMasVendidos/ProductosMasVendidos";

export default function DashboardPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 5, p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: 700 }}>
        Dashboard de Ventas
      </Typography>

      {/* Bloque Ventas por Categoría */}
      <VentasCategoria />

      {/* Bloque Ventas Mensuales */}
      <VentasMensuales />

      {/* Bloque Productos Más Vendidos */}
      <ProductosMasVendidos />
    </Box>
  );
}
