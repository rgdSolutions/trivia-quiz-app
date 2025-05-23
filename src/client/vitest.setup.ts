import { vi } from 'vitest';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './utils/network-mock-helpers';

// Mock the network requests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock the React Router navigate
export const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the Redux hooks and actions
export const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

vi.mock('./redux/api/trivia', async () => {
  const actual = await vi.importActual('./redux/api/trivia');
  return {
    ...actual,
    useGetAllCategoriesQuery: () => ({
      data: [
        { id: 1, name: 'Science' },
        { id: 2, name: 'History' },
      ],
    }),
    useGetDifficultiesByCategoryQuery: ({ category }: { category: string }) =>
      category ? { data: ['easy', 'medium', 'hard'] } : { data: undefined },
    useGetQuestionsCountByCategoryAndDifficultyQuery: ({
      category,
      difficulty,
    }: {
      category: string;
      difficulty: string;
    }) => (category && difficulty ? { data: { question_count: 10 } } : { data: undefined }),
  };
});

vi.mock('./redux/slices/quiz', async () => {
  const actual = await vi.importActual('./redux/slices/quiz');
  return {
    ...actual,
    clearQuiz: () => ({ type: 'quiz/clearQuiz' }),
    createQuiz: vi.fn(() => ({ type: 'quiz/createQuiz' })),
  };
});
