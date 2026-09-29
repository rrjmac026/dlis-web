<?php

namespace App\Casts;

use BackedEnum;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Contracts\Database\Eloquent\SerializesCastableAttributes;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

/**
 * Maps a string-backed PHP enum to the ordinal (0-based position of the case)
 * that the WPF app stores in the database.
 *
 * The order of the cases in each enum MUST match the order of the members in
 * the matching C# enum.
 */
class OrdinalEnumCast implements CastsAttributes, SerializesCastableAttributes
{
    /** @param class-string<BackedEnum> $enumClass */
    public function __construct(protected string $enumClass) {}

    public static function using(string $enumClass): string
    {
        return static::class . ':' . $enumClass;
    }

    /** DB ordinal -> enum */
    public function get(Model $model, string $key, mixed $value, array $attributes): ?BackedEnum
    {
        if ($value === null || $value === '') {
            return null;
        }

        return ($this->enumClass)::cases()[(int) $value] ?? null;
    }

    /** enum / string value / ordinal -> DB ordinal */
    public function set(Model $model, string $key, mixed $value, array $attributes): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        $cases = ($this->enumClass)::cases();

        if ($value instanceof BackedEnum) {
            $value = $value->value;
        } elseif (is_int($value) || (is_string($value) && ctype_digit($value))) {
            $ordinal = (int) $value;

            if (isset($cases[$ordinal])) {
                return $ordinal;
            }

            throw new InvalidArgumentException("Ordinal {$ordinal} is out of range for {$this->enumClass}.");
        }

        foreach ($cases as $index => $case) {
            if ($case->value === $value) {
                return $index;
            }
        }

        throw new InvalidArgumentException("'{$value}' is not a valid value for {$this->enumClass}.");
    }

    /** JSON output: the enum's string value, e.g. "in_effect" */
    public function serialize(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return $value instanceof BackedEnum ? $value->value : $value;
    }
}