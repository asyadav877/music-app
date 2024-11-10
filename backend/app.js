const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const userDb = [];

const checkUser = (req, res, next) => {
    console.log("Inside check user function")
    const user = req.body;
    let userFound  = userDb.find(ele => ele.username === user.username);
    
    if(userFound) res.status(401).json({
        msg: "User already exist. Please logIn"
    })
    else next()
}

app.use(express.json());
app.get('/', (req, res) => {
    res.status(200).json({
        msg: "Welcome to music app"
    })
})

app.post('/signup', checkUser, (req, res) => {
    const user = req.body;
    userDb.push(user);
    console.log(userDb);
    res.status(200).json({
        msg: "User has been signed up 🚀"
    })
})


app.listen(PORT, () => console.log(`Http webserver started listening on port: ${PORT}`))

