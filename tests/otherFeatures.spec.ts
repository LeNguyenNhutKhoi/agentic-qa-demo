import { test, expect } from '@playwright/test'
import { LoginPage, RegisterPage, CheckoutPage } from '../pom/appPages'
test('TC01 đăng nhập đúng mật khẩu', async ({ page }) => {
  const login = new LoginPage(page)
  await login.login('user_a', 'Pass@123')
  await expect(login.toast()).toHaveText('Đăng nhập thành công')
})
test('TC02 đăng nhập sai mật khẩu', async ({ page }) => {
  const login = new LoginPage(page)
  await login.login('user_a', 'sai-mat-khau')
  await expect(login.toast()).toHaveText('Sai mật khẩu')
})
test('TC07 thanh toán đơn hàng', async ({ page }) => {
  const checkout = new CheckoutPage(page)
  await checkout.pay()
  await expect(checkout.toast()).toHaveText('Thanh toán thành công')
})
test('TC08 đăng ký tài khoản', async ({ page }) => {
  const reg = new RegisterPage(page)
  await reg.register('user_d@test.com', 'Pass@1234')
  await expect(reg.toast()).toHaveText('Đăng ký thành công')
})
