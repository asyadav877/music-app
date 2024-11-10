const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).json({
        msg: "Welcome to music app"
    })
})


app.listen(PORT, () => console.log(`Http webserver started listening on port: ${PORT}`))

