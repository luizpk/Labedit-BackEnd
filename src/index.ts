import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './router/UserRouter'
import { postRouter } from './router/PostRouter'
import { commentRouter } from './router/CommentRouter'


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${3003}`)
})



app.use("/users", userRouter)
app.use("/posts", postRouter)
app.use("/comment", commentRouter)
