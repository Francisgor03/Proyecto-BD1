import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import CardStat from './CardStat';

export default function DashboardSection({ title, subtitle, stats = [], ChartNode, DetailsNode }) {
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--text)' }}>{title}</Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'var(--muted)' }}>{subtitle}</Typography>
        )}
      </Box>

      {/* KPI row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        {stats.map((s, i) => (
          <CardStat key={i} title={s.title} value={s.value} delta={s.delta} icon={s.icon} color={s.color} />
        ))}
      </Box>

      {/* Chart area */}
      <Paper sx={{ p: 2, borderRadius: 2, mb: 2, background: 'var(--card-bg)', border: '1px solid rgba(0,0,0,0.04)', boxShadow: 'var(--card-shadow)' }}>
        {ChartNode}
      </Paper>

      {/* Details area (table / list) */}
      <Paper sx={{ p: 1.5, borderRadius: 2, background: 'var(--card-bg)', border: '1px solid rgba(0,0,0,0.04)', boxShadow: 'var(--card-shadow)' }}>
        {DetailsNode}
      </Paper>
    </Box>
  );
}
