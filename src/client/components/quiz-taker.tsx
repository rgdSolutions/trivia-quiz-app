import { Box, Button } from '@mui/material';
import { yellow } from '@mui/material/colors';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { MultipleChoiceQuestion } from './multiple-choice-question';
import { Page } from './page';
import type { RootState } from '../redux/store';
import {
  useGetQuestionsByCategoryDifficultyAndCountQuery,
  useSendQuizAnswersMutation,
} from '../redux/api/trivia';
import { clearQuiz } from '../redux/slices/quiz';

export const QuizTaker: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { category, difficulty, numberOfQuestions, selectedAnswers, correctAnswers, score } = useSelector(
    (state: RootState) => state.quiz,
  );
  const { data: questions } = useGetQuestionsByCategoryDifficultyAndCountQuery(
    { category: category!, difficulty: difficulty!, count: numberOfQuestions! },
    { skip: !category || !difficulty || !numberOfQuestions },
  );
  const [sendQuizAnswers] = useSendQuizAnswersMutation();

  const hasAnsweredAllQuestions = selectedAnswers.every((answer) => answer !== '');
  const hasSubmittedQuiz = typeof score === 'number';
  const scoreTextColor = score && score >= 0.4 * numberOfQuestions && score < 0.8 * numberOfQuestions ? 'black' : 'white';
  const scoreBgColor = !hasSubmittedQuiz
    ? 'transparent'
    : score && score >= 0.8 * numberOfQuestions
      ? 'success.main'
      : score && score >= 0.4 * numberOfQuestions
        ? yellow[500]
        : 'error.main';

  const handleSubmitQuiz = () => {
    sendQuizAnswers({ questions: questions!, selectedAnswers: selectedAnswers! });
  };

  const handleStartNewQuiz = () => {
    dispatch(clearQuiz());
    navigate('/');
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
        <Box
          sx={{
            alignSelf: 'center',
            textAlign: 'center',
            width: '66%',
            height: '24px',
            backgroundColor: scoreBgColor,
            color: scoreTextColor,

          }}
        >
          {hasSubmittedQuiz ? `You scored ${score} out of ${numberOfQuestions}` : ''}
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
        {hasSubmittedQuiz && (
          <Button variant='contained' color='secondary' onClick={handleStartNewQuiz}>
            Start new quiz
          </Button>
        )}
      </Box>
    </Page>
  );
};
