const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "ABFISDBISDBVOSDINVOISDVHOBV";

const userDb = [];

function createDummyUsers(){
    for(let i=0; i<Math.ceil(Math.random()*10); i++){
        userDb.push({
            username:  `user-${i}`,
            password: `password-${i}`
        })
    }
}

const requestLogger = (req, res, next) => {
    console.log(`${req.method} request on uri: ${req.originalUrl}`);
    next()
}

const checkUser = (req, res, next) => {
    console.log("Inside check user function")
    const user = req.body;
    let userFound  = userDb.find(ele => ele.username === user.username);
    
    if(userFound) res.status(401).json({
        msg: "User already exist. Please logIn"
    })
    else next()
}

const verifyUser = (req, res, next) => {
    console.log("Inside verify user function");

    const user = req.body;
    const foundUser = userDb.find((ele => ele.username === user.username && ele.password === user.password));
    if (foundUser) next()
    else res.status(404).json({
        msg: "Username of Password is Incorrect"
    })
}

const verifyToken = (req, res, next) => {
    console.log("Inside verify token function");

    const token = req.headers.token;

    if(!token){
        return res.status(403).json({msg: "Authorization token missing. Please log in."})
    }
    try {
        let decoded = jwt.verify(token, JWT_SECRET);
        req.username = decoded.username;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ msg: "Invalid token. Please log in again." });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ msg: "Session expired. Please log in again." });
        } else {
            return res.status(500).json({ msg: "An unexpected error occurred." });
        }
    }
}

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.get('/', (req, res) => {
    res.sendFile("/Users/ashishyadav/Documents/GitHub/music-app/frontend/public/index.html")
})

app.get('/about', (req, res) => {res.status(200).json({msg: "Welcome to music app"})})

app.post('/signup', checkUser, (req, res) => {
    const user = req.body;
    userDb.push(user);
    res.status(200).json({
        msg: "User has been signed up 🚀"
    })
})

app.post('/login', verifyUser, (req, res) => {
    const user = req.body;
    let token = jwt.sign({
        username: user.username
    }, JWT_SECRET);

    res.status(200).json({
        token: token,
        msg: "User has been signed in"
    })
})

app.get('/me', verifyToken, (req, res) => {
    let user = userDb.find(ele => ele.username === req.username);
    res.status(200).json(user);
})

app.get('/allUsers', (req, res) => {
    res.status(200).json(userDb);
})

createDummyUsers();
app.listen(PORT, () => console.log(`Http webserver started listening on port: ${PORT}`))

