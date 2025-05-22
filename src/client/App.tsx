import { Box, CssBaseline, Toolbar } from '@mui/material';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router';
import { QuizMaker } from './components/quiz-maker';
import { QuizTaker } from './components/quiz-taker';
import { store } from './redux/store';

export const App = () => {
  return (
    <BrowserRouter>
      <ReduxProvider store={store}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route index element={<QuizMaker />} />
              <Route path='/quiz' element={<QuizTaker />} />
            </Routes>
          </Box>
        </Box>
      </ReduxProvider>
    </BrowserRouter>
  );
};
