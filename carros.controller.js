const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {
        let { placa, marca, modelo, ano } = req.body;

        
        if (!placa || placa.trim() === "") {
            return res.status(400).json({ erro: "Placa é obrigatória" });
        }

        placa = placa.trim().toUpperCase().replace(/\s+/g, "");
        
        if (placa.length !== 7) {
            return res.status(400).json({ erro: "Placa deve ter exatamente 7 caracteres" });
        }

       
        const placaExistente = await prisma.carro.findUnique({
            where: { placa }
        });

        if (placaExistente) {
            return res.status(400).json({ erro: "Placa já cadastrada" });
        }

       
        if (!marca || marca.trim() === "") {
            return res.status(400).json({ erro: "Marca é obrigatória" });
        }
        
        if (!modelo || modelo.trim() === "") {
            return res.status(400).json({ erro: "Modelo é obrigatório" });
        }

        marca = marca.trim().toLowerCase();
        modelo = modelo.trim().toLowerCase();

      
        if (!ano) {
            return res.status(400).json({ erro: "Ano é obrigatório" });
        }

        ano = ano.toString().trim();
        
        if (ano.length !== 4) {
            return res.status(400).json({ erro: "Ano deve ter exatamente 4 caracteres" });
        }

        
        const anoArray = ano.split("");
        for (let digito of anoArray) {
            if (isNaN(digito)) {
                return res.status(400).json({ erro: "Ano deve conter apenas números" });
            }
        }

        
        const carro = await prisma.carro.create({
            data: {
                placa,
                marca,
                modelo,
                ano: parseInt(ano)
            }
        });

        res.status(201).json({
            mensagem: "Carro cadastrado com sucesso",
            carro
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

const listar = async (req, res) => {
    try {
        const carros = await prisma.carro.findMany({
            orderBy: { marca: "asc" }
        });

        res.status(200).json(carros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;
        
        const carro = await prisma.carro.findUnique({
            where: { id: parseInt(id) },
            include: {
                locacoes: true
            }
        });

        if (!carro) {
            return res.status(404).json({ erro: "Carro não encontrado" });
        }

        res.status(200).json(carro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

const buscarPorPlaca = async (req, res) => {
    try {
        const { placa } = req.params;
        
        const placaFormatada = placa.trim().toUpperCase().replace(/\s+/g, "");
        
        const carro = await prisma.carro.findUnique({
            where: { placa: placaFormatada }
        });

        if (!carro) {
            return res.status(404).json({ erro: "Carro não encontrado" });
        }

        res.status(200).json(carro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;
        
        
        const carroExistente = await prisma.carro.findUnique({
            where: { id: parseInt(id) }
        });

        if (!carroExistente) {
            return res.status(404).json({ erro: "Carro não encontrado" });
        }

        if (dados.placa) {
            dados.placa = dados.placa.trim().toUpperCase().replace(/\s+/g, "");
            
            if (dados.placa.length !== 7) {
                return res.status(400).json({ erro: "Placa deve ter exatamente 7 caracteres" });
            }

            if (dados.placa !== carroExistente.placa) {
                const placaExistente = await prisma.carro.findUnique({
                    where: { placa: dados.placa }
                });

                if (placaExistente) {
                    return res.status(400).json({ erro: "Placa já cadastrada" });
                }
            }
        }

        if (dados.marca) {
            dados.marca = dados.marca.trim().toLowerCase();
        }

        if (dados.modelo) {
            dados.modelo = dados.modelo.trim().toLowerCase();
        }

        if (dados.ano) {
            dados.ano = dados.ano.toString().trim();
            
            if (dados.ano.length !== 4) {
                return res.status(400).json({ erro: "Ano deve ter exatamente 4 caracteres" });
            }

            const anoArray = dados.ano.split("");
            for (let digito of anoArray) {
                if (isNaN(digito)) {
                    return res.status(400).json({ erro: "Ano deve conter apenas números" });
                }
            }

            dados.ano = parseInt(dados.ano);
        }

        const carro = await prisma.carro.update({
            where: { id: parseInt(id) },
            data: dados
        });

        res.status(200).json({
            mensagem: "Carro atualizado com sucesso",
            carro
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;
        
        
        const carroExistente = await prisma.carro.findUnique({
            where: { id: parseInt(id) }
        });

        if (!carroExistente) {
            return res.status(404).json({ erro: "Carro não encontrado" });
        }

       
        const locacoesAtivas = await prisma.locacao.findMany({
            where: {
                carroId: parseInt(id),
                status: "ATIVA"
            }
        });

        if (locacoesAtivas.length > 0) {
            return res.status(400).json({ 
                erro: "Não é possível excluir carro com locações ativas" 
            });
        }

        await prisma.carro.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ 
            mensagem: "Carro excluído com sucesso" 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    buscarPorPlaca,
    atualizar,
    excluir
};