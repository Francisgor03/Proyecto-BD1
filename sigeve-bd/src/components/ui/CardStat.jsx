import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function CardStat({ title, value, delta, icon, color = 'var(--primary)' }) {
  return (
    <Box sx={{
      background: 'var(--card-bg)',
      borderRadius: 2,
      boxShadow: 'var(--card-shadow)',
      p: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      minWidth: 200
    }}>
      <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>{icon}</Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: 'var(--muted)', display: 'block' }}>{title}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{value}</Typography>
      </Box>
      {typeof delta !== 'undefined' && (
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" sx={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
            <ArrowUpwardIcon sx={{ fontSize: 16, color: 'green' }} /> {delta}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
