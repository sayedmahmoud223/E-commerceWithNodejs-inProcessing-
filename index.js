import { dbConnection } from './DB/dbConnection.js';
import express from "express"
import { initApp } from './src/app.js';
const app = express()
const port = 5000

initApp(app,express)
dbConnection();
app.listen(port, () => console.log(`Example app listening on port ${port}!`))