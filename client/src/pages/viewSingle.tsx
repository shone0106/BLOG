import React from 'react'
import { useParams } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';

import Post from '../models/Post'
import * as postApi from '../network/postApi'
import NewEditModel from '../components/NewEditModel';
import { usePostContext } from '../context/postContext';
import { useAuthContext } from '../context/authContext';


function ViewSingle() {

  const { postToEdit, posts, onPostEditClick, onPostDeleted } = usePostContext()

  const { user } = useAuthContext()

  const { id } = useParams()

  const post = posts.find(post => post._id === id)

  if (!post) return <h2>Post Not Found</h2>


  async function editPost() {
    onPostEditClick(post!)

  }

  async function deletePost() {
    try {
      await postApi.deletePost(id!)
      onPostDeleted(id!)
    }
    catch (error) {
      alert(error)
      console.log(error)
    }
  }

  return (
    <>
      <Card >
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{`Author: ${post.authorName}`}</Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">{new Date(post.createdAt).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric'})}</Card.Subtitle>
          <Card.Text>
            {post.text}
          </Card.Text>
          {
          (user && user._id === post.authorId)
           ?
              <>
                <Button variant="info" onClick={editPost} className='me-2'>EDIT</Button>
                <Button variant="danger" onClick={deletePost}>DELETE</Button>
              </>
           :
              <>
              </>
          }

        </Card.Body>
      </Card>

      {
        postToEdit &&
        <NewEditModel />
      }
    </>
  )
}

export default ViewSingle