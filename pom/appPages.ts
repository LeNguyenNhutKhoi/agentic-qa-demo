import { BasePage } from './basePage'
import app from '../locators/app.json'
export class LoginPage extends BasePage {
  async login(user: string, pass: string) {
    await this.open('/login')
    await this.fill(app.username, user)
    await this.fill(app.password, pass)
    await this.click(app.loginBtn)
  }
  toast() {
    return this.loc(app.toast)
  }
}
export class RegisterPage extends BasePage {
  async register(email: string, pass: string) {
    await this.open('/register')
    await this.fill(app.regEmail, email)
    await this.fill(app.regPassword, pass)
    await this.click(app.registerBtn)
  }
  toast() {
    return this.loc(app.toast)
  }
}
export class CheckoutPage extends BasePage {
  async pay() {
    await this.open('/checkout')
    await this.click(app.payBtn)
  }
  toast() {
    return this.loc(app.toast)
  }
}
