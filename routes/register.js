const { Router } = require("express")

const router = Router()

const { registerParams, getRegsterParamas } = require('../controller/register');

router.post('/', registerParams);
router.get('/getParams', getRegsterParamas);



module.exports = router