import type { SelectChangeEvent } from '@mui/material';
import { InputLabel, Box, FormControl, Typography, Select, MenuItem, Button } from '@mui/material';
import React, { useState } from 'react';
import { Page } from './page';
import {
  useGetAllCategoriesQuery,
  useGetDifficultiesByCategoryQuery,
  useGetQuestionsByCategoryAndDifficultyQuery,
} from '../redux/api/trivia';

const numberOfQuestionsOptions = [
  { value: '3', label: 'Three' },
  { value: '5', label: 'Five' },
  { value: '10', label: 'Ten' },
];

export const QuizMaker: React.FC = () => {
  const [category, setCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [numberOfQuestions, setNumberOfQuestions] = useState<string>('');
  const { data: categories } = useGetAllCategoriesQuery();
  const { data: difficulties } = useGetDifficultiesByCategoryQuery({ category });
  const { data: questions } = useGetQuestionsByCategoryAndDifficultyQuery({ category, difficulty });

  const numberOptionsToShow = numberOfQuestionsOptions.filter(
    (option) => Number(option.value) <= Number(questions?.length),
  );

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setCategory(e.target.value);
    setDifficulty('');
    setNumberOfQuestions('');
  };

  const handleDifficultyChange = (e: SelectChangeEvent<string>) => {
    setDifficulty(e.target.value);
    setNumberOfQuestions('');
  };

  const handleNumberOfQuestionsChange = (e: SelectChangeEvent<string>) => {
    setNumberOfQuestions(e.target.value);
  };

  return (
    <Page title='Quiz Maker'>
      <Box display='flex' alignItems='center' gap={1}>
        <FormControl sx={{ flex: 3 }}>
          <InputLabel id='category-label'>Category</InputLabel>
          <Select
            labelId='category-label'
            value={category}
            label='Category'
            onChange={handleCategoryChange}
            size='medium'
            disabled={!categories}
          >
            {categories?.map((cat: any) => (
              <MenuItem key={cat.id} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1 }}>
          <InputLabel id='difficulty-label'>Difficulty</InputLabel>
          <Select
            labelId='difficulty-label'
            value={difficulty}
            label='Difficulty'
            onChange={handleDifficultyChange}
            size='medium'
            disabled={!categories || !difficulties}
            sx={{ textTransform: 'capitalize' }}
          >
            {difficulties?.map((difficulty: any) => (
              <MenuItem key={difficulty} value={difficulty} sx={{ textTransform: 'capitalize' }}>
                {difficulty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1 }}>
          <InputLabel id='number-of-questions-label'>Quantity</InputLabel>
          <Select
            labelId='number-of-questions-label'
            value={numberOfQuestions}
            label='Quantity'
            onChange={handleNumberOfQuestionsChange}
            size='medium'
            disabled={!categories || !difficulties || !questions}
          >
            {numberOptionsToShow.map((numberOption: any) => (
              <MenuItem key={numberOption.value} value={numberOption.value}>
                {numberOption.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant='outlined'
          size="large"
          sx={{ py: 1.75 }}
          disabled={!category || !difficulty || !numberOfQuestions}
        >
          Create
        </Button>
      </Box>
    </Page>
  );
};
