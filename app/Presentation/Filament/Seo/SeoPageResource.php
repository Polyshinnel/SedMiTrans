<?php

namespace App\Presentation\Filament\Seo;

use App\Infrastructure\Persistence\Eloquent\Models\SeoPageRecord;
use App\Presentation\Filament\Seo\Pages\EditSeoPage;
use App\Presentation\Filament\Seo\Pages\ListSeoPages;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

final class SeoPageResource extends Resource
{
    protected static ?string $model = SeoPageRecord::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-globe-alt';
    protected static ?string $navigationLabel = 'SEO';
    protected static ?string $modelLabel = 'SEO-страница';
    protected static ?string $pluralModelLabel = 'SEO';

    public static function canViewAny(): bool
    {
        return auth()->user()?->hasPermission('admin.manage') ?? false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('SEO-данные')->schema([
                TextInput::make('name')->label('Название страницы')->disabled()->dehydrated(false),
                TextInput::make('path')->label('Адрес страницы')->disabled()->dehydrated(false),
                TextInput::make('title')->label('Заголовок')->required()->maxLength(255),
                Textarea::make('description')->label('Описание')->required()->rows(5)->maxLength(1000),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->label('Название страницы')->searchable()->sortable(),
            TextColumn::make('path')->label('Адрес страницы')->searchable(),
            TextColumn::make('title')->label('Заголовок')->limit(55)->wrap(),
            TextColumn::make('description')->label('Описание')->limit(80)->wrap(),
        ])->actions([
            EditAction::make()->label('Редактировать'),
        ])->defaultSort('id');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSeoPages::route('/'),
            'edit' => EditSeoPage::route('/{record}/edit'),
        ];
    }
}
