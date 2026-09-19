<?php

namespace Tests\Feature\Api;

use App\Infrastructure\Contact\ContactSettings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ContactSettingsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        if (! in_array('sqlite', \PDO::getAvailableDrivers(), true)) {
            $this->markTestSkipped('The SQLite PDO driver is not installed. Run this feature suite in the MySQL test environment.');
        }

        parent::setUp();
    }

    public function test_it_returns_contact_settings_for_the_public_site(): void
    {
        app(ContactSettings::class)->put([
            'phone' => '+7 999 000-00-00',
            'email' => 'contacts@example.test',
            'address' => 'г. Смоленск, ул. Тестовая, д. 1',
            'telegram_url' => 'https://t.me/example',
            'whatsapp_url' => '',
            'max_url' => 'https://max.ru/example',
            'working_hours' => 'Пн–Пт: 09:00–18:00',
            'latitude' => '54.77908',
            'longitude' => '32.0162',
        ]);

        $this->getJson('/api/v1/contacts')
            ->assertOk()
            ->assertJsonPath('data.phone', '+7 999 000-00-00')
            ->assertJsonPath('data.telegram_url', 'https://t.me/example')
            ->assertJsonPath('data.whatsapp_url', '')
            ->assertJsonPath('data.latitude', '54.77908');
    }
}
