import type { SelectChangeEvent } from '@mui/material';
import { InputLabel, Box, FormControl, Select, MenuItem, Button } from '@mui/material';
import type { Category, Difficulty } from '@shared/types';
import { sortCategoryArrayAlphabetically } from '@shared/utils';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Page } from './page';
import {
  useGetAllCategoriesQuery,
  useGetDifficultiesByCategoryQuery,
  useGetQuestionsCountByCategoryAndDifficultyQuery,
} from '../redux/api/trivia';
import { clearQuiz, createQuiz } from '../redux/slices/quiz';

const numberOfQuestionsOptions = [
  { value: '3', label: 'Three' },
  { value: '5', label: 'Five' },
  { value: '10', label: 'Ten' },
];

export const QuizMaker: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [category, setCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [numberOfQuestions, setNumberOfQuestions] = useState<string>('');
  const { data: categories } = useGetAllCategoriesQuery();
  const { data: difficulties } = useGetDifficultiesByCategoryQuery(
    { category },
    { skip: !category },
  );
  const { data } = useGetQuestionsCountByCategoryAndDifficultyQuery(
    { category, difficulty: difficulty as Difficulty },
    { skip: !category || !difficulty },
  );

  const numberOptionsToShow = numberOfQuestionsOptions.filter(
    (option) => Number(option.value) <= (data?.question_count ?? 0),
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

  const handleCreateQuiz = () => {
    if (!category || !difficulty || !numberOfQuestions || !data?.question_count) return;
    dispatch(
      createQuiz({
        category,
        difficulty: difficulty as Difficulty,
        numberOfQuestions: Number(numberOfQuestions),
      }),
    );
    navigate('/quiz');
  };

  // Clear the quiz when the component mounts
  useEffect(() => {
    dispatch(clearQuiz());
  }, [dispatch]);

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
            {sortCategoryArrayAlphabetically(categories).map((category: Category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
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
            disabled={!categories || !difficulties || !data?.question_count}
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
          size='large'
          sx={{ py: 1.75 }}
          disabled={!category || !difficulty || !numberOfQuestions}
          onClick={handleCreateQuiz}
        >
          Create
        </Button>
      </Box>
    </Page>
  );
};
