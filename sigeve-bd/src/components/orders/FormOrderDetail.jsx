import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography // Asegúrate de tener este import
} from '@mui/material';
import { orderDetailsApi } from '../../services/api';
import SearchDropdown from '../searchDropdown';
console.log('orderDetailsApi:', orderDetailsApi);


// Función auxiliar para cargar productos usando fetch directo
const loadProductsDirect = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/products?page=0&size=1000');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    // Diferentes estructuras posibles de respuesta
    if (data?.content && Array.isArray(data.content)) {
      return data.content;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data?.data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error cargando productos:', error);
    return [];
  }
};

export default function FormOrderDetail({ 
  open, 
  onClose, 
  orderId, 
  orderDetailToEdit, 
  onSave 
}) {
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    unitPrice: '',
    quantity: '1',
    discount: '0'
  });

  // Solo cargar productos en modo inserción
  useEffect(() => {
    if (open && !orderDetailToEdit) {
      loadProducts();
    }
  }, [open, orderDetailToEdit]);

  useEffect(() => {
    if (orderDetailToEdit) {
      // Modo edición
      setFormData({
        productId: orderDetailToEdit.productId.toString(),
        unitPrice: orderDetailToEdit.unitPrice.toString(),
        quantity: orderDetailToEdit.quantity.toString(),
        discount: (orderDetailToEdit.discount * 100).toString()
      });
      // Producto simulado para modo edición
      setSelectedProduct({
        id: orderDetailToEdit.productId,
        productName: `Producto ${orderDetailToEdit.productId}`,
        unitPrice: orderDetailToEdit.unitPrice,
        unitsInStock: 999
      });
    } else {
      // Modo inserción
      setFormData({
        productId: '',
        unitPrice: '',
        quantity: '1',
        discount: '0'
      });
      setSelectedProduct(null);
    }
    setError('');
  }, [orderDetailToEdit, open]);

  const loadProducts = async () => {
    console.log('Cargando productos...');
    setProductLoading(true);
    try {
      // Intento 1: Usar fetch directo (más confiable)
      const productsData = await loadProductsDirect();
      
      if (productsData.length === 0) {
        console.log('No se pudieron cargar productos, usando datos de prueba');
        // Datos de prueba para desarrollo
        setProducts([
          { id: 1, productName: 'Chai', unitPrice: 18.00, unitsInStock: 39 },
          { id: 2, productName: 'Chang', unitPrice: 19.00, unitsInStock: 17 },
          { id: 3, productName: 'Aniseed Syrup', unitPrice: 10.00, unitsInStock: 13 },
        ]);
      } else {
        console.log(`${productsData.length} productos cargados`);
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error crítico cargando productos:', error);
      // Datos de prueba como fallback
      setProducts([
        { id: 1, productName: '[TEST] Producto 1', unitPrice: 10.99, unitsInStock: 50 },
        { id: 2, productName: '[TEST] Producto 2', unitPrice: 15.50, unitsInStock: 30 },
        { id: 3, productName: '[TEST] Producto 3', unitPrice: 8.75, unitsInStock: 100 },
      ]);
    } finally {
      setProductLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    console.log('Producto seleccionado:', product);
    setSelectedProduct(product);
    if (product) {
      setFormData(prev => ({
        ...prev,
        productId: product.id.toString(),
        unitPrice: product.unitPrice.toString()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        productId: '',
        unitPrice: ''
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateQuantityOptions = () => {
    const maxStock = selectedProduct?.unitsInStock || 0;
    const options = [];
    
    // Si no hay producto seleccionado o no hay stock, devolver opciones básicas
    if (!selectedProduct || maxStock === 0) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }
    
    // Limitar a máximo 100 opciones para no sobrecargar el dropdown
    const limit = Math.min(maxStock, 100);
    for (let i = 1; i <= limit; i++) {
      options.push(i);
    }
    
    return options.length > 0 ? options : [1];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('orderDetailsApi object:', orderDetailsApi); //por ahora
    console.log('Has create method?', typeof orderDetailsApi.create); //por ahora

    try {
      // Validaciones
      if (!formData.productId || !formData.unitPrice || !formData.quantity) {
        setError('Todos los campos son requeridos');
        return;
      }

      const quantity = parseInt(formData.quantity);
      const maxStock = selectedProduct?.unitsInStock || 0;
      
      if (quantity > maxStock) {
        setError(`La cantidad (${quantity}) no puede ser mayor al stock disponible (${maxStock})`);
        return;
      }

      const orderDetailData = {
        orderId: parseInt(orderId),
        productId: parseInt(formData.productId),
        unitPrice: parseFloat(formData.unitPrice),
        quantity: quantity,
        discount: parseFloat(formData.discount || 0) / 100
      };

      console.log('Guardando detalle:', orderDetailData);

      if (orderDetailToEdit) {
        const productIdToUse = orderDetailToEdit.productId || formData.productId;
        const detailId = `${orderId}-${productIdToUse}`;
        await orderDetailsApi.update(detailId, orderDetailData);
      } else {
        await orderDetailsApi.create(orderDetailData);
      }

      onSave();
      onClose();
    } catch (err) {
      console.error('Error al guardar el detalle:', err);
      setError('Error al guardar el detalle: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {orderDetailToEdit ? 'Editar Detalle de Orden' : 'Agregar Producto a la Orden'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Solo mostrar dropdown en modo inserción */}
            {!orderDetailToEdit ? (
              <SearchDropdown
                data={[]}
                onFilterSelect={handleProductSelect}
                filterType="producto"
                label="Seleccionar Producto *"
                width="100%"
                advancedMode={true}
                options={products}
                getOptionLabel={(option) => option ? `${option.productName} (ID: ${option.id})` : ''}
                loading={productLoading}
                renderOption={(props, option) => {
                  // Convertir unitPrice a número si es necesario
                  const unitPrice = option.unitPrice ? 
                    (typeof option.unitPrice === 'string' ? parseFloat(option.unitPrice) : option.unitPrice) : 
                    0;
                  
                  return (
                    <li {...props}>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {option.productName || `Producto ${option.id}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {option.id} | Precio: ${unitPrice.toFixed(2)} | Stock: {option.unitsInStock || 0}
                        </Typography>
                      </Box>
                    </li>
                  );
                }}
              />
            ) : (
              <TextField
                label="Producto"
                value={`ID: ${formData.productId}`}
                disabled
                fullWidth
                helperText="Modo edición: no se puede cambiar el producto"
              />
            )}

            <TextField
              label="Precio Unitario *"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ step: "0.01", min: "0", readOnly: !!selectedProduct }}
              fullWidth
              helperText={selectedProduct ? "Precio definido por el producto seleccionado" : "Ingrese el precio unitario"}
            />

            <FormControl fullWidth required>
              <InputLabel>Cantidad *</InputLabel>
              <Select
                name="quantity"
                value={formData.quantity}
                label="Cantidad *"
                onChange={handleChange}
                disabled={(!selectedProduct && !orderDetailToEdit) || generateQuantityOptions().length === 0}
              >
                {generateQuantityOptions().map(qty => (
                  <MenuItem key={qty} value={qty}>
                    {qty} {selectedProduct && `(Stock: ${selectedProduct.unitsInStock})`}
                  </MenuItem>
                ))}
              </Select>
              {generateQuantityOptions().length === 0 && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  No hay stock disponible para este producto
                </Typography>
              )}
            </FormControl>

            <TextField
              label="Descuento (%)"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              type="number"
              inputProps={{ step: "0.1", min: "0", max: "100" }}
              fullWidth
              helperText="Ejemplo: 10 para 10% de descuento"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || (!orderDetailToEdit && !selectedProduct)}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {orderDetailToEdit ? 'Actualizar' : 'Agregar Producto'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}