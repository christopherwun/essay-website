import React, { useState } from 'react';
import '../app.css';

export default function EssayBody({
  focusedEssay,
  setFocusedEssay,
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
}) {
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  function getFeedback() {
    setLoadingFeedback(true);

    // use fetch to post the answer, with the focused post's id in the route
    const route = `/api/essays/feedback/${focusedEssay._id}`;
    fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    }).then((res) => {
      if (res.status === 200) {
        // update the focused post
        res.json().then((data) => {
          setFocusedEssay({
            ...focusedEssay,
            feedback: data.feedback,
          });
          setLoadingFeedback(false);

        });
      } else {
        // eslint-disable-next-line no-alert
        const alert_str = `Feedback failed: ${res.statusText}`;
        // eslint-disable-next-line no-alert
        alert(alert_str);
        setLoadingFeedback(false);

      }
    }).catch((err) => {
      // eslint-disable-next-line no-alert
      alert(`Feedback failed: ${err}`);
      setLoadingFeedback(false);
    });
  }

  function saveEssay() {
    // use fetch to post the answer
    const encodedID = encodeURIComponent(focusedEssay._id);
    const route = `/api/essays/edit/${encodedID}`;
    fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        essayText: focusedEssay.essayText,
      }),
    }).then((res) => {
      if (res.status === 200) {
        // update the focused post 
        res.json().then((data) => {
          setFocusedEssay({
            ...focusedEssay,
            essayText: data.essayText,
          });
        });
      } else {
        console.log(focusedEssay._id);
        const alert_str = `Save failed: ${res.statusText}`;
        // eslint-disable-next-line no-alert
        alert(alert_str);
      }
    });
  }

  return (
    <div className="post-body">
      {focusedEssay ? (
        <>
          <h2>{focusedEssay.prompt}</h2>

          {/* Show textarea for essay writing (prefilled with current version) */}
          <div className="answer">
          <h3>Your Essay:</h3>
          <textarea
            value={focusedEssay.essayText}
            onChange={(e) =>
              setFocusedEssay({
                ...focusedEssay,
                essayText: e.target.value,
              })
            }
            className="answer-input"
          />
          </div>
          <button className="answer" onClick={saveEssay}>
            Save Changes
          </button>

          {/* Show the feedback (if not loading) */}
            <div className="answer">
              <h3>Feedback:</h3>
              {!loadingFeedback && <p>{focusedEssay.feedback}</p>}
            </div>

          {/* Show loading indicator while waiting for feedback */}
          {loadingFeedback && <p>Loading feedback...</p>}

          {/* only enabled when there is text */}
          <button className="answer" onClick={getFeedback} disabled={!focusedEssay.essayText}>
            Get Feedback
          </button>
        </>
      ) : (
        <p>Select a post to view</p>
      )}
    </div>
  );
}
