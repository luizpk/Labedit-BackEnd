import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './router/UserRouter'


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

//how to make signin endpoint with typescript?

app.use("/users", userRouter)
