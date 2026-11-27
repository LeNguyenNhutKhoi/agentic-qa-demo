import { test, expect } from '@playwright/test'
import { AuthPage } from '../pom/authPage'
test('TC03 gửi link đặt lại mật khẩu', async ({ page }) => {
  const auth = new AuthPage(page)
  await auth.openForgotPassword()
  await auth.submitResetEmail('user_a@test.com')
  await expect(auth.toast()).toHaveText('Đã gửi link đặt lại mật khẩu')
})
