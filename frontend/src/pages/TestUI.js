import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import config from "../config";
import { Loader } from '../components/Loader';

const TestUI = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = 'mm';
        const response = await axios.get(`${config.backendLocation}/user/byusername/${username}`);
        const data = response.data;
        
        
        setUserData(data);
        setLoading(false);
        fetchComments();
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${config.backendLocation}/analysis/comments`);
      const commentsData = response.data;

      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`${config.backendLocation}/analysis/publish-comment`, {
        comment,
      });

      setComment('');
      fetchComments(); // Fetch the updated comments after publishing
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : (
        <>
          {userData ? (
            <>
              <h2>User Data</h2>
              <UserData>
              
                <div>
                  <strong>Username:</strong> {userData.username}
                </div>
                <div>
                  <strong>Name:</strong>
                  <span
                  className="html-tag"
                  dangerouslySetInnerHTML={{ __html: userData.name }}
                ></span>
                </div>
                <div>
                  <strong>Email:</strong> {userData.email}
                </div>
                {/* Display additional user properties as needed */}
              </UserData>
              <CommentForm onSubmit={handleCommentSubmit}>
                <label htmlFor="comment">Add a Comment:</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={handleCommentChange}
                  required
                ></textarea>
                <button type="submit">Submit</button>
              </CommentForm>
              <CommentList>
                <h3>Comments:</h3>
                {comments.map((comment) => (
                  <Comment key={comment.id}>{comment.text}</Comment>
                ))}
              </CommentList>
            </>
          ) : (
            <ErrorMessage>User not found</ErrorMessage>
          )}
        </>
      )}
    </Container>
  );
};

export default TestUI;

const Container = styled.div`
  padding-top: 10%;
`;

const UserData = styled.div`
  margin-top: 20px;
  line-height: 1.5;
`;

const ErrorMessage = styled.div`
  margin-top: 20px;
  color: red;
`;

const CommentForm = styled.form`
  margin-top: 20px;
`;

const CommentList = styled.div`
  margin-top: 20px;
`;

const Comment = styled.div`
  margin-bottom: 10px;
`;