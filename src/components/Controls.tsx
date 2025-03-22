import React from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { Direction } from '../types/game';

type ControlsProps = {
  onDirectionChange: (direction: Direction) => void;
};

export const Controls: React.FC<ControlsProps> = ({ onDirectionChange }) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-48 mt-4">
      <div className="col-start-2">
        <button
          onClick={() => onDirectionChange('UP')}
          className="w-14 h-14 bg-indigo-600 rounded-lg flex items-center justify-center text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          aria-label="Move Up"
        >
          <ArrowUp className="w-8 h-8" />
        </button>
      </div>
      <div className="col-start-1 row-start-2">
        <button
          onClick={() => onDirectionChange('LEFT')}
          className="w-14 h-14 bg-indigo-600 rounded-lg flex items-center justify-center text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
      </div>
      <div className="col-start-2 row-start-2">
        <button
          onClick={() => onDirectionChange('DOWN')}
          className="w-14 h-14 bg-indigo-600 rounded-lg flex items-center justify-center text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          aria-label="Move Down"
        >
          <ArrowDown className="w-8 h-8" />
        </button>
      </div>
      <div className="col-start-3 row-start-2">
        <button
          onClick={() => onDirectionChange('RIGHT')}
          className="w-14 h-14 bg-indigo-600 rounded-lg flex items-center justify-center text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          aria-label="Move Right"
        >
          <ArrowRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};