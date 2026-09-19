<?php

namespace App\Presentation\Filament\Lead;

use App\Infrastructure\Persistence\Eloquent\Models\LeadRecord;
use App\Presentation\Filament\Lead\Pages\ViewLead;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Filament\Infolists\Components\TextEntry;

final class LeadResource extends Resource
{
    protected static ?string $model = LeadRecord::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-inbox';
    protected static ?string $navigationLabel = 'Заявки';
    protected static ?string $modelLabel = 'заявка';
    protected static ?string $pluralModelLabel = 'Заявки';
    public static function canViewAny(): bool { return auth()->user()?->hasPermission('lead.view') ?? false; }
    public static function canView(\Illuminate\Database\Eloquent\Model $record): bool { return static::canViewAny(); }
    public static function canCreate(): bool { return false; }
    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool { return false; }
    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool { return false; }
    public static function form(Schema $schema): Schema { return $schema->components([]); }
    public static function infolist(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Основные данные')->schema([
                TextEntry::make('type')->label('Тип')->formatStateUsing(fn (?string $state): string => $state === 'quote' ? 'Запрос расчёта' : 'Обратная связь'),
                TextEntry::make('status')->label('Статус')->formatStateUsing(fn (?string $state): string => $state === 'read' ? 'Прочитано' : 'Новое'),
                TextEntry::make('name')->label('Имя'), TextEntry::make('phone')->label('Телефон'),
                TextEntry::make('email')->label('Email')->placeholder('Не указан'),
                TextEntry::make('submitted_at')->label('Дата получения')->dateTime('d.m.Y H:i'),
            ])->columns(2),
            Section::make('Данные обращения')->schema([
                TextEntry::make('cargo')->label('Груз')->placeholder('Не указано')->visible(fn (LeadRecord $record): bool => $record->type === 'quote'),
                TextEntry::make('route')->label('Маршрут')->placeholder('Не указано')->visible(fn (LeadRecord $record): bool => $record->type === 'quote'),
                TextEntry::make('cargo_parameters')->label('Параметры груза')->placeholder('Не указано')->visible(fn (LeadRecord $record): bool => $record->type === 'quote'),
                TextEntry::make('message')->label('Сообщение')->placeholder('Не указано')->visible(fn (LeadRecord $record): bool => $record->type === 'feedback')->columnSpanFull(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->label('Имя')->searchable(), TextColumn::make('phone')->label('Телефон')->searchable(), TextColumn::make('email')->label('Email')->searchable(),
            TextColumn::make('type')->label('Тип сообщения')->badge()->formatStateUsing(fn (string $state): string => $state === 'quote' ? 'Расчёт' : 'Запрос'),
            TextColumn::make('submitted_at')->label('Дата получения')->dateTime('d.m.Y H:i')->sortable(),
            TextColumn::make('status')->label('Статус')->badge()->formatStateUsing(fn (string $state): string => $state === 'read' ? 'Прочитано' : 'Новое'),
        ])->filters([
            SelectFilter::make('type')->label('Тип')->options(['feedback' => 'Запрос', 'quote' => 'Расчёт']),
            SelectFilter::make('status')->label('Статус')->options(['new' => 'Новое', 'read' => 'Прочитано']),
        ])->recordUrl(fn (LeadRecord $record): string => static::getUrl('view', ['record' => $record]));
    }
    public static function getPages(): array { return ['index' => Pages\ListLeads::route('/'), 'view' => ViewLead::route('/{record}')]; }
}
