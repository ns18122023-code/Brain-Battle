export const INITIAL_QUIZZES = [
  {
    id: 'quiz-react-redux',
    title: '🚀 React + Redux Master Challenge',
    description: 'Test your knowledge on React hooks, Redux Toolkit state, and Firebase real-time sync!',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'Which Redux Toolkit function simplifies creating state slices with auto-generated action creators?',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: 'createSlice', isCorrect: true },
          { text: 'createReducer', isCorrect: false },
          { text: 'combineReducers', isCorrect: false },
          { text: 'configureStore', isCorrect: false }
        ]
      },
      {
        id: 'q2',
        type: 'true_false',
        question: 'In Redux Toolkit, Immer is included out-of-the-box allowing direct mutable syntax inside reducers.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'q3',
        type: 'mcq',
        question: 'Which Firebase Firestore method listens to real-time data updates instantaneously?',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: 'getDoc()', isCorrect: false },
          { text: 'onSnapshot()', isCorrect: true },
          { text: 'fetchRealtime()', isCorrect: false },
          { text: 'subscribeToDoc()', isCorrect: false }
        ]
      },
      {
        id: 'q4',
        type: 'mcq',
        question: 'What helper in Redux Toolkit handles asynchronous logic like API calls or Firebase queries?',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: 'createAsyncThunk', isCorrect: true },
          { text: 'createAsyncAction', isCorrect: false },
          { text: 'useAsyncEffect', isCorrect: false },
          { text: 'dispatchAsync', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'quiz-world-trivia',
    title: '🌍 Ultimate World Trivia & Science',
    description: 'Fast-paced geography, science, and world trivia challenge!',
    category: 'General Knowledge',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    questions: [
      {
        id: 'wq1',
        type: 'mcq',
        question: 'Which planet in our solar system has the highest mountain and deepest valley?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Mars', isCorrect: true },
          { text: 'Jupiter', isCorrect: false },
          { text: 'Venus', isCorrect: false },
          { text: 'Saturn', isCorrect: false }
        ]
      },
      {
        id: 'wq2',
        type: 'true_false',
        question: 'The Great Wall of China is visible to the naked human eye from low Earth orbit without aid.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'wq3',
        type: 'mcq',
        question: 'What is the chemical symbol for Gold on the periodic table?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Ag', isCorrect: false },
          { text: 'Au', isCorrect: true },
          { text: 'Fe', isCorrect: false },
          { text: 'Gd', isCorrect: false }
        ]
      }
    ]
  }
];
