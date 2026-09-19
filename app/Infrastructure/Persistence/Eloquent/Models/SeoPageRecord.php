<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;

final class SeoPageRecord extends Model
{
    protected $table = 'seo_pages';

    protected $fillable = ['key', 'name', 'path', 'title', 'description'];
}
