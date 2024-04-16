import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import IQuestion from '../../../backend/src/models/question';
import { useNavigate } from 'react-router-dom';
import '../app.css';

export default function PostList({
  user,
  makePost,
  setFocusedPost,
}: {
  user: string | null;
  makePost: () => void;
  setFocusedPost: (post: typeof IQuestion) => void;
}) {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, error, isLoading } = useSWR('/api/questions/', fetcher, {
    refreshInterval: 2000,
  });

  const navigate = useNavigate();

  return (
    <div className="posts">
      {user ? (
        <div className="post-button">
          <button className="button" onClick={makePost}>
            Add new Question +
          </button>
        </div>
      ) : (
        <div className="post-button">
          <button className="button" onClick={() => navigate('/login')}>
            Login to make a post
          </button>
        </div>
      )}
      <div className="post-list">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading posts</p>
        ) : (
          data.map((post, index) => (
            // include keyevent
            <div key={index} className="post-button">
              <button
                onClick={() => setFocusedPost(post)}
                className="post-preview"
              >
                <p style={{ padding: 0 }}>{post.questionText}</p>
                {/* <p>{post.author}</p> */}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
