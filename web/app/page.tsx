/* app/page.tsx – copy-paste over the old file */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ParameterSlider from '../components/ParameterSlider';

export default function Home() {
  const [temperature, setTemperature] = useState(1.0);
  const [topK, setTopK] = useState(40);
  const [maxTokens, setMaxTokens] = useState(200);
  const [output, setOutput] = useState(
    'Great meeting with Prime Minister Boris Johnson of the United Kingdom. A very productive discussion on trade, security, and NATO. The relationship between our two countries has never been stronger!'
  );
  const [loading, setLoading] = useState(false);
  // Info modal for first-time visitors
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    // show modal only if not seen before
    const seen = localStorage.getItem('infoSeen');
    if (!seen) setShowInfoModal(true);
  }, []);

  const closeInfoModal = () => {
    localStorage.setItem('infoSeen', 'true');
    setShowInfoModal(false);
  };

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
    <>
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-lg mx-4 relative">
            <button
              onClick={closeInfoModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Welcome to Trump Tweet Generator</h2>
            <p className="mb-2">
              This site features a character‑level transformer model I developed and trained, fine‑tuned on Trump‑style tweets via the Hugging Face Inference API.
            </p>
            <p className="mb-4">
              Adjust the sliders to control randomness (Temperature), diversity (Top-k), and tweet length (Max tokens), then click Generate Tweet.
            </p>
            <p className="text-sm text-gray-600 mt-6 border-t pt-4">
              ⚠️ Content is for entertainment purposes only and does not reflect real events or opinions.
            </p>
          </div>
        </div>
      )}
      <main className="min-h-screen flex items-center justify-center bg-[#182148] px-4 py-10">
        <section className="w-full max-w-md bg-[#182148] shadow-2xl shadow-[#00000080] rounded-2xl p-8 text-white relative border border-[#2c355c]">
          {/* Header block */}
          <div className="flex items-start mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl leading-none font-extrabold tracking-wide">
                TRUMP
                <br />
                TWEET
                <br />
                GENERATOR
              </h1>
              <div className="flex items-center mt-2">
                <p className="text-xs font-extrabold tracking-wide leading-tight mr-2">
                  MAKE
                  <br />
                  AMERICA
                  <br />
                  GREAT
                  <br />
                  AGAIN
                </p>
                <Image
                  src="/flag.png"
                  alt="US flag"
                  width={90}
                  height={60}
                  className="ml-2 drop-shadow-lg"
                />
              </div>
            </div>


            <div className="ml-4 w-36 h-36 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
              <Image
                src="/president.png"
                alt="President avatar"
                width={180}
                height={180}
                className="object-cover w-full h-full"
              />
            </div>
          </div>


          <div className="space-y-4">
            <ParameterSlider
              label="Temperature"
              description="Controls randomness: higher = more creative"
              min={0.1}
              max={2.0}
              step={0.1}
              value={temperature}
              onChange={setTemperature}
            />
            <ParameterSlider
              label="Top-k"
              description="Limits sampling to top K likely tokens for diversity"
              min={1}
              max={100}
              step={1}
              value={topK}
              onChange={setTopK}
            />
            <ParameterSlider
              label="Max tokens"
              description="Maximum length of the generated tweet"
              min={10}
              max={500}
              step={10}
              value={maxTokens}
              onChange={setMaxTokens}
            />
          </div>

          {/* ── output box ── */}
          <div
            className="bg-[#fffbe8] text-gray-900 rounded-xl p-6 mt-6 text-lg min-h-[120px] max-h-64 overflow-y-auto whitespace-pre-line flex items-center justify-center"
          >
            {loading ? (
              <div className="flex flex-col items-center w-full">
                <svg className="animate-spin h-8 w-8 text-[#c62828] mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span className="text-base text-[#c62828] font-semibold">Generating tweet… Please wait</span>
              </div>
            ) : (
              output
            )}
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

          {/* Project Links */}
          <div className="mt-8 pt-4 border-t border-[#2c355c] flex justify-center space-x-8">
            <a 
              href="https://github.com/AnandVishesh1301/tweet-prediction-transformer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80 transition-opacity"
            >
              <Image
                src="/github.png"
                alt="GitHub"
                width={36}
                height={36}
                className="mb-1"
              />
              <span className="text-sm font-medium">Source Code</span>
            </a>
            <a 
              href="https://huggingface.co/spaces/AnandVishesh1301/tweet-prediction-hf/tree/main" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80 transition-opacity"
            >
              <Image
                src="/huggingface.png"
                alt="Hugging Face"
                width={36}
                height={36}
                className="mb-1"
              />
              <span className="text-sm font-medium">Model Inference</span>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
