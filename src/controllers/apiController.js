
class AuthController {

    show(req, res, next) {

        //res.sendFile(fileName)
        console.log("api request created haahahh");
        res.send("show action response");
    }

}



export default new AuthController;
