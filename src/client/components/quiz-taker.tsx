import { Box, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useNavigate } from 'react-router';
import { MultipleChoiceQuestion } from './multiple-choice-question';
import { Page } from './page';
import { useGetQuestionsByCategoryDifficultyAndCountQuery } from '../redux/api/trivia';

export const QuizTaker: React.FC = () => {
  const navigate = useNavigate();
  const { category, difficulty, numberOfQuestions, selectedAnswers, correctAnswers } = useSelector(
    (state: RootState) => state.quiz,
  );
  const { data: questions } = useGetQuestionsByCategoryDifficultyAndCountQuery(
    { category: category!, difficulty: difficulty!, count: numberOfQuestions! },
    { skip: !category || !difficulty || !numberOfQuestions },
  );

  const hasAnsweredAllQuestions = selectedAnswers.every((answer) => answer !== '');
  const hasSubmittedQuiz = correctAnswers.length > 0;

  const handleSubmitQuiz = () => {
    console.log('\n~~~ Quiz submitted ~~~');
  };

  // Redirect to the quiz maker if the quiz is not set
  useEffect(() => {
    if (!category || !difficulty || !numberOfQuestions) {
      navigate('/');
    }
  }, [category, difficulty, numberOfQuestions, navigate]);

  return (
    <Page title={`${category} Quiz`} sx={{ display: 'flex', justifyContent: 'center', px: 3 }}>
      <Box display='inline-flex' flexDirection='column' gap={2} pb={2}>
        {questions?.map((item, index) => (
          <MultipleChoiceQuestion key={item.question} item={item} index={index} />
        ))}
        <Box sx={{ alignSelf: 'center', textAlign: 'center', width: '66%', height: '24px' }}>
          {hasSubmittedQuiz ? 'You scored X out of Y' : ''}
        </Box>
        {!hasSubmittedQuiz && (
          <Button
            variant='contained'
            onClick={handleSubmitQuiz}
            disabled={!hasAnsweredAllQuestions}
          >
            {hasAnsweredAllQuestions ? 'Submit' : 'Answer all questions before submitting'}
          </Button>
        )}
      </Box>
    </Page>
  );
};
