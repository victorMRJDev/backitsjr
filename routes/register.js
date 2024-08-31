const { Router } = require("express")

const router = Router()

const { registerParams } = require('../controller/register')
router.post('/', registerParams)

module.exports = router