import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import IEssay from '../../../backend/src/models/essay';
import { useNavigate } from 'react-router-dom';
import '../app.css';

export default function EssayList({
  user,
  addEssay,
  setFocusedEssay,
}: {
  user: string | null;
  addEssay: () => void;
  setFocusedEssay: (post: typeof IEssay) => void;
}) {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, error, isLoading } = useSWR('/api/essays/', fetcher, {
    refreshInterval: 2000,
  });

  const navigate = useNavigate();

  return (
    <div className="essays">
      {/* Button to add new essay */}
      {user ? (
        <div style={{ textAlign: 'center', width: '100%', }}>
          <button className="essay-button" onClick={addEssay}>
            Add New Prompt
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', width: '100%', }}>
          <button className="essay-button" onClick={() => navigate('/login')}>
            Login to log your essays
          </button>
        </div>
      )}
      {/* List of essays, with prompt preview and writing preview */}
      <div className="post-list">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading posts</p>
        ) : (
          data.map((essay, index) => (
            // include keyevent
            <div key={index}>
              <button
                onClick={() => setFocusedEssay(essay)}
                className="essay-preview"
              >
                {/* Preview prompt in 1 line, bolded (cut it off past 1 line) */}
                <p>
                  <b>{essay.prompt.substr(0, 50)}</b>
                </p>
                {/* Preview test in 1 line,, only include first line of text */}
                <p>{essay.essayText.substr(0, 50)}</p>
                
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
