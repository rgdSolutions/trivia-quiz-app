import { CardHeader } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import React from 'react';

const ImgStyled = styled('img')`
  width: 150px;
  padding-bottom: 25px;
`;

export const Home: React.FC = () => {
  return (
    <Grid size={12}>
      <Card>
        <CardHeader title='trivia-quiz-app' />
        <CardContent>
          <Typography>Your new Project</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
