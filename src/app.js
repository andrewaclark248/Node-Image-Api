import express from 'express'

const app = express();
const port = 3000;

//define a route handler for the default home page
app.get("/api", (req, res) => {
    res.send("sessrver working")
})

app.listen(port, () => {
    console.log(" serverted started on port 3000")
})