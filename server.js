const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// PREÇO DO PASTEL
const PRECO_PASTEL = 5;

// SEU LINK NOVO QUE VOCÊ MANDOU AGORA
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxqOFUozS5GoADSg1v9udZUctrWbX6T2EwodZ_npzTkglr_PqeOgYZIbGvrmdvThXdh/exec";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'cantina.html'));
});

app.post('/api/vendas', async (req, res) => {
  try {
    const { nome, numero, quantidade, datahora, pagou, valorTotal } = req.body;

    if (!nome || !quantidade) {
      return res.status(400).json({ error: 'Falta nome ou quantidade' });
    }

    const qtd = parseInt(quantidade);
    const valorCalculado = valorTotal || (qtd * PRECO_PASTEL);

    console.log(`[DOULOS] ${nome} - ${qtd}x = R$ ${valorCalculado} - ${pagou}`);

    // Monta os dados na ordem exata da sua foto:
    // B=NOME | C=NÚMERO | D=QUANTIDADE | E=DATA/HORA | F=PAGOU? | G=VALOR
    const formData = new URLSearchParams();
    formData.append('nome', nome);
    formData.append('numero', numero || '');
    formData.append('quantidade', qtd);
    formData.append('datahora', datahora || new Date().toLocaleString('pt-BR'));
    formData.append('pagou', pagou || 'NÃO');
    formData.append('valorTotal', valorCalculado);
    formData.append('valor', valorCalculado);

    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData
    });

    res.json({ success: true, valor: valorCalculado });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🥟 Cantina Doulos rodando em http://localhost:${PORT}`);
  console.log(`💰 Pastel R$ ${PRECO_PASTEL},00 | B=NOME C=NUMERO D=QTD E=DATA F=PAGOU G=VALOR`);
});