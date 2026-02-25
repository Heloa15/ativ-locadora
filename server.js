require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

/* Importar e Implementar Rotas */
// const modelRotas = require("./src/model.routes");
const carrosRoutes = require("./src/routes/carros.routes");
const clientesRoutes = require("./src/routes/clientes.routes")


app.use("/carros", carrosRoutes);
app.use("/clientes", clientesRoutes);

/* Fim */

const porta = process.env.PORT_APP || 3000;

app.listen(porta, () => {
    console.log(`Online na porta ${porta}`);
});