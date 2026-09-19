<?php

namespace App\Presentation\Filament\Settings;

use App\Infrastructure\Contact\ContactSettings;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

final class ContactSettingsPage extends Page
{
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-map-pin';
    protected static ?string $navigationLabel = 'Контакты';
    protected static ?string $title = 'Контакты';
    protected static ?string $slug = 'settings/contacts';
    protected string $view = 'filament-panels::pages.page';

    public array $data = [];

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('admin.manage') ?? false;
    }

    public function mount(): void
    {
        $this->form->fill(app(ContactSettings::class)->get());
    }

    public function form(Schema $schema): Schema
    {
        return $schema->statePath('data')->components([
            Section::make('Основные контакты')->schema([
                TextInput::make('phone')->label('Телефон')->required()->maxLength(255),
                TextInput::make('email')->label('Почта')->email()->required()->maxLength(255),
                Textarea::make('address')->label('Адрес офиса')->required()->rows(2)->maxLength(500),
                Textarea::make('working_hours')->label('Режим работы')->required()->rows(2)->maxLength(500),
            ])->columns(2),
            Section::make('Мессенджеры')->schema([
                TextInput::make('telegram_url')->label('Telegram')->url()->nullable()->maxLength(1000),
                TextInput::make('whatsapp_url')->label('WhatsApp')->url()->nullable()->maxLength(1000),
                TextInput::make('max_url')->label('MAX')->url()->nullable()->maxLength(1000),
            ])->columns(3),
            Section::make('Координаты офиса')->schema([
                TextInput::make('latitude')->label('Широта')->required()->maxLength(100),
                TextInput::make('longitude')->label('Долгота')->required()->maxLength(100),
            ])->columns(2),
        ]);
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([Form::make([EmbeddedSchema::make('form')])]);
    }

    protected function getHeaderActions(): array
    {
        return [Action::make('save')->label('Сохранить')->action('save')];
    }

    public function save(): void
    {
        app(ContactSettings::class)->put($this->form->getState());
        Notification::make()->title('Контакты сохранены')->success()->send();
    }
}
