<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Image Driver
    |--------------------------------------------------------------------------
    |
    | GD используется как основной драйвер обработки изображений. Docker image
    | должен содержать GD с поддержкой FreeType, JPEG, PNG и WebP, а также EXIF.
    |
    */
    'driver' => env('IMAGE_DRIVER', \Intervention\Image\Drivers\Gd\Driver::class),

    'options' => [
        'autoOrientation' => true,
        'decodeAnimation' => true,
        'backgroundColor' => 'ffffff',
        'strip' => true,
    ],
];
