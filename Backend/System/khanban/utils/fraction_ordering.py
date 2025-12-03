from decimal import Decimal

def order_between(a: Decimal | None, b: Decimal | None) -> Decimal:
    if a is None and b is None:
        return Decimal('1000000.0')
    if a is None:
        return b / 2
    if b is None:
        return a + Decimal('1000000.0')
    return (a + b) / 2