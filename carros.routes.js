const express = require("express");

const router = express.Router();

const { 
    cadastrar, 
    listar, 
    buscar, 
    buscarPorPlaca,
    atualizar, 
    excluir 
} = require("../controllers/carros.controller");

router.post("/cadastrar/carro", cadastrar);
router.get("/listar", listar);
router.get("/buscar/placa/:placa", buscarPorPlaca);
router.get("/buscar/:id", buscar);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id", excluir);

module.exports = router;