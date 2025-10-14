import sys
import json
from escpos.printer import Win32Raw
from datetime import datetime

PRINTER_NAME = "POS5"  # ⚠️ Ajusta con el nombre exacto de tu impresora en Windows

def print_order(data):
    """Ticket para bartender con los productos"""
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
    printer.text("\n¡Gracias!\n")
    printer.cut()


def print_payment(data):
    """Ticket de comprobante de pago"""
    printer = Win32Raw(PRINTER_NAME)

    # Encabezado
    printer.set(align="center", bold=True, width=2, height=2)
    printer.text("*** COMPROBANTE DE PAGO ***\n")
    printer.text("--------------------------------\n")

    # Total
    printer.set(align="center", bold=True, width=2, height=2)
    printer.text(f"TOTAL PAGADO\n${float(data['total']):.2f}\n")
    printer.text("--------------------------------\n")

    # Fecha y hora
    now = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    printer.set(align="center", bold=False)
    printer.text(f"\nFecha: {now}\n")

    # Footer
    printer.text("\nGracias por su compra\n")
    printer.text("Vuelva pronto\n")
    printer.cut()


def main():
    raw_data = sys.stdin.read()
    data = json.loads(raw_data)

    # ⚡ Decidir qué tipo de ticket imprimir
    if "products" in data and "table" in data:
        print_order(data)   # Ticket de bartender
    elif "total" in data:
        print_payment(data) # Ticket de comprobante de pago


if __name__ == "__main__":
    main()
