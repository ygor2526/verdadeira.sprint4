import express from "express";
const app = express();
const PORT = 3000

//sprint 1, 2 e 3 -----------

function Listarmensagem() { return mensagens; }

app.get("/", (req, res) => {
    res.send ("Servidor rodando! 🚀")
});

app.get("/status", (req, res) => {
    res.json({status_servidor: "online", sprint: 2});
});

app.get ("/sobre", (req,res) => {
    res.send ("Projeto Mensageiro Local");
});

app.get('/informacao', (req, res) => {
    res.json({ nome: 'SENAI', cidade: 'Valinhos', tipo: 'Privada' });
});

const cursos = [
    { id: '1', nome: 'DS' },
    { id: '2', nome: 'Elétrica' },
    { id: '3', nome: 'Mecânica' },
];

app.get('/cursos', (req, res) => {
    res.json(cursos);
});

app.get('/professor', (req, res) => {
    res.json({ nome: 'Eduardo', disciplina: 'DS', email: 'Eduardo@senai.br' });
});

const orientacoes = [
    {
        status: 'Status do servidor',
        informacao: 'informações importantes',
        cursos: 'Vizualizar os cursos disponiveis',
        professor: 'Informações sobre o professor',
    },
];

app.get('/ajuda', (req, res) => {
    res.json(orientacoes);
});

app.get("/mensagens", (req, res) => {
    res.json(Listarmensagem());
});

const mensagens = [
    { id: 1, usuario: 'Ana', texto: 'Bom dia!' },
    { id: 2, usuario: 'Pedro', texto: 'Olá!' },
    { id: 3, usuario: 'Maria', texto: 'Tudo bem?' },
    { id: 4, usuario: 'Lucas', texto: 'Como vai?' },
    { id: 5, usuario: 'Carla', texto: 'Até logo!' },
];

function consultar (falhar = false) {
    return new promisse((resolve, reject) => {
        setTimeout(() => {
            falhar
                ? reject(new Error("Falhou"))
                : resolve(mensagens);
        }, 1000);
    });
};

app.get("/mensagens-then", (req, res) => {
    consultar()
        .then(lista => res.json(lista))
        .catch(() => res.status(500).json({ erro: "Falha na consulta" }));
});

app.get("/mensagens-async", async (req, res) => {
    try {
        res.json(await consultar());
    } catch (erro) {
        res.status(500).json({
            erro: "Falha na consulta"
        });
    }
});

app.get('/mensagens-erro', async (req, res) => {
    try {
        res.json(await consultar(true));
    } catch (erro) {
        res.status(500).json({
            erro: "Falha simulada",
        });
    }
});

// sprint 04 -------------

app.get('/mensagens', async (req, res) => {
    try {
        res.json(await lerMensagens());
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: "Não foi possível ler as mensagens.",
        });
    }
});

app.get('/mensagens/:id', async (req, res) => {
    try {
        const lista = await lerMensagens();
        const mensagem = lista.find((m) => m.id === Number(req.params.id));
        if (!mensagem) return res.status(404).json({ erro: 'Não encontrada' });
        res.json(mensagem);
    } catch (erro) {
        console.error(error);
        res.status(500).json({ erro: "Falha ao consultar mensagem."})
    }
});

app.get("/total-mensagens", async (req, res) => {
    try {
        res.json({ total: (await lerMensagens()).length });
    } catch (erro) {
        res.status(500).json({ erro: 'Falha na contagem.' });
    }
})

app.get('/exemplo-salvar', async (req, res) => {
    try {
        throw new Error('Falha planejada na gravação.');
    } catch (erro) {
        console.error('Erro planejado em /exemplo-salvar:', erro.message);
        res.status(500).json({
            erro: 'Erro planejado em /exemplo-salvar',
            detalhes: erro.message,
            dica: 'Use /gravar-mensagem-correta para gravar uma mensagem.',
        });
    }
});

let filaGravacoes = Promise.resolve();
app.get('/gravar-mensagem-correta', (req, res) => {
    const tarefa = filaGravacoes.then(async () => {
        const lista = await lerMensagens();
        const id = lista.reduce((maior, mensagem) => Math.max(maior, Number(mensage.id) || 0), 0) + 1;
        const mensagem = {
            id,
            usuario: 'Exemplo',
            texto: 'Gravado em arquivo!'
        };
        await salvarMensagens([...lista, mensagem]);
        return {
            aviso: 'Mensagem gravada com sucesso!',
            mensagem,
            total: lista.length + 1
        };
    });
    filaGravacoes = tarefa.catch(() => {});
    tarefa
        .then((resultado) => res.json(resultado))
        .catch((erro) => {
            console.error(erro);
            res.status(500).json({ erro: 'Erro ao gravar arquivo.' });
        });
});

app.listen(PORT, "0.0.0.0", () => console.log(`Servidor em http://localhost:${PORT}`));

