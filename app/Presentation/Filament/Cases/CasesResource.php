<?php

namespace App\Presentation\Filament\Cases;

use App\Infrastructure\Persistence\Eloquent\Models\CaseRecord;
use App\Presentation\Filament\Cases\Pages\CreateCase;
use App\Presentation\Filament\Cases\Pages\EditCase;
use App\Presentation\Filament\Cases\Pages\ListCases;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

final class CasesResource extends Resource
{
    protected static ?string $model = CaseRecord::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-briefcase';

    protected static ?string $navigationLabel = 'Кейсы';

    protected static ?string $modelLabel = 'кейс';

    protected static ?string $pluralModelLabel = 'Кейсы';

    public static function canViewAny(): bool
    {
        return auth()->user()?->hasPermission('admin.manage') ?? false;
    }

    public static function canDelete(Model $record): bool
    {
        return self::canViewAny();
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('SEO')->schema([
                TextInput::make('seo_title')->label('Заголовок')->required()->maxLength(255),
                Textarea::make('seo_description')->label('Краткое описание')->required()->rows(4)->maxLength(1000),
                TextInput::make('slug')->label('Slug')->helperText('Если оставить пустым, будет создан автоматически из заголовка.'),
            ])->columns(2),
            Section::make('Текст')->schema([
                TextInput::make('title')->label('Заголовок')->required()->maxLength(255),
                Textarea::make('excerpt')->label('Краткое описание')->required()->rows(4)->maxLength(1000),
                DatePicker::make('published_at')->label('Дата')->required()->displayFormat('d.m.Y')->format('Y-m-d'),
                RichEditor::make('body')->label('Полный текст')->required()->columnSpanFull(),
            ])->columns(2),
            Section::make('Изображения')->schema([
                Repeater::make('images')->relationship()->label('Галерея')->schema([
                    FileUpload::make('path')
                        ->label('Изображение')
                        ->disk('public')
                        ->directory('cases')
                        ->visibility('public')
                        ->image()
                        ->required()
                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                        ->maxSize(20 * 1024),
                    Toggle::make('is_primary')->label('Сделать главным'),
                ])->reorderable()->orderColumn('sort_order')->defaultItems(0)->columnSpanFull(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            ImageColumn::make('images.path')->label('Изображение')->disk('public')->getStateUsing(fn (CaseRecord $record): ?string => $record->images()->where('is_primary', true)->value('path') ?? $record->images()->value('path')),
            TextColumn::make('title')->label('Заголовок')->searchable()->sortable()->wrap(),
            TextColumn::make('excerpt')->label('Краткое описание')->limit(100)->wrap(),
        ])->actions([
            EditAction::make()->label('Редактировать'),
            DeleteAction::make()->label('Удалить'),
        ])->defaultSort('published_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCases::route('/'),
            'create' => CreateCase::route('/create'),
            'edit' => EditCase::route('/{record}/edit'),
        ];
    }
}
