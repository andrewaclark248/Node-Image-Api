import express from 'express'
import apiRoutes from './routes/api/apiRoutes'
import routes from './routes/index'

const app = express();
let port = 3000;

app.use("/api", apiRoutes)
app.use("/", routes)

app.listen(port, () => {
    console.log(" serverted started on port 3000")
})

//step 1
// placeholder api
// place images in front end


//step 2
// serve scaled versions to the front end to reduce page load size
// handle resizing and serve stored images for you


//hit url
// localhost:3000/api/images?filename=argentina
// localhost:3000/api/images?filename=argentina&width=200&height=200
//displayed in rezied image


//image not being repocessed
//servingt the thumb