<?php

namespace App\Application\Lead\Exceptions;

use RuntimeException;

final class IdempotencyConflict extends RuntimeException {}
