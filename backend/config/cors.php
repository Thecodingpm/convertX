<?php

return [
    'paths'                    => ['api/*'],
    'allowed_methods'          => ['*'],
    'allowed_origins'          => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => [],
    'max_age'                  => 86400,
    // Must be false when allowed_origins is '*'
    // (browser rejects credentials + wildcard origin per CORS spec)
    'supports_credentials'     => false,
];
