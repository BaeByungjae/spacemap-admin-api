const router = require('express').Router()
const { adminLoginControl, adminLogoutControl, changePasswordControl, issueAccessToken } = require('../controllers/admin')
const verifyToken = require('../lib/auth-middleware')
const wrapper = require('../lib/request-handler')

router.get('/', async function (_req, res) {
  res.json({

  })
})

router.post('/login', wrapper(adminLoginControl))
router.post('/logout', wrapper(adminLogoutControl))
router.put('/password', verifyToken, wrapper(changePasswordControl))
router.get('/accesstoken', wrapper(issueAccessToken))

module.exports = router
