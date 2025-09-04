const express = require('express')
const { UserReg } = require('../controllers/AuthController')
const { default: mongoose } = require('mongoose')
const router = express.Router()

router.post('/register',UserReg)
// router.post('/login')

module.exports = router