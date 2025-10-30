import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import KeywordInput from './components/KeywordInput';
import ResultsDisplay from './components/ResultsDisplay';
import { filterKeywords } from './services/geminiService';

const App: React.FC = () => {
  const [inputKeywords, setInputKeywords] = useState<string>('');
  const [filteredKeywords, setFilteredKeywords] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilter = useCallback(async () => {
    if (!inputKeywords.trim()) {
      setError('Please enter some keywords to filter.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFilteredKeywords('');

    try {
      const result = await filterKeywords(inputKeywords);
      // The result from Gemini is a JSON string. We need to parse and re-stringify for pretty printing.
      const parsedResult = JSON.parse(result);
      setFilteredKeywords(JSON.stringify(parsedResult, null, 2));
    } catch (e) {
      console.error(e);
      setError('Failed to filter keywords. Please check your input or try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [inputKeywords]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 ring-1 ring-white/10">
          <div className="p-6 sm:p-8 md:p-10">
            <KeywordInput
              value={inputKeywords}
              onChange={(e) => setInputKeywords(e.target.value)}
              onSubmit={handleFilter}
              isLoading={isLoading}
            />
            <div className="mt-8 border-t border-gray-700 pt-8">
              <ResultsDisplay
                output={filteredKeywords}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
