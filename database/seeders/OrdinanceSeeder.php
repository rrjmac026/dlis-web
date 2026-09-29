<?php

namespace Database\Seeders;

use App\Enums\FinalAction;
use App\Enums\OrdinanceState;
use App\Enums\OrdinanceStatus;
use App\Enums\TypeOfLaw;
use App\Models\Ordinance;
use App\Models\OrdinanceVersion;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class OrdinanceSeeder extends Seeder
{
    /** How many ordinances to create. */
    private const COUNT = 30;

    private const TOPICS = [
        'Single-Use Plastics Regulation',
        'Market Vendor Fee Collection',
        'Youth Development Council',
        'Solid Waste Management',
        'Barangay Health Workers Incentive',
        'Traffic Code and Parking Regulation',
        'Water Refilling Station Standards',
        'Noise Control and Curfew',
        'Tourism Development Fund',
        'Public Market Stall Leasing',
        'Senior Citizens Discount Enforcement',
        'Stray Animal Control',
        'Disaster Risk Reduction Fund',
        'Business Permit Streamlining',
        'Coastal Resource Protection',
        'Tricycle Franchise Regulation',
        'Local Scholarship Program',
        'Anti-Littering Campaign',
        'Zoning and Land Use',
        'Livelihood Assistance Program',
    ];

    private const SPONSORS = [
        'Hon. Juan dela Cruz',
        'Hon. Maria Santos',
        'Hon. Pedro Reyes',
        'Hon. Ana Villanueva',
        'Hon. Roberto Garcia',
        'Hon. Elena Mendoza',
        'Hon. Carlos Bautista',
    ];

    private const COMMITTEES = [
        'Committee on Environment',
        'Committee on Youth Affairs',
        'Committee on Trade and Commerce',
        'Committee on Health',
        'Committee on Public Safety',
        'Committee on Tourism',
        'Committee on Appropriations',
        'Committee on Social Welfare',
    ];

    private const LOCATIONS = [
        'Poblacion',
        'Barangay Central',
        'Barangay San Isidro',
        'Barangay Riverside',
        'Municipality-wide',
        null,
    ];

    public function run(): void
    {
        $addedBy = User::query()->value('username') ?? 'seeder';
        $statuses = OrdinanceStatus::cases();

        for ($i = 1; $i <= self::COUNT; $i++) {
            $year = random_int(2012, 2026);
            $seq = random_int(1, 25);
            $number = sprintf('ORD-%d-%03d', $year, $seq);

            // Re-running the seeder won't create duplicates of the same number.
            if (Ordinance::where('ordinance_number', $number)->exists()) {
                continue;
            }

            $topic = self::TOPICS[array_rand(self::TOPICS)];
            $status = $statuses[array_rand($statuses)];

            $passed = Carbon::create($year, random_int(1, 12), random_int(1, 28));
            $approved = $passed->copy()->addDays(random_int(2, 10));
            $published = $approved->copy()->addDays(random_int(2, 10));

            $ordinance = Ordinance::create([
                'ordinance_number' => $number,
                'series_number' => "Series of {$year}, No. {$seq}",
                'title' => "{$topic} Ordinance",
                'subject' => "An Ordinance Providing for the {$topic}",
                'type' => TypeOfLaw::Ordinance,
                'status' => $status,
                'sponsor' => self::SPONSORS[array_rand(self::SPONSORS)],
                'committee' => self::COMMITTEES[array_rand(self::COMMITTEES)],
                'date_passed' => $passed,
                'date_approved' => $approved,
                'date_published' => $published,
                'reference_number' => 'REF-' . random_int(1000, 9999),
                'location' => self::LOCATIONS[array_rand(self::LOCATIONS)],
                'final_action' => random_int(0, 1) ? FinalAction::cases()[array_rand(FinalAction::cases())] : null,
                'state' => OrdinanceState::cases()[array_rand(OrdinanceState::cases())],
                'added_by' => $addedBy,
                'added_at' => now(),
            ]);

            $this->createVersions($ordinance, $topic, $approved, $status);
        }
    }

    private function createVersions(Ordinance $ordinance, string $topic, Carbon $approved, OrdinanceStatus $status): void
    {
        OrdinanceVersion::create([
            'ordinance_id' => $ordinance->id,
            'version_number' => 1,
            'title' => "{$topic} Ordinance",
            'content' => "Original ordinance text on the {$topic}, including definitions, prohibited acts, and penalties.",
            'date_enacted' => $approved,
            'enacted_by' => $ordinance->ordinance_number,
            'amendment_notes' => null,
        ]);

        // Amended / superseded ordinances get 1-2 extra versions.
        if (in_array($status, [OrdinanceStatus::Amended, OrdinanceStatus::Superseded], true)) {
            $extra = random_int(1, 2);

            for ($v = 2; $v <= $extra + 1; $v++) {
                OrdinanceVersion::create([
                    'ordinance_id' => $ordinance->id,
                    'version_number' => $v,
                    'title' => "{$topic} Ordinance (Amendment {$v})",
                    'content' => "Amendment {$v} revising the provisions and penalties of the {$topic} Ordinance.",
                    'date_enacted' => $approved->copy()->addYears($v - 1)->addDays(random_int(10, 90)),
                    'enacted_by' => 'Ordinance No. ' . ($approved->year + $v - 1) . '-' . sprintf('%03d', random_int(1, 40)),
                    'amendment_notes' => 'Expanded coverage and updated penalty provisions.',
                ]);
            }
        }
    }
}