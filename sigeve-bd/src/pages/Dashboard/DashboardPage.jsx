import { Grid, Paper, Typography } from '@mui/material';

export default function DashboardPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5' gutterBottom>
          Bienvenido al Dashboard
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ p: 2 }}>Contenido o tarjetas de resumen</Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ p: 2 }}>Otra sección</Paper>
      </Grid>
    </Grid>
  );
}
