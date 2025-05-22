import { Box, Button, Typography } from '@mui/material';
import type { QuizQuestion } from '@shared/types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAnswer } from '../redux/slices/quiz';
import type { RootState } from '../redux/store';

export const MultipleChoiceQuestion: React.FC<{ item: QuizQuestion; index: number }> = ({
  item: { question, possible_answers },
  index,
}) => {
  const dispatch = useDispatch();
  const selectedAnswer = useSelector((state: RootState) => state.quiz.selectedAnswers[index]);

  const handleAnswerClick = (answer: string) => {
    dispatch(selectAnswer({ index, answer }));
  };

  return (
    <Box display='flex' flexDirection='column' gap={1} width='unset'>
      <Typography>
        {index + 1}. {decodeHtml(question)}
      </Typography>
      <Box display='flex' flexDirection='row' gap={1}>
        {possible_answers.map((answer) => {
          const isAnswerSelected = selectedAnswer === answer;
          return (
            <Button
              key={answer}
              color='success'
              variant={isAnswerSelected ? 'contained' : 'outlined'}
              sx={{ mb: 2 }}
              onClick={() => handleAnswerClick(answer)}
            >
              {decodeHtml(answer)}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

const decodeHtml = (html: string) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};
