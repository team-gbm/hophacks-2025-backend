import React, { useState, useEffect } from 'react';
import { Brain, Heart, Star, RotateCcw, CheckCircle, Clock, Trophy, Sparkles } from 'lucide-react';

interface GameProgress {
  completed: number;
  streak: number;
  totalScore: number;
  lastPlayed: string;
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

const Games: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    completed: 0,
    streak: 0,
    totalScore: 0,
    lastPlayed: new Date().toISOString()
  });
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentScore, setCurrentScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Memory Match Game State
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  // Pattern Recognition Game State
  const [patternSequence, setPatternSequence] = useState<PatternSequence | null>(null);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [patternColors] = useState(['🔴', '🟡', '🔵', '🟢', '🟠', '🟣']);

  // Word Association Game State
  const [wordAssociation, setWordAssociation] = useState<WordAssociation | null>(null);
  const [wordQuestions, setWordQuestions] = useState<WordAssociation[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Number Sequence Game State
  const [numberSequence, setNumberSequence] = useState<NumberSequence | null>(null);
  const [userNumberInput, setUserNumberInput] = useState<string>('');

  // Daily Reflection State
  const [dailyReflection, setDailyReflection] = useState<DailyReflection | null>(null);
  const [reflectionResponse, setReflectionResponse] = useState<string>('');

  // Daily Activities
  const [dailyActivities, setDailyActivities] = useState([
    { id: 1, name: 'Memory Match', completed: false, points: 10 },
    { id: 2, name: 'Pattern Recognition', completed: false, points: 15 },
    { id: 3, name: 'Word Association', completed: false, points: 8 },
    { id: 4, name: 'Number Sequence', completed: false, points: 12 },
    { id: 5, name: 'Daily Reflection', completed: false, points: 5 }
  ]);

  // Timer effect
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Initialize memory cards based on difficulty
  const initializeMemoryCards = () => {
    const cardCount = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
    const cardTypes = difficulty === 'easy' ? ['image'] : difficulty === 'medium' ? ['image', 'word'] : ['image', 'word', 'number'];
    
    const cards: MemoryCard[] = [];
    const cardContent: Record<string, string[]> = {
      image: ['🏠', '🌳', '🐱', '🌸', '☀️', '🌙', '⭐', '❤️'],
      word: ['HOME', 'TREE', 'CAT', 'FLOWER', 'SUN', 'MOON', 'STAR', 'LOVE'],
      number: ['1', '2', '3', '4', '5', '6', '7', '8']
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

  // Start Memory Match Game
  const startMemoryMatch = () => {
    setActiveGame('memory');
    setMemoryCards(initializeMemoryCards());
    setFlippedCards([]);
    setMatches(0);
    setCurrentScore(0);
    setGameTime(0);
    setIsPlaying(true);
  };

  // Handle card flip in memory game
  const handleCardFlip = (cardId: number) => {
    if (flippedCards.length >= 2 || flippedCards.includes(cardId)) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setMemoryCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        checkForMatch(newFlippedCards);
      }, 1000);
    }
  };

  // Check for memory match
  const checkForMatch = (flipped: number[]) => {
    const [firstId, secondId] = flipped;
    const firstCard = memoryCards.find(card => card.id === firstId);
    const secondCard = memoryCards.find(card => card.id === secondId);

    if (firstCard && secondCard && firstCard.content === secondCard.content) {
      setMemoryCards(prev => 
        prev.map(card => 
          card.id === firstId || card.id === secondId 
            ? { ...card, isMatched: true }
            : card
        )
      );
      setMatches(prev => prev + 1);
      setCurrentScore(prev => prev + 10);
    } else {
      setMemoryCards(prev => 
        prev.map(card => 
          card.id === firstId || card.id === secondId 
            ? { ...card, isFlipped: false }
            : card
        )
      );
    }
    setFlippedCards([]);
  };

  // Start Pattern Recognition Game
  const startPatternRecognition = () => {
    setActiveGame('pattern');
    const patternLength = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    const pattern = patternColors.slice(0, patternLength).sort(() => Math.random() - 0.5);
    
    setPatternSequence({
      id: 1,
      pattern,
      userInput: [],
      isComplete: false
    });
    setUserPattern([]);
    setCurrentScore(0);
    setGameTime(0);
    setIsPlaying(true);
  };

  // Start Word Association Game
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

  // Generate word association questions
  const generateWordQuestions = (): WordAssociation[] => {
    const questionSets = {
      easy: [
        { word: 'Apple', correct: 'Red', options: ['Red', 'Blue', 'Green', 'Yellow'] },
        { word: 'Sun', correct: 'Hot', options: ['Hot', 'Cold', 'Wet', 'Dark'] },
        { word: 'Cat', correct: 'Meow', options: ['Meow', 'Woof', 'Chirp', 'Roar'] },
        { word: 'Book', correct: 'Read', options: ['Read', 'Eat', 'Sleep', 'Run'] }
      ],
      medium: [
        { word: 'Ocean', correct: 'Blue', options: ['Blue', 'Red', 'Green', 'Yellow'] },
        { word: 'Winter', correct: 'Cold', options: ['Cold', 'Hot', 'Warm', 'Cool'] },
        { word: 'Garden', correct: 'Flowers', options: ['Flowers', 'Cars', 'Books', 'Shoes'] },
        { word: 'Kitchen', correct: 'Cook', options: ['Cook', 'Sleep', 'Drive', 'Read'] }
      ],
      hard: [
        { word: 'Mountain', correct: 'High', options: ['High', 'Low', 'Flat', 'Wide'] },
        { word: 'Library', correct: 'Quiet', options: ['Quiet', 'Loud', 'Bright', 'Dark'] },
        { word: 'Adventure', correct: 'Exciting', options: ['Exciting', 'Boring', 'Calm', 'Quiet'] },
        { word: 'Friendship', correct: 'Trust', options: ['Trust', 'Fear', 'Anger', 'Sadness'] }
      ]
    };

    const selectedSet = questionSets[difficulty];
    return selectedSet.map((q, index) => ({
      id: index + 1,
      word: q.word,
      options: q.options.sort(() => Math.random() - 0.5),
      correctAnswer: q.correct,
      userAnswer: null,
      isComplete: false
    }));
  };

  // Start Number Sequence Game
  const startNumberSequence = () => {
    setActiveGame('number');
    const sequence = generateNumberSequence();
    setNumberSequence(sequence);
    setUserNumberInput('');
    setCurrentScore(0);
    setGameTime(0);
    setIsPlaying(true);
  };

  // Generate number sequence
  const generateNumberSequence = (): NumberSequence => {
    const sequences = {
      easy: [
        { sequence: [1, 2, 3, 4], hint: 'Count up by 1' },
        { sequence: [2, 4, 6, 8], hint: 'Count up by 2' },
        { sequence: [5, 10, 15, 20], hint: 'Count up by 5' }
      ],
      medium: [
        { sequence: [1, 3, 5, 7, 9], hint: 'Odd numbers' },
        { sequence: [2, 4, 8, 16, 32], hint: 'Double each number' },
        { sequence: [1, 1, 2, 3, 5], hint: 'Fibonacci sequence' }
      ],
      hard: [
        { sequence: [1, 4, 9, 16, 25], hint: 'Square numbers' },
        { sequence: [2, 6, 12, 20, 30], hint: 'n × (n+1)' },
        { sequence: [1, 8, 27, 64, 125], hint: 'Cube numbers' }
      ]
    };

    const selectedSet = sequences[difficulty];
    const randomSequence = selectedSet[Math.floor(Math.random() * selectedSet.length)];
    
    return {
      id: 1,
      sequence: randomSequence.sequence,
      userInput: [],
      isComplete: false,
      hint: randomSequence.hint
    };
  };

  // Start Daily Reflection
  const startDailyReflection = () => {
    setActiveGame('reflection');
    const prompts = [
      "What made you smile today?",
      "What is one thing you're grateful for?",
      "What was the best part of your day?",
      "What did you learn today?",
      "What are you looking forward to tomorrow?"
    ];
    
    setDailyReflection({
      id: 1,
      prompt: prompts[Math.floor(Math.random() * prompts.length)],
      userResponse: '',
      isComplete: false
    });
    setReflectionResponse('');
    setCurrentScore(0);
    setGameTime(0);
    setIsPlaying(true);
  };

  // Handle pattern input
  const handlePatternInput = (color: string) => {
    if (!patternSequence || patternSequence.isComplete) return;

    const newUserPattern = [...userPattern, color];
    setUserPattern(newUserPattern);

    if (newUserPattern.length === patternSequence.pattern.length) {
      checkPattern(newUserPattern);
    }
  };

  // Check pattern match
  const checkPattern = (userInput: string[]) => {
    if (!patternSequence) return;

    const isCorrect = userInput.every((color, index) => color === patternSequence.pattern[index]);
    
    if (isCorrect) {
      setCurrentScore(prev => prev + 20);
      setPatternSequence(prev => prev ? { ...prev, isComplete: true } : null);
      setTimeout(() => {
        completeGame('pattern');
      }, 2000);
    } else {
      setUserPattern([]);
      setCurrentScore(prev => Math.max(0, prev - 5));
    }
  };

  // Handle word association answer
  const handleWordAnswer = (answer: string) => {
    if (!wordAssociation) return;

    const isCorrect = answer === wordAssociation.correctAnswer;
    setWordAssociation(prev => prev ? { ...prev, userAnswer: answer, isComplete: true } : null);
    
    if (isCorrect) {
      setCurrentScore(prev => prev + 15);
    }

    // Move to next question or complete game
    setTimeout(() => {
      if (currentQuestionIndex < wordQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setWordAssociation(wordQuestions[currentQuestionIndex + 1]);
      } else {
        completeGame('word');
      }
    }, 1500);
  };

  // Handle number sequence input
  const handleNumberInput = (input: string) => {
    setUserNumberInput(input);
  };

  // Check number sequence
  const checkNumberSequence = () => {
    if (!numberSequence || !userNumberInput) return;

    const userNumbers = userNumberInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const isCorrect = userNumbers.length === numberSequence.sequence.length && 
                     userNumbers.every((num, index) => num === numberSequence.sequence[index]);

    if (isCorrect) {
      setCurrentScore(prev => prev + 25);
      setNumberSequence(prev => prev ? { ...prev, isComplete: true } : null);
      setTimeout(() => {
        completeGame('number');
      }, 2000);
    } else {
      setUserNumberInput('');
      setCurrentScore(prev => Math.max(0, prev - 3));
    }
  };

  // Handle reflection response
  const handleReflectionSubmit = () => {
    if (!dailyReflection || !reflectionResponse.trim()) return;

    setDailyReflection(prev => prev ? { 
      ...prev, 
      userResponse: reflectionResponse, 
      isComplete: true 
    } : null);
    
    setCurrentScore(prev => prev + 10); // Reflection always gives points for participation
    
    setTimeout(() => {
      completeGame('reflection');
    }, 1000);
  };

  // Complete game
  const completeGame = (gameType: string) => {
    setIsPlaying(false);
    setGameProgress(prev => ({
      ...prev,
      completed: prev.completed + 1,
      streak: prev.streak + 1,
      totalScore: prev.totalScore + currentScore,
      lastPlayed: new Date().toISOString()
    }));

    // Mark daily activity as completed
    setDailyActivities(prev => 
      prev.map(activity => 
        activity.name.toLowerCase().includes(gameType) 
          ? { ...activity, completed: true }
          : activity
      )
    );
  };

  // Reset game
  const resetGame = () => {
    setActiveGame(null);
    setIsPlaying(false);
    setGameTime(0);
    setCurrentScore(0);
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
    setDailyReflection(null);
    setReflectionResponse('');
  };

  // Format time
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
      "You're doing beautifully! Keep going! ✨"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (activeGame === 'memory') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Game Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-600 flex items-center">
                <Brain className="mr-2" size={28} />
                Memory Match
              </h2>
              <button
                onClick={resetGame}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <RotateCcw className="mr-1" size={16} />
                Exit Game
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{matches}</div>
                <div className="text-sm text-blue-800">Matches</div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{currentScore}</div>
                <div className="text-sm text-green-800">Score</div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatTime(gameTime)}</div>
                <div className="text-sm text-purple-800">Time</div>
              </div>
            </div>
          </div>

          {/* Memory Cards Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {memoryCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardFlip(card.id)}
                disabled={card.isFlipped || card.isMatched}
                className={`h-20 rounded-lg text-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  card.isMatched
                    ? 'bg-green-200 text-green-800'
                    : card.isFlipped
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {card.isFlipped || card.isMatched ? card.content : '?'}
              </button>
            ))}
          </div>

          {/* Completion Message */}
          {matches === memoryCards.length / 2 && (
            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6 text-center">
              <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Congratulations!</h3>
              <p className="text-green-700 text-lg">{getEncouragementMessage()}</p>
              <p className="text-green-600 mt-2">Final Score: {currentScore} points</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeGame === 'pattern') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Game Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-600 flex items-center">
                <Sparkles className="mr-2" size={28} />
                Pattern Recognition
              </h2>
              <button
                onClick={resetGame}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <RotateCcw className="mr-1" size={16} />
                Exit Game
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{currentScore}</div>
                <div className="text-sm text-green-800">Score</div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatTime(gameTime)}</div>
                <div className="text-sm text-blue-800">Time</div>
              </div>
            </div>
          </div>

          {/* Pattern Display */}
          {patternSequence && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Watch the pattern, then repeat it:</h3>
              <div className="flex justify-center space-x-4 mb-6">
                {patternSequence.pattern.map((color, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-gray-100"
                  >
                    {color}
                  </div>
                ))}
              </div>
              
              <h4 className="text-lg font-semibold mb-4 text-center">Your turn - click the colors in order:</h4>
              <div className="flex justify-center space-x-4 mb-6">
                {userPattern.map((color, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-blue-200"
                  >
                    {color}
                  </div>
                ))}
                {Array.from({ length: patternSequence.pattern.length - userPattern.length }).map((_, index) => (
                  <div
                    key={index + userPattern.length}
                    className="w-12 h-12 rounded-full bg-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-lg font-semibold mb-4 text-center">Choose a color:</h4>
            <div className="flex justify-center space-x-4">
              {patternColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handlePatternInput(color)}
                  disabled={!patternSequence || patternSequence.isComplete}
                  className="w-16 h-16 rounded-full text-3xl hover:scale-110 transition-transform disabled:opacity-50"
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Completion Message */}
          {patternSequence?.isComplete && (
            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6 text-center mt-6">
              <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Excellent!</h3>
              <p className="text-green-700 text-lg">{getEncouragementMessage()}</p>
              <p className="text-green-600 mt-2">Final Score: {currentScore} points</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeGame === 'word') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Game Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-600 flex items-center">
                <Brain className="mr-2" size={28} />
                Word Association
              </h2>
              <button
                onClick={resetGame}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <RotateCcw className="mr-1" size={16} />
                Exit Game
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{currentQuestionIndex + 1}/{wordQuestions.length}</div>
                <div className="text-sm text-orange-800">Question</div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{currentScore}</div>
                <div className="text-sm text-green-800">Score</div>
              </div>
            </div>
          </div>

          {/* Word Association Question */}
          {wordAssociation && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h3 className="text-3xl font-bold text-center mb-8">
                What word best goes with:
              </h3>
              <div className="text-4xl font-bold text-center text-orange-600 mb-8">
                "{wordAssociation.word}"
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {wordAssociation.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordAnswer(option)}
                    disabled={wordAssociation.isComplete}
                    className={`p-4 rounded-lg text-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      wordAssociation.isComplete
                        ? option === wordAssociation.correctAnswer
                          ? 'bg-green-200 text-green-800'
                          : option === wordAssociation.userAnswer
                          ? 'bg-red-200 text-red-800'
                          : 'bg-gray-200 text-gray-600'
                        : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {wordAssociation.isComplete && (
                <div className="mt-6 text-center">
                  <p className={`text-xl font-semibold ${
                    wordAssociation.userAnswer === wordAssociation.correctAnswer
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {wordAssociation.userAnswer === wordAssociation.correctAnswer
                      ? 'Correct! Great job! 🌟'
                      : `Not quite. The answer was "${wordAssociation.correctAnswer}"`
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Completion Message */}
          {currentQuestionIndex >= wordQuestions.length - 1 && wordAssociation?.isComplete && (
            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6 text-center">
              <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Well Done!</h3>
              <p className="text-green-700 text-lg">{getEncouragementMessage()}</p>
              <p className="text-green-600 mt-2">Final Score: {currentScore} points</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeGame === 'number') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Game Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-indigo-600 flex items-center">
                <Brain className="mr-2" size={28} />
                Number Sequence
              </h2>
              <button
                onClick={resetGame}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <RotateCcw className="mr-1" size={16} />
                Exit Game
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{currentScore}</div>
                <div className="text-sm text-indigo-800">Score</div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatTime(gameTime)}</div>
                <div className="text-sm text-blue-800">Time</div>
              </div>
            </div>
          </div>

          {/* Number Sequence Display */}
          {numberSequence && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h3 className="text-2xl font-bold text-center mb-6">
                Complete the number sequence:
              </h3>
              
              <div className="flex justify-center space-x-4 mb-6">
                {numberSequence.sequence.slice(0, -1).map((num, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 rounded-lg bg-indigo-100 text-indigo-800 text-2xl font-bold flex items-center justify-center"
                  >
                    {num}
                  </div>
                ))}
                <div className="w-16 h-16 rounded-lg bg-gray-200 text-gray-600 text-2xl font-bold flex items-center justify-center">
                  ?
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-lg text-gray-600 mb-4">Hint: {numberSequence.hint}</p>
                <div className="flex justify-center space-x-2">
                  <input
                    type="text"
                    value={userNumberInput}
                    onChange={(e) => handleNumberInput(e.target.value)}
                    placeholder="Enter the next number"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-lg text-center w-64"
                    disabled={numberSequence.isComplete}
                  />
                  <button
                    onClick={checkNumberSequence}
                    disabled={!userNumberInput || numberSequence.isComplete}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Check
                  </button>
                </div>
              </div>

              {numberSequence.isComplete && (
                <div className="text-center">
                  <p className="text-xl font-semibold text-green-600 mb-2">
                    Excellent! You got it right! 🎉
                  </p>
                  <p className="text-gray-600">
                    The complete sequence was: {numberSequence.sequence.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Completion Message */}
          {numberSequence?.isComplete && (
            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6 text-center">
              <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Fantastic!</h3>
              <p className="text-green-700 text-lg">{getEncouragementMessage()}</p>
              <p className="text-green-600 mt-2">Final Score: {currentScore} points</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeGame === 'reflection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Game Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-pink-600 flex items-center">
                <Heart className="mr-2" size={28} />
                Daily Reflection
              </h2>
              <button
                onClick={resetGame}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <RotateCcw className="mr-1" size={16} />
                Exit Game
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-pink-100 p-3 rounded-lg inline-block">
                <div className="text-2xl font-bold text-pink-600">{currentScore}</div>
                <div className="text-sm text-pink-800">Points Earned</div>
              </div>
            </div>
          </div>

          {/* Reflection Prompt */}
          {dailyReflection && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h3 className="text-2xl font-bold text-center mb-8 text-pink-600">
                {dailyReflection.prompt}
              </h3>
              
              <div className="mb-6">
                <textarea
                  value={reflectionResponse}
                  onChange={(e) => setReflectionResponse(e.target.value)}
                  placeholder="Take your time to think about this question and share your thoughts..."
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg min-h-32 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                  disabled={dailyReflection.isComplete}
                />
              </div>

              <div className="text-center">
                <button
                  onClick={handleReflectionSubmit}
                  disabled={!reflectionResponse.trim() || dailyReflection.isComplete}
                  className="px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
                >
                  {dailyReflection.isComplete ? 'Completed!' : 'Share My Reflection'}
                </button>
              </div>

              {dailyReflection.isComplete && (
                <div className="mt-6 p-4 bg-pink-50 rounded-lg">
                  <p className="text-lg text-pink-700 text-center">
                    Thank you for sharing your thoughts! Your reflection has been recorded. 💝
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Completion Message */}
          {dailyReflection?.isComplete && (
            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6 text-center">
              <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Beautiful Reflection!</h3>
              <p className="text-green-700 text-lg">{getEncouragementMessage()}</p>
              <p className="text-green-600 mt-2">Points Earned: {currentScore}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Games Menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-4 flex items-center">
            <Brain className="mr-3" size={32} />
            Daily Cognitive Games
          </h1>
          <p className="text-gray-600 text-lg">
            Gentle mental exercises designed to support memory, focus, and cognitive wellness
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <Trophy className="mx-auto mb-2 text-yellow-500" size={24} />
            <div className="text-2xl font-bold text-gray-800">{gameProgress.completed}</div>
            <div className="text-sm text-gray-600">Games Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <Star className="mx-auto mb-2 text-orange-500" size={24} />
            <div className="text-2xl font-bold text-gray-800">{gameProgress.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <Heart className="mx-auto mb-2 text-red-500" size={24} />
            <div className="text-2xl font-bold text-gray-800">{gameProgress.totalScore}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <Clock className="mx-auto mb-2 text-blue-500" size={24} />
            <div className="text-sm font-bold text-gray-800">
              {new Date(gameProgress.lastPlayed).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">Last Played</div>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose Your Level</h2>
          <div className="flex space-x-4">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  difficulty === level
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Activities */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Today's Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyActivities.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  activity.completed
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{activity.name}</h3>
                  {activity.completed ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {activity.points} points
                </div>
                {!activity.completed && (
                  <button
                    onClick={() => {
                      if (activity.name === 'Memory Match') startMemoryMatch();
                      if (activity.name === 'Pattern Recognition') startPatternRecognition();
                      if (activity.name === 'Word Association') startWordAssociation();
                      if (activity.name === 'Number Sequence') startNumberSequence();
                      if (activity.name === 'Daily Reflection') startDailyReflection();
                    }}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Start
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Game Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Memory Games */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-500 p-4 text-white">
              <h3 className="text-xl font-semibold flex items-center">
                <Brain className="mr-2" size={24} />
                Memory Games
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Strengthen your memory with gentle matching exercises
              </p>
              <button
                onClick={startMemoryMatch}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Play Memory Match
              </button>
            </div>
          </div>

          {/* Pattern Recognition */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-500 p-4 text-white">
              <h3 className="text-xl font-semibold flex items-center">
                <Sparkles className="mr-2" size={24} />
                Pattern Recognition
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Improve focus and attention with pattern exercises
              </p>
              <button
                onClick={startPatternRecognition}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Play Pattern Game
              </button>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-purple-500 p-4 text-white">
              <h3 className="text-xl font-semibold flex items-center">
                <Star className="mr-2" size={24} />
                More Games
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Additional cognitive exercises coming soon
              </p>
              <button
                disabled
                className="w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Encouragement Message */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-6 mt-8 text-center">
          <h3 className="text-xl font-semibold text-purple-800 mb-2">
            You're doing great! 🌟
          </h3>
          <p className="text-purple-700">
            Remember, every small step in your cognitive journey is a victory worth celebrating.
            Take your time, enjoy the process, and be proud of your progress!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Games;
