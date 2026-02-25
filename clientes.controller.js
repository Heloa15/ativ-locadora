const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {
        let { nome, cpf, email, cnh } = req.body;

        if (!nome || nome.trim() === "") {
            return res.status(400).json({ erro: "Nome é obrigatório" });
        }

        nome = nome.trim();
        const partesNome = nome.split(" ");
        
        if (partesNome.length < 2) {
            return res.status(400).json({ 
                erro: "Nome completo deve conter pelo menos duas palavras" 
            });
        }

        if (!cpf) {
            return res.status(400).json({ erro: "CPF é obrigatório" });
        }

        let cpfLimpo = cpf.toString();
        while (cpfLimpo.includes(".")) {
            cpfLimpo = cpfLimpo.replace(".", "");
        }
        while (cpfLimpo.includes("-")) {
            cpfLimpo = cpfLimpo.replace("-", "");
        }
        cpfLimpo = cpfLimpo.replace(/\s+/g, "");

        if (cpfLimpo.length !== 11) {
            return res.status(400).json({ 
                erro: "CPF deve ter exatamente 11 números" 
            });
        }

        for (let char of cpfLimpo) {
            if (isNaN(char)) {
                return res.status(400).json({ 
                    erro: "CPF deve conter apenas números" 
                });
            }
        }

        if (!email) {
            return res.status(400).json({ erro: "Email é obrigatório" });
        }

        let emailLimpo = email.trim().toLowerCase();

        if (!emailLimpo.includes("@") || !emailLimpo.includes(".")) {
            return res.status(400).json({ 
                erro: "Email deve conter '@' e '.'" 
            });
        }

        const emailExistente = await prisma.cliente.findUnique({
            where: { email: emailLimpo }
        });

        if (emailExistente) {
            return res.status(400).json({ 
                erro: "Email já cadastrado" 
            });
        }

        if (!cnh) {
            return res.status(400).json({ erro: "CNH é obrigatória" });
        }

        let cnhLimpa = cnh.toString().trim();

        if (cnhLimpa === "") {
            return res.status(400).json({ 
                erro: "CNH não pode estar vazia" 
            });
        }

        const primeiroCaractere = cnhLimpa.split("")[0];
        if (isNaN(primeiroCaractere)) {
            return res.status(400).json({ 
                erro: "O primeiro caractere da CNH deve ser um número" 
            });
        }

        const cliente = await prisma.cliente.create({
            data: {
                nome,
                cpf: cpfLimpo,
                email: emailLimpo,
                cnh: cnhLimpa
            }
        });

        res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso",
            cliente: {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

const listar = async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany({
            orderBy: { nome: "asc" },
            select: {
                id: true,
                nome: true,
                email: true,
                cpf: true,
                _count: {
                    select: { locacoes: true }
                }
            }
        });

        res.status(200).json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;
        
        const cliente = await prisma.cliente.findUnique({
            where: { id: parseInt(id) },
            include: {
                locacoes: {
                    include: {
                        carro: true
                    }
                }
            }
        });

        if (!cliente) {
            return res.status(404).json({ erro: "Cliente não encontrado" });
        }

        res.status(200).json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

const buscarPorEmail = async (req, res) => {
    try {
        const { email } = req.params;
        
        const emailFormatado = email.trim().toLowerCase();
        
        const cliente = await prisma.cliente.findUnique({
            where: { email: emailFormatado }
        });

        if (!cliente) {
            return res.status(404).json({ erro: "Cliente não encontrado" });
        }

        res.status(200).json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;
        
        const clienteExistente = await prisma.cliente.findUnique({
            where: { id: parseInt(id) }
        });

        if (!clienteExistente) {
            return res.status(404).json({ erro: "Cliente não encontrado" });
        }

        if (dados.nome) {
            dados.nome = dados.nome.trim();
            const partesNome = dados.nome.split(" ");
            
            if (partesNome.length < 2) {
                return res.status(400).json({ 
                    erro: "Nome completo deve conter pelo menos duas palavras" 
                });
            }
        }

        if (dados.cpf) {
            let cpfLimpo = dados.cpf.toString();
            while (cpfLimpo.includes(".")) {
                cpfLimpo = cpfLimpo.replace(".", "");
            }
            while (cpfLimpo.includes("-")) {
                cpfLimpo = cpfLimpo.replace("-", "");
            }
            cpfLimpo = cpfLimpo.replace(/\s+/g, "");

            if (cpfLimpo.length !== 11) {
                return res.status(400).json({ 
                    erro: "CPF deve ter exatamente 11 números" 
                });
            }

            for (let char of cpfLimpo) {
                if (isNaN(char)) {
                    return res.status(400).json({ 
                        erro: "CPF deve conter apenas números" 
                    });
                }
            }

            dados.cpf = cpfLimpo;
        }

        if (dados.email) {
            dados.email = dados.email.trim().toLowerCase();

            if (!dados.email.includes("@") || !dados.email.includes(".")) {
                return res.status(400).json({ 
                    erro: "Email deve conter '@' e '.'" 
                });
            }

            if (dados.email !== clienteExistente.email) {
                const emailExistente = await prisma.cliente.findUnique({
                    where: { email: dados.email }
                });

                if (emailExistente) {
                    return res.status(400).json({ 
                        erro: "Email já cadastrado" 
                    });
                }
            }
        }

        if (dados.cnh) {
            dados.cnh = dados.cnh.toString().trim();

            if (dados.cnh === "") {
                return res.status(400).json({ 
                    erro: "CNH não pode estar vazia" 
                });
            }

            const primeiroCaractere = dados.cnh.split("")[0];
            if (isNaN(primeiroCaractere)) {
                return res.status(400).json({ 
                    erro: "O primeiro caractere da CNH deve ser um número" 
                });
            }
        }

        const cliente = await prisma.cliente.update({
            where: { id: parseInt(id) },
            data: dados
        });

        res.status(200).json({
            mensagem: "Cliente atualizado com sucesso",
            cliente
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;
        
        const clienteExistente = await prisma.cliente.findUnique({
            where: { id: parseInt(id) }
        });

        if (!clienteExistente) {
            return res.status(404).json({ erro: "Cliente não encontrado" });
        }

        const locacoesAtivas = await prisma.locacao.findMany({
            where: {
                clienteId: parseInt(id),
                status: "ATIVA"
            }
        });

        if (locacoesAtivas.length > 0) {
            return res.status(400).json({ 
                erro: "Não é possível excluir cliente com locações ativas" 
            });
        }

        await prisma.cliente.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ 
            mensagem: "Cliente excluído com sucesso" 
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
    buscarPorEmail,
    atualizar,
    excluir
};
