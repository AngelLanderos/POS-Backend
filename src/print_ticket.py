# print_ticket.py
import sys
import json
from escpos.printer import Win32Raw

def main():
    raw_data = sys.stdin.read()
    data = json.loads(raw_data)

    # ⚠️ Nombre EXACTO como aparece en Windows → Panel de control → Dispositivos e impresoras
    PRINTER_NAME = "POS5"  

    printer = Win32Raw(PRINTER_NAME)

    # Encabezado
    printer.set(align="center", bold=True, width=2, height=2)
    printer.text("*** BAR EL CORRAL ***\n")
    printer.set(align="left", bold=False, width=1, height=1)
    printer.text("--------------------------------\n")

    # Items
    for item in data["items"]:
        line = f'{item["qty"]} x {item["name"]}  ${item["price"]*item["qty"]:.2f}\n'
        printer.text(line)

    printer.text("--------------------------------\n")

    # Total
    printer.set(align="right", bold=True)
    printer.text(f'TOTAL: ${data["total"]:.2f}\n')
    printer.cut()

if __name__ == "__main__":
    main()
