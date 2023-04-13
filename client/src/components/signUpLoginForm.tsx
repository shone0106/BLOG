import { Modal, Form, Button, Alert } from "react-bootstrap"
import { useAuthContext } from "../context/authContext"
import { useForm } from "react-hook-form";
import { useState } from "react";

import * as userApi from '../network/postApi'
import User from '../models/User'
import { ConflictError, UnauthorizedError } from "../errors/http_errors";


interface Credentials {
    username: string;
    password: string;
}

export default function SignUpLoginForm() {

    const { showSignUp, onDismiss, onSuccess } = useAuthContext()

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Credentials>()

    const [errorText, setErrorText] = useState<string | null>(null);

    async function onSubmit(credentials: Credentials) {
        try {
            let user: User
            if (showSignUp) {
                user = await userApi.signUp(credentials)
            }
            else {
                user = await userApi.login(credentials)
            }

            onSuccess(user)
        }
        catch (error) {
            if (error instanceof ConflictError || error instanceof UnauthorizedError) {
                setErrorText(error.message);
            } else {
                alert(error)
            }
            console.log(error)
        }
    }


    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>{showSignUp ? "Sign Up" : "Login"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {errorText &&
                    <Alert variant="danger">
                        {errorText}
                    </Alert>
                }
                <Form id="authForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter your username"
                            {...register('username', { required: true })}
                        />
                        {errors.username && <span style={{ color: 'red' }}>This field is required</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>password</Form.Label>
                        <Form.Control type="password" placeholder="Enter your password"
                            {...register('password', { required: true })}
                        />
                        {errors.password && <span style={{ color: 'red' }}>This field is required</span>}
                    </Form.Group>
                </Form>

            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" type="submit" form="authForm" disabled={isSubmitting}>
                    {showSignUp ? "Sign Up" : "Login"}
                </Button>
            </Modal.Footer>
        </Modal>

    )


}