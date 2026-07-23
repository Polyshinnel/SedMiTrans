<?php

namespace App\Presentation\Filament\Lead;

use App\Infrastructure\Persistence\Eloquent\Models\LeadRecord;
use Filament\Actions\Action;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Select;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

final class LeadResource extends Resource
{
    protected static ?string $model = LeadRecord::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-inbox';
    protected static ?string $navigationLabel = 'Заявки';
    protected static ?string $modelLabel = 'заявка';
    protected static ?string $pluralModelLabel = 'Заявки';
    public static function canViewAny(): bool { return auth()->user()?->hasPermission('lead.view') ?? false; }
    public static function canCreate(): bool { return false; }
    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool { return false; }
    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool { return false; }
    public static function form(Schema $schema): Schema { return $schema->components([]); }
    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('id')->label('ID')->copyable()->toggleable(isToggledHiddenByDefault: true), TextColumn::make('name')->label('Имя')->searchable(), TextColumn::make('phone')->label('Телефон')->searchable(), TextColumn::make('email')->label('E-mail')->searchable(), TextColumn::make('status')->label('Статус')->badge(), TextColumn::make('submitted_at')->label('Получена')->dateTime('d.m.Y H:i'),
        ])->recordActions([
            Action::make('changeStatus')->label('Изменить статус')->visible(fn (): bool => auth()->user()?->hasPermission('lead.change-status') ?? false)->schema([Select::make('target_status')->label('Новый статус')->options(['in_progress' => 'В работе', 'completed' => 'Завершена', 'rejected' => 'Отклонена'])->required()])->action(function (LeadRecord $record, array $data): void {
                try { app(\App\Application\Lead\Handlers\ChangeLeadStatusHandler::class)->handle(new \App\Application\Lead\Commands\ChangeLeadStatus($record->id, $data['target_status'], (string) auth()->id())); }
                catch (\Throwable $exception) { \Filament\Notifications\Notification::make()->title('Статус не изменён')->body($exception->getMessage())->danger()->send(); }
            }),
        ]);
    }
    public static function getPages(): array { return ['index' => Pages\ListLeads::route('/')]; }
}
