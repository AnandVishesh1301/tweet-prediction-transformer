/* app/page.tsx – copy-paste over the old file */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import ParameterSlider from '../components/ParameterSlider';

export default function Home() {
  // ───────── state ─────────
  const [temperature, setTemperature] = useState(1.0);
  const [topK, setTopK] = useState(40);
  const [maxTokens, setMaxTokens] = useState(200);
  const [output, setOutput] = useState(
    'Great meeting with Prime Minister Boris Johnson of the United Kingdom. A very productive discussion on trade, security, and NATO. The relationship between our two countries has never been stronger!'
  );
  const [loading, setLoading] = useState(false);

  // ───────── handlers ─────────
  const generateTweet = async () => {
    setLoading(true);
    setOutput('');
    try {
      const response = await fetch(
        'https://AnandVishesh1301-tweet-prediction-hf.hf.space/generate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            temperature,
            top_k: topK,
            max_tokens: maxTokens,
          }),
        }
      );
      const data = await response.json();
      setOutput(data.output);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setOutput('Error: ' + message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#182148] px-4 py-10">
      <section className="w-full max-w-md bg-[#182148] shadow-xl rounded-2xl p-8 text-white relative">
        {/* Header block */}
        <div className="flex items-start mb-8">
          <div>
            <h1 className="text-4xl leading-none font-extrabold tracking-wide">
              TRUMP
              <br />
              TWEET
              <br />
              GENERATOR
            </h1>
            <p className="mt-2 text-xs font-extrabold tracking-wide leading-tight">
              MAKE
              <br />
              AMERICA
              <br />
              GREAT
              <br />
              AGAIN
            </p>
          </div>

          {/* US flag */}
          <Image
            src="/flag.svg"     /* put a small flag in /public */
            alt="US flag"
            width={48}
            height={32}
            className="ml-4 mt-1"
          />

          {/* Avatar placeholder */}
          <div className="ml-4 w-20 h-20 rounded-full bg-gray-300" />
        </div>

        {/* ── sliders ── */}
        <ParameterSlider
          label="Temperature"
          min={0.1}
          max={2.0}
          step={0.1}
          value={temperature}
          onChange={setTemperature}
        />
        <ParameterSlider
          label="Top-k"
          min={1}
          max={100}
          value={topK}
          step={1}
          onChange={setTopK}
        />
        <ParameterSlider
          label="Max tokens"
          min={10}
          max={500}
          step={10}
          value={maxTokens}
          onChange={setMaxTokens}
        />

        {/* ── output box ── */}
        <div
          className="bg-[#fffbe8] text-gray-900 rounded-xl p-6 mt-6 text-lg min-h-[120px]
                     whitespace-pre-line"
        >
          {output}
        </div>

        {/* ── button ── */}
        <button
          onClick={generateTweet}
          disabled={loading}
          className={`mt-6 w-full rounded-xl py-4 text-xl font-bold transition
                      ${
                        loading
                          ? 'bg-red-300 cursor-not-allowed'
                          : 'bg-[#c62828] hover:bg-[#e53935]'
                      }`}
        >
          {loading ? 'Generating…' : 'Generate Tweet'}
        </button>
      </section>
    </main>
  );
}
