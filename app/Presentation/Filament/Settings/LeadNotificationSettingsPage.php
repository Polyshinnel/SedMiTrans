<?php

namespace App\Presentation\Filament\Settings;

use App\Infrastructure\Lead\LeadNotificationSettings;
use Filament\Actions\Action;
use Filament\Forms\Components\TagsInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Schema;

final class LeadNotificationSettingsPage extends Page
{
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-bell';
    protected static ?string $navigationLabel = 'Настройки рассылки';
    protected static ?string $title = 'Настройки рассылки заявок';
    protected static ?string $slug = 'settings/lead-notifications';
    protected string $view = 'filament-panels::pages.page';

    public array $data = [];

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('admin.manage') ?? false;
    }

    public function mount(): void
    {
        $settings = app(LeadNotificationSettings::class);
        $this->form->fill(['emails' => $settings->emailRecipients(), 'chat_ids' => $settings->telegramChatIds()]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema->statePath('data')->components([
            Section::make('Получатели')->schema([
                TagsInput::make('emails')->label('Email получателей')->placeholder('Добавьте email и нажмите Enter')->nestedRecursiveRules(['email'])->required(),
                TagsInput::make('chat_ids')->label('Telegram chat_id')->placeholder('Добавьте chat_id и нажмите Enter')->required(),
            ]),
        ]);
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([Form::make([EmbeddedSchema::make('form')])]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('save')->label('Сохранить')->action('save'),
            Action::make('test')->label('Отправить тест')->color('gray')->action('sendTest'),
        ];
    }

    public function save(): void
    {
        $data = $this->form->getState();
        app(LeadNotificationSettings::class)->put(LeadNotificationSettings::EMAILS_KEY, $data['emails'] ?? []);
        app(LeadNotificationSettings::class)->put(LeadNotificationSettings::TELEGRAM_KEY, $data['chat_ids'] ?? []);
        Notification::make()->title('Настройки сохранены')->success()->send();
    }

    public function sendTest(): void
    {
        $this->save();
        $settings = app(LeadNotificationSettings::class);
        $token = (string) config('services.telegram.bot_token');
        if ($token === '') {
            Notification::make()->title('Не настроен TELEGRAM_BOT_TOKEN')->danger()->send();
            return;
        }

        try {
            foreach ($settings->telegramChatIds() as $chatId) {
                \Illuminate\Support\Facades\Http::timeout(15)->post("https://api.telegram.org/bot{$token}/sendMessage", ['chat_id' => $chatId, 'text' => 'Тестовое уведомление sedmitrans.ru'])->throw();
            }
            \Illuminate\Support\Facades\Mail::raw('Тестовое уведомление sedmitrans.ru', fn ($message) => $message->to($settings->emailRecipients())->subject('Тестовое уведомление'));
            Notification::make()->title('Тестовые сообщения отправлены')->success()->send();
        } catch (\Throwable $exception) {
            Notification::make()->title('Тестовая отправка не удалась')->body($exception->getMessage())->danger()->send();
        }
    }
}
