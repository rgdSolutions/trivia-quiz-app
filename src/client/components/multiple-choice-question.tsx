import { Box, Button, Typography } from '@mui/material';
import type { QuizQuestion } from '@shared/types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAnswer } from '../redux/slices/quiz';
import type { RootState } from '../redux/store';

export const MultipleChoiceQuestion: React.FC<{
  item: QuizQuestion;
  index: number;
}> = ({ item: { question, possible_answers }, index }) => {
  const dispatch = useDispatch();
  const { selectedAnswers, correctAnswers } = useSelector((state: RootState) => state.quiz);
  const selectedAnswer = selectedAnswers[index];
  const correctAnswer = correctAnswers[index];
  const isQuizScored = typeof correctAnswer === 'string' && !!correctAnswer;
  const isAnswerCorrect = isQuizScored && selectedAnswer === correctAnswer;
  const isAnswerIncorrect = isQuizScored && selectedAnswer !== correctAnswer;

  const handleAnswerClick = (answer: string) => {
    if (isQuizScored) return;
    dispatch(selectAnswer({ index, answer }));
  };

  return (
    <Box display='flex' flexDirection='column' gap={1} width='unset'>
      <Typography>
        {index + 1}. {decodeHtml(question)}
      </Typography>
      <Box display='flex' flexDirection='row' gap={1}>
        {possible_answers.map((answer) => {
          const isAnswerSelected = answer === selectedAnswer;
          const buttonVariant =
            isAnswerSelected || answer === correctAnswer ? 'contained' : 'outlined';
          const buttonColor = isAnswerSelected && isAnswerIncorrect ? 'error' : 'success';
          return (
            <Button
              key={answer}
              variant={buttonVariant}
              color={buttonColor}
              sx={{ mb: 2, textTransform: 'none' }}
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
