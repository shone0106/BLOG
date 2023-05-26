import React from 'react'
import { useEffect, useState } from 'react'
import { Row, Col, Button } from 'react-bootstrap'

import Post from '../models/Post'
import PostCard from '../components/postCard'
import NewEditModel from '../components/NewEditModel'
import { usePostContext } from '../context/postContext'
import { useAuthContext } from '../context/authContext'


function Home() {

  const { onAddNewPostClick, showNew, posts } = usePostContext()

  const { user } = useAuthContext()


  return (
    <>
      <h1>All Posts</h1>
      {
        user &&
        <Button onClick={onAddNewPostClick} className='mb-2'>Add new post</Button>
      }

      {
        showNew &&
        <NewEditModel />
      }

      <Row xs={1} md={2} lg={3} className="g-3">
        {posts.map(post => (
          <Col key={post._id}>
            <PostCard {...post} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Home