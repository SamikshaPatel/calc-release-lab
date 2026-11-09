import type { Locator, Page } from '@playwright/test'

export class CalculatorPage {
  readonly page: Page
  readonly display: Locator
  readonly keys: Locator

  constructor(page: Page) {
    this.page = page
    this.display = page.getByTestId('display')
    this.keys = page.getByRole('region', { name: 'Calculator' }).getByRole('button')
  }

  async goto() {
    await this.page.goto('/')
  }

  key(id: string) {
    return this.page.getByTestId(`key-${id}`)
  }
}
