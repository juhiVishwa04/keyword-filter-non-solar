import React from 'react';

interface KeywordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const KeywordInput: React.FC<KeywordInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
  return (
    <div>
      <label htmlFor="keywords" className="block text-sm font-medium text-gray-300 mb-2">
        Paste Keywords (one per line)
      </label>
      <textarea
        id="keywords"
        value={value}
        onChange={onChange}
        disabled={isLoading}
        placeholder="solar panels for home&#10;best local restaurants&#10;SunPower quote&#10;weekend trip ideas&#10;Tesla Powerwall cost&#10;how to bake bread"
        className="w-full h-64 p-4 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-300 resize-none placeholder-gray-500 disabled:opacity-50"
      />
      <div className="mt-4 flex justify-end">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Filtering...
            </>
          ) : (
            'Filter Keywords'
          )}
        </button>
      </div>
    </div>
  );
};

export default KeywordInput;
