import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { PostInput } from "../network/postApi";
import * as postApi from '../network/postApi'
import Post from '../models/Post'
import { usePostContext } from "../context/postContext";



export default function NewEditModel() {

  const { postToEdit, onDismissNew, onDismissUpdate, onNewPostSaved, onUpdatePostSaved } = usePostContext()

  const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<PostInput>({
    defaultValues: {
      title: postToEdit?.title || "",
      text: postToEdit?.text || ""
    }
  })

  async function onSubmit(post: PostInput) {
    try{
      let postResponse: Post
      if(postToEdit){
        postResponse = await postApi.updatePost(postToEdit._id, post)
        onUpdatePostSaved(postResponse)
      }
      else{
        postResponse = await postApi.createPost(post)
        onNewPostSaved(postResponse)
      }
    }
    catch(error){
      console.log(error)
      alert(error)
    }
    
  }

  return (
    <Modal show onHide={postToEdit ? onDismissUpdate : onDismissNew}>
      <Modal.Header closeButton>
        <Modal.Title>{postToEdit ? "Edit Post" : "New Post"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="NewEditForm" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Title" 
            {...register('title', {required: true})}
            />
            {errors.title && <span style={{color: 'red'}}>This field is required</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Text</Form.Label>
            <Form.Control as="textarea" rows={5} placeholder="Text" 
            {...register('text', {required: true})}
            />
            {errors.text && <span style={{color: 'red'}}>This field is required</span>}
          </Form.Group>
        </Form>

      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={postToEdit ? onDismissUpdate : onDismissNew}>
          Close
        </Button>
        <Button variant="primary" type="submit" form="NewEditForm" disabled={isSubmitting}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>

  )
}
