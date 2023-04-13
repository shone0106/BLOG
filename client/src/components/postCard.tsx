import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Link} from 'react-router-dom'


import Post from '../models/Post'


export default function PostCard(post: Post) {
  return (
    <Card style={{ width: '18rem', height: '16rem' }}>
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{post.createdAt}</Card.Subtitle>
        <Card.Text>
          {post.text?.slice(0, Math.min(130, post.text.length))}
        </Card.Text>
        <Card.Link as={Link} to={`/posts/${post._id}`}>READ MORE</Card.Link>
      </Card.Body>
    </Card>
  )
}
