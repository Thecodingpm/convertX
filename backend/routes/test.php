<?php
$raw = 'The file "file" exceeds your upload_max_filesize ini directive (limit is 2048 KiB).';
echo strpos($raw, 'max:') !== false ? "YES max:" : "NO max:";
