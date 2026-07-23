<?php

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class DomainIsolationTest extends TestCase
{
    #[Test]
    public function domain_does_not_depend_on_framework_or_other_layers(): void
    {
        $files = glob(dirname(__DIR__, 2).'/app/Domain/**/*.php', GLOB_BRACE);
        $files = array_merge($files ?: [], glob(dirname(__DIR__, 2).'/app/Domain/*/*.php') ?: [], glob(dirname(__DIR__, 2).'/app/Domain/*/*/*.php') ?: []);

        foreach (array_unique($files) as $file) {
            $contents = file_get_contents($file);
            self::assertIsString($contents);
            self::assertDoesNotMatchRegularExpression('/(?:use|extends|new)\\s+(?:Illuminate|Filament)\\\\/m', $contents, $file);
            self::assertDoesNotMatchRegularExpression('/App\\\\(?:Application|Infrastructure|Presentation)\\\\/', $contents, $file);
            self::assertDoesNotMatchRegularExpression('/\\b(?:DB|Cache|Queue|Mail|Event|Log)::|\\b(?:event|dispatch)\\s*\\(/', $contents, $file);
        }
    }
}
