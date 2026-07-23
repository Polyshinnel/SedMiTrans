<?php

use App\Presentation\Http\Media\Controllers\DownloadPrivateMediaController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/media/private/{media}', DownloadPrivateMediaController::class)
    ->middleware('auth')
    ->name('media.private.download');
