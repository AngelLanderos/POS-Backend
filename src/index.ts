import "reflect-metadata";
import { AppDataSource } from "./data-source";
import app from "./app";

app.listen(3000);
console.log('Server listen on http://localhost:3000');

AppDataSource.initialize()
.then(() => {
    console.log('Connected to the database!');
})
.catch((error) => {
    console.error('Failed to connect to the database:',error)
});
