import { test, expect } from '@playwright/test';

test.describe('Reservations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@sapphire.luxury');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**');
  });
  
  test('should navigate to new reservation wizard', async ({ page }) => {
    await page.goto('/reservations/new');
    
    // Should show wizard step 1 (Guest)
    await expect(page.locator('text=Client')).toBeVisible();
  });
  
  test('should display calendar view', async ({ page }) => {
    await page.goto('/reservations/calendar');
    
    // Should show month grid
    await expect(page.locator('text=Janvier')).toBeVisible();
    await expect(page.locator('text=Février')).toBeVisible();
  });
  
  test('should prevent overbooking', async ({ page, request }) => {
    // Create first reservation
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    // Get a guest + room type via API
    const guests = await request.get('/api/guests?pageSize=1');
    const roomTypes = await request.get('/api/room-types');
    
    const guest = (await guests.json()).items[0];
    const roomType = (await roomTypes.json()).items[0];
    
    // First reservation
    await request.post('/api/reservations', {
      data: {
        guestId: guest.id,
        roomTypeId: roomType.id,
        checkIn: today.toISOString(),
        checkOut: tomorrow.toISOString(),
        adults: 1,
      },
    });
    
    // Second reservation should fail
    const response = await request.post('/api/reservations', {
      data: {
        guestId: guest.id,
        roomTypeId: roomType.id,
        checkIn: today.toISOString(),
        checkOut: tomorrow.toISOString(),
        adults: 1,
      },
    });
    
    expect(response.status()).toBe(409); // Conflict
  });
});
