<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Maps a database column storing an integer (the ordinal position from the
 * original C#/.NET enum) to a string-backed PHP enum, and back again on save.
 *
 * Usage in a model's casts():
 *   'type' => OrdinalEnumCast::using(TypeOfLaw::class),
 */
class OrdinalEnumCast implements CastsAttributes
{
    /**
     * @param class-string<\UnitEnum> $enumClass
     */
    public function __construct(protected string $enumClass) {}

    public static function using(string $enumClass): string
    {
        return static::class . ':' . $enumClass;
    }

    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        if ($value === null) {
            return null;
        }

        $cases = $this->enumClass::cases();
        $index = (int) $value;

        if (!isset($cases[$index])) {
            throw new \ValueError(
                "Ordinal value [{$value}] is out of range for enum [{$this->enumClass}] on column [{$key}]."
            );
        }

        return $cases[$index];
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        if ($value === null) {
            return null;
        }

        // Accept either the enum instance itself or its raw string value.
        if (is_string($value)) {
            $value = $this->enumClass::from($value);
        }

        $cases = $this->enumClass::cases();
        $index = array_search($value, $cases, true);

        if ($index === false) {
            throw new \ValueError("Could not resolve ordinal index for enum value on column [{$key}].");
        }

        return $index;
    }
}