const express = require('express')
const router = require('./routers')
const DB = require('./db')
require('dotenv').config()
const PORT =process.env.PORT
const app = express()

DB()
app.use(express.json())
app.use('/api',router)
app.listen(PORT,()=>{
    console.log("App listen port " + PORT );
})