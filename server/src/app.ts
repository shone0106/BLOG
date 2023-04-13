import 'dotenv/config'
import express, {Request, Response, NextFunction} from "express"
import session from 'express-session'
import MongoStore from "connect-mongo"
import createHttpError , { isHttpError }from "http-errors"
import postsRouter from './routes/postsRouter'
import userRouter from './routes/userRouter'


const app = express()

app.use(express.json())

  const sessionOptions = session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000*60*60*24, httpOnly: false},
    rolling: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECTION_STRING })
  })
  
app.use(sessionOptions)

app.use('/api/users', userRouter)
app.use('/api/posts', postsRouter)

app.use((req, res, next)=>{
    next(createHttpError(404, 'endpoint not found'))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction)=>{
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });   
})

export default app

