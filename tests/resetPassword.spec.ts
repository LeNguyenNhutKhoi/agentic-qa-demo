import { test, expect } from '@playwright/test'
import { AuthPage } from '../pom/authPage'
const okMsg = 'Đã gửi link đặt lại mật khẩu'
test('TC03 gửi link đặt lại mật khẩu', async ({ page }) => {
  const auth = new AuthPage(page)
  await auth.openForgotPassword()
  await auth.submitResetEmail('user_a@test.com')
  await expect(auth.toast()).toHaveText(okMsg)
})
test('TC09 gửi lại link lần 2', async ({ page }) => {
  const auth = new AuthPage(page)
  await auth.openForgotPassword()
  await auth.submitResetEmail('user_b@test.com')
  await auth.submitResetEmail('user_b@test.com')
  await expect(auth.toast()).toHaveText(okMsg)
})
test('TC11 gửi link với email viết hoa', async ({ page }) => {
  const auth = new AuthPage(page)
  await auth.openForgotPassword()
  await auth.submitResetEmail('USER_C@TEST.COM')
  await expect(auth.toast()).toHaveText(okMsg)
})
