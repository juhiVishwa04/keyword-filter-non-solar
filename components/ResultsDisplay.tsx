import React, { useState, useEffect } from 'react';

interface ResultsDisplayProps {
  output: string;
  isLoading: boolean;
  error: string | null;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ output, isLoading, error }) => {
    const [copied, setCopied] = useState<null | 'list' | 'all'>(null);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopyList = () => {
        if (!output) return;
        try {
            const parsed = JSON.parse(output);
            if (parsed && Array.isArray(parsed.non_solar_keywords)) {
                const keywords = parsed.non_solar_keywords.join('\n');
                navigator.clipboard.writeText(keywords);
                setCopied('list');
            }
        } catch (e) {
            console.error("Failed to parse and copy keyword list:", e);
            // Fallback for safety if JSON is malformed
            handleCopyAll();
        }
    };

    const handleCopyAll = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            setCopied('all');
        }
    };
    
    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center text-gray-400">Filtering keywords...</div>;
        }
        if (error) {
            return <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg">{error}</div>;
        }
        if (output) {
            return (
                <div className="relative">
                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                        <button
                            onClick={handleCopyList}
                            className="p-2 bg-gray-700/50 rounded-md hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all"
                            title="Copy keyword list (newline separated)"
                            aria-label="Copy keyword list"
                        >
                            {copied === 'list' ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                        </button>
                        <button
                            onClick={handleCopyAll}
                            className="px-3 py-2 text-xs font-semibold bg-gray-700/50 rounded-md hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all flex items-center"
                            title="Copy the full JSON result"
                            aria-label="Copy all content as JSON"
                        >
                            {copied === 'all' ? <CheckIcon className="h-4 w-4 mr-1 text-green-400" /> : null}
                            Copy All
                        </button>
                    </div>
                    <pre className="bg-gray-900/70 p-4 rounded-lg overflow-x-auto text-sm text-cyan-300">
                        <code>{output}</code>
                    </pre>
                </div>
            );
        }
        return (
            <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-700 rounded-lg">
                <p>Your filtered keywords will appear here.</p>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-4">Results</h2>
            {renderContent()}
        </div>
    );
};

export default ResultsDisplay;