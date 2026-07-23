<?php

return [
    'uploads' => [
        'max_bytes' => 10 * 1024 * 1024,
        'max_pixels' => 40_000_000,
        'allowed_mime_types' => ['image/jpeg', 'image/png', 'image/webp'],
    ],
    'webp' => [
        'quality' => env('IMAGE_WEBP_QUALITY', 82),
        'queue' => env('IMAGE_CONVERSION_QUEUE', 'media'),
        'delete_original_after_conversion' => env(
            'IMAGE_DELETE_ORIGINAL_AFTER_CONVERSION',
            true,
        ),
        'convert_extensions' => ['jpg', 'jpeg', 'png'],
    ],
];
