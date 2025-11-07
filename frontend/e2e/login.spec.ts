import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can register and login', async ({ page }) => {
    // Register
    await page.goto('/register')
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/)
    
    // Login
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/)
  })
})

