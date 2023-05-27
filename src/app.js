import express from 'express'
import routes from './routes/index.js'

const app = express();
const port = 3000;

app.use("/api", routes)

app.listen(port, () => {
    console.log(" serverted started on port 3000")
})