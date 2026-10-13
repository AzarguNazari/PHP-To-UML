<?php

namespace App\Billing;

use App\Contracts\Payable;

#[Entity]
final class Invoice extends Document implements Payable
{
    use HasTotals;

    public const string PREFIX = 'INV';

    public string $number {
        get => self::PREFIX . $this->id;
    }

    private ?Customer $customer = null;

    public function __construct(private readonly int $id) {}

    public static function draft(Customer $customer, string ...$lines): static
    {
        return new static(0);
    }

    protected function &items(): array
    {
        return [];
    }
}

enum InvoiceState: string
{
    case Draft = 'draft';
    case Paid = 'paid';
}
