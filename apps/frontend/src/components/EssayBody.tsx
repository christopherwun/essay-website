import React, { useState } from 'react';
import '../app.css';



export default function EssayBody({
  focusedEssay,
  setFocusedEssay,
  user,
}: {
  focusedEssay: {
    _id: string;
    prompt: string;
    essayText: string;
    feedback: string;
    answer: string;
  } | null;
  setFocusedEssay: {
    (essay: {
      _id: string;
      prompt: string;
      essayText: string;
      feedback: string;
      answer: string;
    }): void;
  };
  user: string | null;
}) {
  function getFeedback() {
    // use fetch to post the answer
    fetch('/api/questions/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        questionId: focusedEssay._id,
      }),
    }).then((res) => {
      if (res.status === 200) {
        // update the focused post 

      } else {
        // eslint-disable-next-line no-alert
        alert(`Feedback failed`);
      }
    });
  }

  return (
    <div className="post-body">
      {focusedEssay ? (
        <>
          <h2>{focusedEssay.prompt}</h2>
          <div className="answer">
            <h3>Essay:</h3>
            <p>{focusedEssay.essayText}</p>
          </div>
          <div className="answer">
            <h3>Feedback:</h3>
            <p>{focusedEssay.feedback}</p>
          </div>
          <button className="answer" onClick={getFeedback}>
            Get Feedback
          </button>
        </>
      ) : (
        <p>Select a post to view</p>
      )}
    </div>
  );
}
