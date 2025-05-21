import { Box, Card, CardContent, CardHeader } from '@mui/material';
import React, { type PropsWithChildren } from 'react';

type PageProps = {
  title: string;
};

export const Page: React.FC<PropsWithChildren<PageProps>> = ({ children, title }) => (
  <Box>
    <Card>
      <CardHeader
        title={title}
        sx={{ textAlign: 'center', textTransform: 'uppercase' }}
        slotProps={{ title: { variant: 'h4' } }}
      />
      <CardContent>{children}</CardContent>
    </Card>
  </Box>
);
