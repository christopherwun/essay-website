import React, { useState, useEffect } from 'react';
// import useSWR from 'swr';
import axios from 'axios';
import IEssay from '../../../backend/src/models/essay';
// import { useNavigate } from 'react-router-dom';
import '../app.css';

import io from 'socket.io-client';

export default function EssayList({
  // user,
  addEssay,
  setFocusedEssay,
}: {
  user: string | null;
  addEssay: () => void;
  setFocusedEssay: (post: typeof IEssay) => void;
}) {
  // const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  // const { data, error, isLoading } = useSWR('/api/essays/', fetcher, {
  //   revalidateOnFocus: true, // Refreshes data when window gains focus
  // });
  const [essays, setEssays] = useState([]);

  const updateEssays = (updatedEssays, updatedID) => {
    setEssays(updatedEssays);
    // set focused essay feedback to the updated feedback
    const updatedFocusedEssay = updatedEssays.find((essay) => essay._id === updatedID);
    // setFocusedEssay(updatedFocusedEssay);
  }

  useEffect(() => {
    const socket = io("http://localhost:8000", { transports: ['websocket'] }); // "http://localhost:3000

    // Listen for 'essaysUpdated' event emitted by the server
    socket.emit('hello', 'hello from frontend')
    socket.on('essaysUpdated', (updatedEssays, updatedID) => {
      updateEssays(updatedEssays, updatedID);
    });

    // Fetch initial essay data from the server
    axios.get('/api/essays').then((response) => {
      setEssays(response.data);
    });

    // Clean up event listener on component unmount
    return () => {
      socket.off('essaysUpdated');
    };
  }, []);
  

  return (
    <div className="essays">
      {/* Button to add new essay */}
        <div style={{ textAlign: 'center', width: '100%', }}>
          <button className="essay-button" onClick={addEssay}>
            Add Custom Prompt
          </button>
        </div>
      {/* List of essays, with prompt preview and writing preview */}
      <div className="post-list">
        {
        // isLoading ? (
        //   <p>Loading...</p>
        // ) : error ? (
        //   <p>Error loading posts</p>
        // ) :
         (
          essays.map((essay, index) => (
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
                <p>{essay.essayText?.substr(0, 50)}</p>
                
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
