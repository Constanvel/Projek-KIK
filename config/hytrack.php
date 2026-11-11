<?php

return [
    'hospital' => env('HYTRACK_HOSPITAL', 'RS Harapan Sehat'),

    // Hospital-local zone. Datetimes are stored in UTC; service_date is a local date.
    'timezone' => env('HYTRACK_TIMEZONE', 'Asia/Jakarta'),
];
