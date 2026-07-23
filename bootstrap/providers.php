<?php

use App\Infrastructure\Providers\LeadServiceProvider;
use App\Infrastructure\Providers\IdentityServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\Filament\AdminPanelProvider;
use App\Providers\HorizonServiceProvider;

return [
    AppServiceProvider::class,
    LeadServiceProvider::class,
    IdentityServiceProvider::class,
    AdminPanelProvider::class,
    HorizonServiceProvider::class,
];
