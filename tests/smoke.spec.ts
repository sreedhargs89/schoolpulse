import { test, expect } from '@playwright/test';

test.describe('SchoolPulse Smoke Tests', () => {

    test('home page loads', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/SchoolPulse/);
        await expect(page.getByText('SchoolPulse').first()).toBeVisible();
    });

    test('homework page loads', async ({ page }) => {
        await page.goto('/homework');
        // Check for common elements or just that it didn't 404/crash
        // Assuming the page title or a header exists
        await expect(page.getByRole('main')).toBeVisible();
    });

    test('dates page loads', async ({ page }) => {
        await page.goto('/dates');
        await expect(page).toHaveTitle(/SchoolPulse/);
        await expect(page.getByText('Important Dates')).toBeVisible();
    });

    test('rhymes page loads', async ({ page }) => {
        await page.goto('/rhymes');
        await expect(page).toHaveTitle(/SchoolPulse/);
    });

    test('week view page loads', async ({ page }) => {
        await page.goto('/week');
        await expect(page).toHaveTitle(/SchoolPulse/);
    });

    test('NOF page loads', async ({ page }) => {
        await page.goto('/nof');
        await expect(page).toHaveTitle(/SchoolPulse/);
    });

    // Test that checks navigation from home
    test('navigation works', async ({ page }) => {
        await page.goto('/');
        await page.getByText('Homework').click();
        await expect(page.url()).toContain('/homework');
    });
});
