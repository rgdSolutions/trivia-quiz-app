import type { SxProps, Theme } from '@mui/material';
import { Box, Card, CardContent, CardHeader } from '@mui/material';
import React, { type PropsWithChildren } from 'react';

type PageProps = {
  title: string;
  sx?: SxProps<Theme>;
};

export const Page: React.FC<PropsWithChildren<PageProps>> = ({
  children,
  title,
  sx = { width: '100%' },
}) => (
  <Box data-testid='page-container' sx={sx}>
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CardHeader
        title={title}
        sx={{ display: 'inline-flex', textTransform: 'uppercase' }}
        slotProps={{ title: { variant: 'h4' } }}
      />
      <CardContent sx={sx}>{children}</CardContent>
    </Card>
  </Box>
);
