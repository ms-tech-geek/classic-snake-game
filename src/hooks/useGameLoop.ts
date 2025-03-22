import React, { useCallback, useEffect, useRef } from 'react';
import { Direction, GameState, Position } from '../types/game';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;

const createInitialState = (): GameState => ({
  snake: [{ x: 10, y: 10 }],
  food: { x: 15, y: 15 },
  direction: 'RIGHT',
  isGameOver: false,
  score: 0,
  hasStarted: false,
});

const generateFood = (snake: Position[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

export const useGameLoop = () => {
  const [gameState, setGameState] = React.useState<GameState>(createInitialState);
  const speedRef = useRef(INITIAL_SPEED);
  const gameLoopRef = useRef<number>();
  const isFirstRender = useRef(true);

  const moveSnake = useCallback(() => {
    setGameState(prevState => {
      if (prevState.isGameOver || !prevState.hasStarted) return prevState;

      const head = { ...prevState.snake[0] };
      
      switch (prevState.direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check collision with walls
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        return { ...prevState, isGameOver: true };
      }

      // Check collision with self
      if (
        prevState.snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        return { ...prevState, isGameOver: true };
      }

      const newSnake = [head, ...prevState.snake];

      // Check if food is eaten
      const ateFood = head.x === prevState.food.x && head.y === prevState.food.y;
      if (!ateFood) {
        newSnake.pop();
      }

      return {
        ...prevState,
        snake: newSnake,
        food: ateFood ? generateFood(newSnake) : prevState.food,
        score: ateFood ? prevState.score + 1 : prevState.score,
      };
    });
  }, []);

  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prevState => {
      // Prevent 180-degree turns
      const invalidMove =
        (prevState.direction === 'UP' && newDirection === 'DOWN') ||
        (prevState.direction === 'DOWN' && newDirection === 'UP') ||
        (prevState.direction === 'LEFT' && newDirection === 'RIGHT') ||
        (prevState.direction === 'RIGHT' && newDirection === 'LEFT');

      if (invalidMove) return prevState;

      return {
        ...prevState,
        direction: newDirection,
      };
    });
  }, []);

  const startGame = useCallback(() => {
    const initialState = createInitialState();
    initialState.hasStarted = true;
    speedRef.current = INITIAL_SPEED;
    setGameState(initialState);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          changeDirection('UP');
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          break;
        case 'Enter':
        case ' ':
          if (!isFirstRender.current && (gameState.isGameOver || !gameState.hasStarted)) {
            e.preventDefault();
            startGame();
          }
          break;
      }
    };

    isFirstRender.current = false;
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, gameState.isGameOver, startGame]);

  useEffect(() => {
    if (gameState.isGameOver || !gameState.hasStarted) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      moveSnake();
      // Increase speed as score increases
      speedRef.current = Math.max(50, INITIAL_SPEED - gameState.score * SPEED_INCREMENT);
    }, speedRef.current);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver, gameState.hasStarted, moveSnake, gameState.score]);

  return {
    gameState,
    startGame,
    changeDirection,
    GRID_SIZE,
  };
};