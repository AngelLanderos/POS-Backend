
import { spawn } from "child_process";
import path from "path";

/**
 * Envía un ticket al script de Python para imprimir
 */
export function printTicket(order: any): Promise<void> {
  return new Promise((resolve, reject) => {
    // Ruta absoluta del script Python
    const scriptPath = path.resolve(__dirname, "../print_ticket.py");

    const python = spawn("python", [scriptPath]);

    // Pasamos los datos como JSON
    python.stdin.write(JSON.stringify(order));
    python.stdin.end();

    // Captura errores del script Python
    python.stderr.on("data", (data) => {
      console.error(`stderr (python): ${data}`);
    });

    python.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });
  });
}

// {
//     "items": [
//       { "qty": 2, "name": "Cuba Libre", "price": 50 },
//       { "qty": 1, "name": "Mojito", "price": 80 }
//     ],
//     "total": 180
//   }
