import React, { useState, useEffect } from 'react';
import {
  Brain,
  Heart,
  Star,
  RotateCcw,
  CheckCircle,
  Clock,
  Trophy,
  Sparkles,
  Activity,
  User,
  Users,
  BarChart2,
  Heartbeat,
  Smile,
  BookOpen,
  Zap,
  Coffee,
  SunMedium,
} from 'lucide-react';

interface GameProgress {
  completed: number;
  streak: number;
  totalScore: number;
  lastPlayed: string;
  categoryProgress: {
    alzheimers: number;
    diabetes: number;
    cancer: number;
    mentalHealth: number;
  };
  categoryPoints: {
    alzheimers: number;
    diabetes: number;
    cancer: number;
    mentalHealth: number;
  };
}

interface MemoryCard {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  type: 'image' | 'word' | 'number';
}

interface PatternSequence {
  id: number;
  pattern: string[];
  userInput: string[];
  isComplete: boolean;
}

interface WordAssociation {
  id: number;
  word: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string | null;
  isComplete: boolean;
}

interface NumberSequence {
  id: number;
  sequence: number[];
  userInput: number[];
  isComplete: boolean;
  hint: string;
}

interface DailyReflection {
  id: number;
  prompt: string;
  userResponse: string;
  isComplete: boolean;
}

interface LeaderboardEntry {
  id: number;
  name: string;
  points: number;
}

// --- Helper functions for missing logic ---
const generateWordQuestions = (): WordAssociation[] => [
  {
    id: 1,
    word: 'SUN',
    options: ['MOON', 'STAR', 'SUN'],
    correctAnswer: 'SUN',
    userAnswer: null,
    isComplete: false,
  },
  {
    id: 2,
    word: 'TREE',
    options: ['TREE', 'CAT', 'HOUSE'],
    correctAnswer: 'TREE',
    userAnswer: null,
    isComplete: false,
  },
];

const generateNumberSequence = (): NumberSequence => ({
  id: 1,
  sequence: [1, 2, 3, 4],
  userInput: [],
  isComplete: false,
  hint: 'Enter the sequence separated by commas',
});

const Games: React.FC = () => {
  // === State ===
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    completed: 4,
    streak: 82,
    totalScore: 1200,
    lastPlayed: new Date().toISOString(),
    categoryProgress: {
      alzheimers: 0,
      diabetes: 0,
      cancer: 0,
      mentalHealth: 0,
    },
    categoryPoints: {
      alzheimers: 0,
      diabetes: 0,
      cancer: 0,
      mentalHealth: 0,
    },
  });
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentScore, setCurrentScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Memory Match Game State (Alzheimer's)
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  // Pattern Recognition Game State (Alzheimer's)
  const [patternSequence, setPatternSequence] = useState<PatternSequence | null>(null);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [patternColors] = useState(['🔴', '🟡', '🔵', '🟢', '🟠', '🟣']);

  // Word Association Game State (Alzheimer's)
  const [wordAssociation, setWordAssociation] = useState<WordAssociation | null>(null);
  const [wordQuestions, setWordQuestions] = useState<WordAssociation[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Number Sequence Game State (Alzheimer's)
  const [numberSequence, setNumberSequence] = useState<NumberSequence | null>(null);
  const [userNumberInput, setUserNumberInput] = useState<string>('');

  // Daily Reflection State (Mental Health)
  const [dailyReflection, setDailyReflection] = useState<DailyReflection | null>(null);
  const [reflectionResponse, setReflectionResponse] = useState<string>('');

  // Diabetes Fitness Challenge State
  const [fitnessGoal, setFitnessGoal] = useState<number>(5000); // steps goal
  const [stepsTaken, setStepsTaken] = useState<number>(0);
  const [fitnessCompleted, setFitnessCompleted] = useState(false);

  // Cancer Recovery Meditation State
  const [meditationTime, setMeditationTime] = useState<number>(0);
  const [meditationGoal, setMeditationGoal] = useState<number>(5 * 60); // 5 minutes in seconds
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationCompleted, setMeditationCompleted] = useState(false);

  // Mental Health Gratitude Streak
  const [gratitudeStreak, setGratitudeStreak] = useState<number>(0);
  const [gratitudeInput, setGratitudeInput] = useState<string>('');
  const [gratitudeCompleted, setGratitudeCompleted] = useState(false);

  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { id: 1, name: 'Alice', points: 14000 },
    { id: 2, name: 'Bob', points: 11220 },
    { id: 3, name: 'Charlie', points: 9995 },
    { id: 3, name: 'Ali', points: 8000 },
    { id: 4, name: 'You', points: gameProgress.totalScore },
  ]);

  // === Effects ===

  // Timer effect for games and meditation
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    let interval: number;
    if (meditationActive && !meditationCompleted) {
      interval = window.setInterval(() => {
        setMeditationTime((prev) => {
          if (prev + 1 >= meditationGoal) {
            setMeditationCompleted(true);
            setMeditationActive(false);
            setCurrentScore((score) => score + 10);
            setTimeout(() => completeGame('cancer'), 2000);
            return meditationGoal;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [meditationActive, meditationCompleted, meditationGoal]);

  // === Helper Functions ===

  // Initialize memory cards based on difficulty (Alzheimer's)
  const initializeMemoryCards = () => {
    const cardCount = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
    const cardTypes = difficulty === 'easy' ? ['image'] : difficulty === 'medium' ? ['image', 'word'] : ['image', 'word', 'number'];

    const cards: MemoryCard[] = [];
    const cardContent: Record<string, string[]> = {
      image: ['🏠', '🌳', '🐱', '🌸', '☀️', '🌙', '⭐', '❤️'],
      word: ['HOME', 'TREE', 'CAT', 'FLOWER', 'SUN', 'MOON', 'STAR', 'LOVE'],
      number: ['1', '2', '3', '4', '5', '6', '7', '8'],
    };

    let id = 0;
    for (let i = 0; i < cardCount / 2; i++) {
      const type = cardTypes[Math.floor(Math.random() * cardTypes.length)];
      const content = cardContent[type][i % cardContent[type].length];

      cards.push(
        { id: id++, content, isFlipped: false, isMatched: false, type: type as 'image' | 'word' | 'number' },
        { id: id++, content, isFlipped: false, isMatched: false, type: type as 'image' | 'word' | 'number' }
      );
    }

    return cards.sort(() => Math.random() - 0.5);
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get encouragement message
  const getEncouragementMessage = () => {
    const messages = [
      "Great job! You're doing amazing! 🌟",
      "Keep it up! Every step counts! 💪",
      "Wonderful progress! You're so strong! ❤️",
      "Fantastic work! You should be proud! 🎉",
      "You're doing beautifully! Keep going! ✨",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // === Game Starters ===

  // Alzheimer’s: Memory Match
  const startMemoryMatch = () => {
    setActiveGame('memory');
    setMemoryCards(initializeMemoryCards());
    setFlippedCards([]);
    setMatches(0);
    setCurrentScore(0);
    setGameTime(0);
    setIsPlaying(true);
  };

  // Alzheimer’s: Pattern Recognition
  const startPatternRecognition = () => {
    setActiveGame('pattern');
    const patternLength = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    const pattern = patternColors.slice(0, patternLength).sort(() => Math.random() - 0.5);

    setPatternSequence({
      id: 1,
      pattern,
      userInput: [],
      isComplete: false,
    });
    setUserPattern([]);
    setCurrentScore(0);
    setGameTime(0);
    setIsPlaying(true);
  };

  // Alzheimer’s: Word Association
  const startWordAssociation = () => {
    setActiveGame('word');
    const questions = generateWordQuestions();
    setWordQuestions(questions);
    setCurrentQuestionIndex(0);
    setWordAssociation(questions[0]);
    setCurrentScore(0);
    setGameTime(0);
    setIsPlaying(true);
  };

  // Alzheimer’s: Number Sequence
  const startNumberSequence = () => {
    setActiveGame('number');
    const sequence = generateNumberSequence();
    setNumberSequence(sequence);
    setUserNumberInput('');
    setCurrentScore(0);
    setGameTime(0);
    setIsPlaying(true);
  };

  // Mental Health: Daily Reflection (Journaling)
  const startDailyReflection = () => {
    setActiveGame('reflection');
    const prompts = [
      "What made you smile today?",
      "What is one thing you're grateful for?",
      "What was the best part of your day?",
      "What did you learn today?",
      "What are you looking forward to tomorrow?",
    ];

    setDailyReflection({
      id: 1,
      prompt: prompts[Math.floor(Math.random() * prompts.length)],
      userResponse: '',
      isComplete: false,
    });
    setReflectionResponse('');
    setCurrentScore(0);
    setGameTime(0);
    setIsPlaying(true);
  };

  // Diabetes: Fitness Challenge (Step Goal)
  const startFitnessChallenge = () => {
    setActiveGame('fitness');
    setStepsTaken(0);
    setFitnessCompleted(false);
    setCurrentScore(0);
    setGameTime(0);
    setIsPlaying(true);
  };

  // Cancer Recovery: Meditation
  const startMeditation = () => {
    setActiveGame('meditation');
    setMeditationTime(0);
    setMeditationCompleted(false);
    setMeditationActive(false);
    setCurrentScore(0);
    setGameTime(0);
    setIsPlaying(false);
  };

  // Mental Health: Gratitude Streak
  const startGratitude = () => {
    setActiveGame('gratitude');
    setGratitudeInput('');
    setGratitudeCompleted(false);
    setCurrentScore(0);
    setGameTime(0);
    setIsPlaying(false);
  };

  // === Game Logic Handlers ===

  // Memory Match handlers
  const handleCardFlip = (cardId: number) => {
    if (flippedCards.length >= 2 || flippedCards.includes(cardId)) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setMemoryCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, isFlipped: true } : card))
    );

    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        checkForMatch(newFlippedCards);
      }, 1000);
    }
  };

  const checkForMatch = (flipped: number[]) => {
    const [firstId, secondId] = flipped;
    const firstCard = memoryCards.find((card) => card.id === firstId);
    const secondCard = memoryCards.find((card) => card.id === secondId);

    if (firstCard && secondCard && firstCard.content === secondCard.content) {
      setMemoryCards((prev) =>
        prev.map((card) =>
          card.id === firstId || card.id === secondId ? { ...card, isMatched: true } : card
        )
      );
      setMatches((prev) => prev + 1);
      setCurrentScore((prev) => prev + 10);
    } else {
      setMemoryCards((prev) =>
        prev.map((card) =>
          card.id === firstId || card.id === secondId ? { ...card, isFlipped: false } : card
        )
      );
    }
    setFlippedCards([]);
  };

  // Pattern Recognition handlers
  const handlePatternInput = (color: string) => {
    if (!patternSequence || patternSequence.isComplete) return;

    const newUserPattern = [...userPattern, color];
    setUserPattern(newUserPattern);

    if (newUserPattern.length === patternSequence.pattern.length) {
      checkPattern(newUserPattern);
    }
  };

  const checkPattern = (userInput: string[]) => {
    if (!patternSequence) return;

    const isCorrect = userInput.every((color, index) => color === patternSequence.pattern[index]);

    if (isCorrect) {
      setCurrentScore((prev) => prev + 20);
      setPatternSequence((prev) => (prev ? { ...prev, isComplete: true } : null));
      setTimeout(() => {
        completeGame('alzheimers');
      }, 2000);
    } else {
      setUserPattern([]);
      setCurrentScore((prev) => Math.max(0, prev - 5));
    }
  };

  // Word Association handlers
  const handleWordAnswer = (answer: string) => {
    if (!wordAssociation) return;

    const isCorrect = answer === wordAssociation.correctAnswer;
    setWordAssociation((prev) => (prev ? { ...prev, userAnswer: answer, isComplete: true } : null));

    if (isCorrect) {
      setCurrentScore((prev) => prev + 15);
    }

    setTimeout(() => {
      if (currentQuestionIndex < wordQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setWordAssociation(wordQuestions[currentQuestionIndex + 1]);
      } else {
        completeGame('alzheimers');
      }
    }, 1500);
  };

  // Number Sequence handlers
  const handleNumberInput = (input: string) => {
    setUserNumberInput(input);
  };

  const checkNumberSequence = () => {
    if (!numberSequence || !userNumberInput) return;

    const userNumbers = userNumberInput
      .split(',')
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));
    const isCorrect =
      userNumbers.length === numberSequence.sequence.length &&
      userNumbers.every((num, index) => num === numberSequence.sequence[index]);

    if (isCorrect) {
      setCurrentScore((prev) => prev + 25);
      setNumberSequence((prev) => (prev ? { ...prev, isComplete: true } : null));
      setTimeout(() => {
        completeGame('alzheimers');
      }, 2000);
    } else {
      setUserNumberInput('');
      setCurrentScore((prev) => Math.max(0, prev - 3));
    }
  };

  // Daily Reflection handlers
  const handleReflectionSubmit = () => {
    if (!dailyReflection || !reflectionResponse.trim()) return;

    setDailyReflection((prev) =>
      prev
        ? {
            ...prev,
            userResponse: reflectionResponse,
            isComplete: true,
          }
        : null
    );

    setCurrentScore((prev) => prev + 10);

    setTimeout(() => {
      completeGame('mentalHealth');
    }, 1000);
  };

  // Fitness Challenge handlers (Diabetes)
  const handleAddSteps = (steps: number) => {
    if (fitnessCompleted) return;
    const newSteps = stepsTaken + steps;
    setStepsTaken(newSteps);
    if (newSteps >= fitnessGoal) {
      setFitnessCompleted(true);
      setCurrentScore((prev) => prev + 20);
      setTimeout(() => completeGame('diabetes'), 2000);
    }
  };

  // Meditation handlers (Cancer Recovery)
  const toggleMeditation = () => {
    if (meditationCompleted) return;
    setMeditationActive((active) => !active);
  };

  // Gratitude handlers (Mental Health)
  const handleGratitudeSubmit = () => {
    if (!gratitudeInput.trim()) return;
    setGratitudeCompleted(true);
    setGratitudeStreak((prev) => prev + 1);
    setCurrentScore((prev) => prev + 10);
    setTimeout(() => completeGame('mentalHealth'), 1000);
  };

  // === Completion ===
  const completeGame = (category: 'alzheimers' | 'diabetes' | 'cancer' | 'mentalHealth') => {
    setIsPlaying(false);

    setGameProgress((prev) => {
      const newCompleted = prev.completed + 1;
      const newStreak = prev.streak + 1;
      const newTotalScore = prev.totalScore + currentScore;

      // Update category progress and points
      const newCategoryProgress = { ...prev.categoryProgress };
      const newCategoryPoints = { ...prev.categoryPoints };

      newCategoryProgress[category] = (newCategoryProgress[category] || 0) + 1;
      newCategoryPoints[category] = (newCategoryPoints[category] || 0) + currentScore;

      // Update leaderboard with current user (assumed id=4)
      setLeaderboard((lb) => {
        const existing = lb.find((entry) => entry.id === 4);
        if (existing) {
          const updated = lb.map((entry) =>
            entry.id === 4 ? { ...entry, points: newTotalScore } : entry
          );
          return updated.sort((a, b) => b.points - a.points);
        } else {
          const updated = [...lb, { id: 4, name: 'You', points: newTotalScore }];
          return updated.sort((a, b) => b.points - a.points);
        }
      });

      return {
        ...prev,
        completed: newCompleted,
        streak: newStreak,
        totalScore: newTotalScore,
        lastPlayed: new Date().toISOString(),
        categoryProgress: newCategoryProgress,
        categoryPoints: newCategoryPoints,
      };
    });
  };

  // Reset game and activity states
  const resetGame = () => {
    setActiveGame(null);
    setIsPlaying(false);
    setGameTime(0);
    setCurrentScore(0);

    // Reset Alzheimer’s games
    setMemoryCards([]);
    setFlippedCards([]);
    setMatches(0);
    setPatternSequence(null);
    setUserPattern([]);
    setWordAssociation(null);
    setWordQuestions([]);
    setCurrentQuestionIndex(0);
    setNumberSequence(null);
    setUserNumberInput('');

    // Reset Mental Health
    setDailyReflection(null);
    setReflectionResponse('');
    setGratitudeInput('');
    setGratitudeCompleted(false);

    // Reset Diabetes
    setStepsTaken(0);
    setFitnessCompleted(false);

    // Reset Cancer Recovery
    setMeditationTime(0);
    setMeditationActive(false);
    setMeditationCompleted(false);
  };

  // === Render ===

  // Leaderboard component
  const Leaderboard: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center">
        <Users className="mr-2" size={28} />
        Leaderboard
      </h2>
      <ol className="list-decimal list-inside space-y-2 text-gray-800">
        {leaderboard.map((entry, idx) => {
          // Generate a random image for each leaderboard entry
          const gender = Math.random() > 0.5 ? 'men' : 'women';
          const imgId = Math.floor(Math.random() * 99);
          // Assume id 4 is "You", others are friends if id < 4, else suggested
          const isYou = entry.id === 4;
          const isFriend = entry.id == 1 || entry.id == 3;
          return (
            <li
              key={entry.id}
              className={`flex justify-between items-center p-2 rounded ${
                isYou ? 'bg-purple-100 font-semibold' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={`https://randomuser.me/api/portraits/${gender}/${imgId}.jpg`}
                  alt={entry.name}
                  className="w-8 h-8 rounded-full object-cover border border-purple-200"
                />
                <span>{entry.name}</span>
                {isYou ? (
                  <p></p>
                ) : isFriend ? (
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Friend</span>
                ) : (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-gray-700 text-xs rounded-full">Connect</span>
                )}
                {isYou && (
                  <span className="ml-4 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    Catch up with the leaders!
                  </span>
                )}
              </div>
              <span>{entry.points} pts</span>
            </li>
          );
        })}
      </ol>
    </div>
  );

  // Main menu with categories and activities
  if (!activeGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
            {/* --- Knee Replacement Surgery Section --- */}
        <section className="mb-10">
          <div className="flex items-center mb-4">
            <Activity className="text-blue-700 mr-3" size={32} />
            <h2 className="text-3xl font-bold text-blue-700">
              Knee Replacement Recovery: Your Progress & Activities
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {/* Example progress cards */}
            <div className="p-6 bg-blue-50 rounded-lg flex flex-col items-center">
              <span className="text-5xl mb-2">🚶‍♂️</span>
              <h3 className="font-semibold text-lg text-blue-700 mb-1">Walking Practice</h3>
              <p className="text-gray-700 text-center mb-2">Track your daily walking progress and milestones.</p>
              <div className="text-blue-600 font-bold">Week 6: Walking with cane</div>
            </div>
            <div className="p-6 bg-green-50 rounded-lg flex flex-col items-center">
              <span className="text-5xl mb-2">🦵</span>
              <h3 className="font-semibold text-lg text-green-700 mb-1">Stretching & Mobility</h3>
              <p className="text-gray-700 text-center mb-2">Gentle stretches to improve knee flexibility and strength.</p>
              <div className="text-green-600 font-bold">Goal: Return to hiking by summer 2024</div>
            </div>
            <div className="p-6 bg-yellow-50 rounded-lg flex flex-col items-center">
              <span className="text-5xl mb-2">🧘‍♂️</span>
              <h3 className="font-semibold text-lg text-yellow-700 mb-1">Balance & Mindfulness</h3>
              <p className="text-gray-700 text-center mb-2">Balance exercises and meditation for holistic recovery.</p>
              <div className="text-yellow-600 font-bold">Physical therapy 3x/week</div>
            </div>
          </div>
        </section>
        {/* Overall Progress */}
          <section className="bg-white rounded-lg shadow-lg p-6 mb-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center">
              <Trophy className="mr-2" size={28} />
              Your Progress
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-extrabold text-blue-600">{gameProgress.completed}</div>
                <div className="text-gray-600">Games Completed</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-yellow-500">{gameProgress.streak}</div>
                <div className="text-gray-600">Day Streak</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-red-600">{gameProgress.totalScore}</div>
                <div className="text-gray-600">Total Points</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  {new Date(gameProgress.lastPlayed).toLocaleDateString()}
                </div>
                <div className="text-gray-600">Last Played</div>
              </div>
            </div>
          </section>

          {/* Leaderboard */}
          <Leaderboard />

          {/* Encouragement */}
          <section className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-6 mt-8 text-center max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-purple-800 mb-2">
              You're doing great! 🌟
            </h3>
            <p className="text-purple-700 max-w-xl mx-auto">
              Remember, every small step in your healing journey is a victory worth celebrating.
              Take your time, enjoy the process, and be proud of your progress!
            </p>
          </section>

        {/* --- End Knee Replacement Section --- */}

        {/* EXPLORE Section Divider */}
        <div className="max-w-4xl mx-auto my-10 flex items-center">
          <hr className="flex-grow border-t border-purple-300" />
          <span className="mx-4 text-4xl font-bold text-purple-700 tracking-wide">EXPLORE</span>
          <hr className="flex-grow border-t border-purple-300" />
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-purple-700 flex items-center mb-2">
            <Brain className="mr-3" size={36} />
            Healing Through Mind & Body
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            We believe healing is not only medical but also emotional and mental. That’s why our platform includes disease-specific activities and games to support patients in their journey:
          </p>
        </header>

          {/* Categories */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Alzheimer’s */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-blue-700 flex items-center mb-4">
                <Brain className="mr-2" size={28} />
                Alzheimer’s: Memory & Cognition
              </h2>
              <p className="mb-4 text-gray-600">
                Memory-building games and puzzles to keep the mind active.
              </p>
              <div className="space-y-3">
                <button
                  onClick={startMemoryMatch}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Memory Match
                </button>
                <button
                  onClick={startPatternRecognition}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Pattern Recognition
                </button>
                <button
                  onClick={startWordAssociation}
                  className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Word Association
                </button>
                <button
                  onClick={startNumberSequence}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Number Sequence
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-700">
                Completed: {gameProgress.categoryProgress.alzheimers} | Points: {gameProgress.categoryPoints.alzheimers}
              </div>
            </div>

            {/* Diabetes */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-red-600 flex items-center mb-4">
                <Activity className="mr-2" size={28} />
                Diabetes: Fitness & Habits
              </h2>
              <p className="mb-4 text-gray-600">
                Fitness challenges and step goals to encourage healthy daily habits.
              </p>
              <button
                onClick={startFitnessChallenge}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Start Fitness Challenge
              </button>
              <div className="mt-4 text-sm text-gray-700">
                Completed: {gameProgress.categoryProgress.diabetes} | Points: {gameProgress.categoryPoints.diabetes}
              </div>
            </div>

            {/* Cancer Recovery */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-pink-600 flex items-center mb-4">
                <Heart className="mr-2" size={28} />
                Cancer Recovery: Meditation & Wellness
              </h2>
              <p className="mb-4 text-gray-600">
                Guided meditation, breathing exercises, and light activity trackers to improve well-being.
              </p>
              <button
                onClick={startMeditation}
                className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Start Meditation
              </button>
              <div className="mt-4 text-sm text-gray-700">
                Completed: {gameProgress.categoryProgress.cancer} | Points: {gameProgress.categoryPoints.cancer}
              </div>
            </div>

            {/* Mental Health */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-purple-700 flex items-center mb-4">
                <Smile className="mr-2" size={28} />
                Mental Health: Journaling & Gratitude
              </h2>
              <p className="mb-4 text-gray-600">
                Journaling prompts, gratitude streaks, and stress-relief games.
              </p>
              <button
                onClick={startDailyReflection}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors mb-3"
              >
                Daily Reflection
              </button>
              <button
                onClick={startGratitude}
                className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Gratitude Streak
              </button>
              <div className="mt-4 text-sm text-gray-700">
                Completed: {gameProgress.categoryProgress.mentalHealth} | Points: {gameProgress.categoryPoints.mentalHealth}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Diabetes Fitness Challenge UI
  if (activeGame === 'fitness') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-600 flex items-center">
              <Activity className="mr-2" size={28} />
              Fitness Challenge
            </h2>
            <button
              onClick={resetGame}
              className="text-gray-600 hover:text-red-600 flex items-center"
            >
              <RotateCcw className="mr-1" size={16} />
              Exit
            </button>
          </div>
          <p className="mb-4 text-gray-700">
            Your daily step goal: <strong>{fitnessGoal.toLocaleString()}</strong> steps
          </p>
          <p className="mb-6 text-gray-700">
            Steps taken: <strong>{stepsTaken.toLocaleString()}</strong>
          </p>
          <div className="flex space-x-4 justify-center mb-6">
            {[100, 500, 1000].map((step) => (
              <button
                key={step}
                onClick={() => handleAddSteps(step)}
                disabled={fitnessCompleted}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                +{step} steps
              </button>
            ))}
          </div>
          {fitnessCompleted && (
            <div className="text-center text-green-600 font-semibold text-xl">
              Congratulations! You reached your step goal! 🎉
            </div>
          )}
        </div>
      </div>
    );
  }

  // Cancer Recovery Meditation UI
  if (activeGame === 'meditation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-pink-600 flex items-center">
              <Heart className="mr-2" size={28} />
              Guided Meditation
            </h2>
            <button
              onClick={resetGame}
              className="text-gray-600 hover:text-pink-600 flex items-center"
            >
              <RotateCcw className="mr-1" size={16} />
              Exit
            </button>
          </div>
          <p className="mb-4 text-gray-700">
            Meditation goal: {Math.floor(meditationGoal / 60)} minutes
          </p>
          <p className="mb-6 text-gray-700 text-4xl font-mono">
            {formatTime(meditationTime)}
          </p>
          <button
            onClick={toggleMeditation}
            disabled={meditationCompleted}
            className={`px-8 py-3 rounded-lg text-white text-lg font-semibold ${
              meditationActive ? 'bg-pink-700 hover:bg-pink-800' : 'bg-pink-600 hover:bg-pink-700'
            } ${meditationCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {meditationActive ? 'Pause' : meditationCompleted ? 'Completed' : 'Start'}
          </button>
          {meditationCompleted && (
            <div className="mt-6 text-green-600 font-semibold text-xl">
              Well done! You completed your meditation session. 🌸
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mental Health Gratitude UI
  if (activeGame === 'gratitude') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-700 flex items-center">
              <Smile className="mr-2" size={28} />
              Gratitude Streak
            </h2>
            <button
              onClick={resetGame}
              className="text-gray-600 hover:text-purple-700 flex items-center"
            >
              <RotateCcw className="mr-1" size={16} />
              Exit
            </button>
          </div>
          <p className="mb-4 text-gray-700">
            Write something you are grateful for today:
          </p>
          <textarea
            value={gratitudeInput}
            onChange={(e) => setGratitudeInput(e.target.value)}
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={gratitudeCompleted}
          />
          <button
            onClick={handleGratitudeSubmit}
            disabled={!gratitudeInput.trim() || gratitudeCompleted}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {gratitudeCompleted ? 'Thank you!' : 'Submit'}
          </button>
          {gratitudeCompleted && (
            <div className="mt-6 text-green-600 font-semibold text-center text-xl">
              Your gratitude has been recorded. Keep up the positive streak! 🌟
            </div>
          )}
          <div className="mt-4 text-gray-700 text-center">
            Current Streak: <strong>{gratitudeStreak}</strong> days
          </div>
        </div>
      </div>
    );
  }

  // Fallback (should not happen)
  return null;
};

export default Games;