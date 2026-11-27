import { Page } from '@playwright/test'
export class BasePage {
  constructor(protected page: Page) {}
  async open(path: string) {
    await this.page.goto(path)
  }
  async click(sel: string) {
    await this.page.locator(sel).click()
  }
  async fill(sel: string, text: string) {
    await this.page.locator(sel).fill(text)
  }
  loc(sel: string) {
    return this.page.locator(sel)
  }
}
