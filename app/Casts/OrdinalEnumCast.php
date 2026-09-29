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

    /**
     * Enum instance, enum string value ("in_effect") or ordinal (1 / "1")
     * -> DB ordinal. Returns null if it matches no case.
     * Use this for query filters, since queries bypass the model cast.
     *
     * @param class-string<BackedEnum> $enumClass
     */
    public static function toOrdinal(string $enumClass, mixed $value): ?int
    {
        if ($value instanceof BackedEnum) {
            $value = $value->value;
        }

        $cases = $enumClass::cases();

        if (is_int($value) || (is_string($value) && ctype_digit($value))) {
            return isset($cases[(int) $value]) ? (int) $value : null;
        }

        foreach ($cases as $index => $case) {
            if ($case->value === $value) {
                return $index;
            }
        }

        return null;
    }

    /**
     * DB ordinal -> enum string value ("in_effect"), or null.
     * Use this for raw / toBase() query results, which skip the model cast.
     *
     * @param class-string<BackedEnum> $enumClass
     */
    public static function valueOf(string $enumClass, mixed $ordinal): ?string
    {
        if ($ordinal === null || $ordinal === '') {
            return null;
        }

        return ($enumClass::cases()[(int) $ordinal] ?? null)?->value;
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

        $ordinal = static::toOrdinal($this->enumClass, $value);

        if ($ordinal === null) {
            $shown = is_scalar($value) ? (string) $value : gettype($value);

            throw new InvalidArgumentException("'{$shown}' is not a valid value for {$this->enumClass}.");
        }

        return $ordinal;
    }

    /** JSON output: the enum's string value, e.g. "in_effect" */
    public function serialize(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return $value instanceof BackedEnum ? $value->value : $value;
    }
}