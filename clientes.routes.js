const express = require("express");

const router = express.Router();

const { 
    cadastrar, 
    listar, 
    buscar, 
    buscarPorEmail,
    atualizar, 
    excluir 
} = require("../controllers/clientes.controller");

router.post("/cadastrar/cliente", cadastrar);
router.get("/listar", listar);
router.get("/buscar/email/:email", buscarPorEmail);
router.get("/buscar/:id", buscar);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id", excluir);

module.exports = router;