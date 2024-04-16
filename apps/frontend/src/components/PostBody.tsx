import React, { useState } from 'react';
import '../app.css';

export default function PostBody({
  focusedPost,
  setFocusedPost,
  user,
}: {
  focusedPost: {
    _id: string;
    questionText: string;
    answer: string;
    author: string;
  };
  setFocusedPost: (post: {
    _id: string;
    questionText: string;
    answer: string;
    author: string;
  }) => void;
  user: string | null;
}) {
  const [answer, setAnswer] = useState('');

  function postAnswer() {
    // use fetch to post the answer
    fetch('/api/questions/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        _id: focusedPost._id,
        answer: answer,
      }),
    }).then((res) => {
      if (res.status === 200) {
        setFocusedPost({ ...focusedPost, answer: answer });
        setAnswer('');
      } else {
        // eslint-disable-next-line no-alert
        alert(`Answer failed`);
      }
    });
  }

  return (
    <div className="post-body">
      {focusedPost ? (
        <>
          <h2>{focusedPost.questionText}</h2>
          <div className="answer">
            <h3>Author:</h3>
            <p>{focusedPost.author}</p>
          </div>
          <div className="answer">
            <h3>Answer:</h3>
            <p>{focusedPost.answer}</p>
          </div>
          {user ? (
            <div className="answer">
              <h3>Answer this question:</h3>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="answer-input"
              />
              <button className="answer" onClick={postAnswer}>
                Post Answer
              </button>
            </div>
          ) : (
            <div className="answer">
              {/* <h3>Answer this question:</h3>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="answer-input"
              />
              <button >Login to answer</button> */}
            </div>
          )}
        </>
      ) : (
        <p>Select a post to view</p>
      )}
    </div>
  );
}
