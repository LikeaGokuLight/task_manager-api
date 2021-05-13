const express = require('express')
require('./db/mongoose')
const chalk = require('chalk')
const env = require('env-cmd')
// Routers api
const userRouter = require('./routes/api/user')
const taskRouter = require('./routes/api/task')

// Models
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT


app.use(express.json({extended: false}))
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(chalk.bgGreen.green.bold(`Server is running on port ${port}`))
})




