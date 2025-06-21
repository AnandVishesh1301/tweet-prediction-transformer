'use client';

import { ChangeEvent } from 'react';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
}

export default function ParameterSlider({
  label,
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
        <span>{label}</span>
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
