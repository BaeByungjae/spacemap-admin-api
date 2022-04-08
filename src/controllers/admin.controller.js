const { BadRequestException, UnauthorizedException } = require('../common/exceptions')
const { getAdminInfoService, adminLoginService, changePasswordService, adminLogoutService, issueTokenService } = require('../services/admin.service')

const getAdminInfoControl = async (req, res) => {
  const { id } = req.query
  if (!id) {
    throw new BadRequestException('Wrong body info.')
  }
  return {
    data: await getAdminInfoService(id),
  }
}

const adminLoginControl = async (req, res) => {
  res
    .clearCookie('accesstoken')
    .clearCookie('refreshtoken')
  const { id, password, name } = req.body
  if (!id || !password || !name) {
    throw new BadRequestException('Wrong body info.')
  }
  const { accesstoken, refreshtoken } = await adminLoginService(id, password, name)
  res
    .cookie('accesstoken', accesstoken, { httpOnly: true })
    .cookie('refreshtoken', refreshtoken, { httpOnly: true })
  return {
    message: 'Login success.',
    data: {
      accesstoken,
      refreshtoken,
    }
  }
}

const adminLogoutControl = async (req, res) => {
  const { id, name } = req
  if (!id || !name) {
    throw new UnauthorizedException('Login first.')
  }
  await adminLogoutService(id, name)
  res
    .clearCookie('accesstoken')
    .clearCookie('refreshtoken')
  return {
    message: 'Logout success.',
  }
}

const changePasswordControl = async (req, res) => {
  const { id, fromPassword, toPassword } = req.body
  if (!id || !fromPassword || !toPassword) {
    throw new BadRequestException('Wrong body info.')
  }
  if (req.id !== id) {
    throw new UnauthorizedException('Login again.')
  }

  await changePasswordService(id, fromPassword, toPassword)
  return {
    success: true,
    message: 'Password has successfully changed.'
  }
}

const issueTokenControl = async (req, res) => {
  const { accesstoken, refreshtoken } = req.cookies
  if (!accesstoken || !refreshtoken) {
    throw new BadRequestException('Append both accesstoken and refreshToken.')
  }

  const { newAccessToken } = await issueTokenService(accesstoken, refreshtoken)
  res.cookie('accesstoken', newAccessToken, { httpOnly: true })
  return {
    message: "Successfully accesstoken issued.",
    data: {
      accesstoken: newAccessToken,
    },
  }
}

module.exports = {
  getAdminInfoControl,
  adminLoginControl, 
  adminLogoutControl,
  changePasswordControl,
  issueTokenControl,
}