'use client';

import { ChangeEvent } from 'react';

interface SliderProps {
  readonly label: string;
  /** Short description tooltip for the parameter */
  readonly description?: string;
  readonly min: number;
  readonly max: number;
  readonly step?: number;
  readonly value: number;
  readonly onChange: (v: number) => void;
}

export default function ParameterSlider({
  label,
  description,
  min,
  max,
  step = 0.1,
  value,
  onChange,
}: SliderProps) {
  const handle = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(parseFloat(e.target.value));

  return (
    <div className="my-4">
      <div className="flex justify-between text-sm mb-1 font-medium">
        <div className="flex items-center space-x-1 group relative">
          <span>{label}</span>
          {description && (
            <span className="relative">
              <span className="text-gray-400 hover:text-gray-200 cursor-pointer">
                ℹ️
              </span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 pointer-events-none">
                {description}
              </div>
            </span>
          )}
        </div>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handle}
        className="w-full h-2 rounded-lg appearance-none bg-[#1e2a5a] accent-orange-400"
      />
    </div>
  );
}
