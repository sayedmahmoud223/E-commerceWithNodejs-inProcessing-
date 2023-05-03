import { dbConnection } from './DB/dbConnection.js';
import express from "express"
import { initApp } from './src/app.js';
import { createInvoice } from './src/utils/pdf.js';
const app = express()
const port = 5000

// const { createInvoice } = require("./createInvoice.js");


initApp(app,express)
dbConnection();
app.listen(port, () => console.log(`Example app listening on port ${port}!`))