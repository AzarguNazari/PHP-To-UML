<?php
declare(strict_types=1);
namespace App\Domain;
use App\Contracts\{Repository, Cache as CacheContract};
use Some\Base;
#[Attr]
final readonly class User extends Base implements Repository, \Countable {
    use HasName, \Other\Trait2 { foo as bar; }
    public const int MAX = 3;
    private static ?array $cache = null;
    public function __construct(private readonly int|string $id, protected ?Address $addr = null, string ...$rest) {}
    abstract protected function find(int $id): static|null;
    public static function make(Foo&Bar $x = new Foo()): self { return new class {}; }
    public function count(): int { return 0; }
}
interface Repository extends A, B { public function all(): iterable; const X = 1; }
trait HasName { public string $name; abstract public function n(): string; }
enum Status: string implements HasLabel { case Active = 'a'; case Off = 'o'; const D = self::Active; public function label(): string { return ''; } }
abstract class Shape { var $legacy; public $a, $b; }
function helper() {}
namespace Other;
class User {}
