# print_ticket.py
import sys
import json
from escpos.printer import Win32Raw

def main():
    raw_data = sys.stdin.read()
    data = json.loads(raw_data)

    PRINTER_NAME = "POS5"  # ⚠️ Ajusta con tu nombre de impresora en Windows

    printer = Win32Raw(PRINTER_NAME)

    # Encabezado
    printer.set(align="center", bold=True, width=2, height=2)
    printer.text("*** BAR EL CORRAL ***\n")
    printer.set(align="left", bold=False, width=1, height=1)
    printer.text("--------------------------------\n")

    # Mesa
    printer.set(align="left", bold=True)
    printer.text(f"Mesa: {data['table']}\n")
    printer.text("--------------------------------\n")

    # Productos
    for product in data["products"]:
        qty = int(product["quantity"])
        price = float(product["price"])
        line = f'{qty} x {product["name"]}  ${price * qty:.2f}\n'
        printer.text(line)

    printer.text("--------------------------------\n")

    # Total
    printer.set(align="right", bold=True)
    printer.text(f'TOTAL: ${float(data["total"]):.2f}\n')

    # Cierre
    printer.set(align="center", bold=False)
    printer.text("\n¡Gracias por su compra!\n")
    printer.cut()

if __name__ == "__main__":
    main()

