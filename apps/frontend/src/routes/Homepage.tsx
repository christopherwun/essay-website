import React, { useState, useEffect } from 'react';
import Modal from 'simple-react-modal';
import Navbar from '../components/Navbar';
import '../app.css';
import EssayList from '../components/EssayList';
import EssayBody from '../components/EssayBody';
import axios from 'axios';

export default function Homepage() {
  const [user, setUser] = useState(null);
  const [focusedEssay, setFocusedEssay] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState('');

  // check if user is logged in, making sure to pass the proper authorization headers
  useEffect(() => {
    axios
      .get('/api/account/user', {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data.username);
        }
      });
  }, [user]);

  function logout() {
    fetch('/api/account/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).then((res) => {
      if (res.status === 200) {
        setUser(null);
      }
    });
  }

  function sendPost() {
    fetch('/api/questions/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        questionText: question,
      }),
    }).then((res) => {
      if (res.status === 201) {
        setQuestion('');
        setShowModal(false);
      } else {
        // eslint-disable-next-line no-alert
        alert(`Post failed: ${res.statusText}`);
      }
    });
  }

  return (
    <div className="homepage">
      {/* Modal should appear on top of everything */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        className="modal"
        style={{ background: 'grey', opacity: '0.9' }}
      >
        <div>
          <h2>New Prompt</h2>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="answer-input"
          />
          <button onClick={sendPost} style={{ marginRight: '10px' }}>
            Post
          </button>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      </Modal>

      {/* Topmost div for title + login/logout buttons*/}
      <Navbar user={user} logout={logout} />

      {/* Main div for post button (if logged in), posts */}
      <div className="main">
        {/* Left div for list of posts and post button */}
        <EssayList
          user={user}
          addEssay={() => setShowModal(true)}
          setFocusedEssay={setFocusedEssay}
        />

        {/* Right div for actual post body and answer button */}
        <EssayBody
          focusedEssay={focusedEssay}
          setFocusedEssay={setFocusedEssay}
          user={user}
        />
      </div>
    </div>
  );
}
