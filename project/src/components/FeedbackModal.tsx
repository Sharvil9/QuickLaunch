import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FeedbackModalProps {
  onClose: () => void;
  darkMode: boolean;
}

export function FeedbackModal({ onClose, darkMode }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`w-96 rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Feedback
          </h3>
          <button
            onClick={onClose}
            className={darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts, suggestions, or report issues..."
            className={`w-full h-32 p-3 rounded-lg resize-none ${
              darkMode
                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
            } border`}
            required
          />
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}