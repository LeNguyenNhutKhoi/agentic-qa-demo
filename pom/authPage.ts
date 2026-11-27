import { BasePage } from './basePage'
import auth from '../locators/auth.json'
export class AuthPage extends BasePage {
  async openForgotPassword() {
    await this.open('/forgot-password')
  }
  async submitResetEmail(email: string) {
    await this.fill(auth.email, email)
    await this.click(auth.sendBtn)
  }
  toast() {
    return this.loc(auth.toast)
  }
  emailError() {
    return this.loc(auth.emailError)
  }
}
