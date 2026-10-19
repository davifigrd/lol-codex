/* Fallback do quiz para abertura direta via file:// (o fetch de JSON local e bloqueado pelo navegador).
   Fonte oficial: data/quiz.json. Mantenha os dois em sincronia ao editar perguntas. */
window.QUIZ_FALLBACK_DATA = {
  "_comentario": "LoL Codex — Banco de perguntas do Quiz Hextech. Tipos: 'multiple' (4 alternativas) e 'reveal' (imagem + Revelar Resposta).",
  "categories": [
    {
      "id": "mapa",
      "name": "Mapa e Objetivos",
      "icon": "fa-map-location-dot",
      "description": "Dragões, Barão, Arauto, visão e tempos de respawn do Rift do Invocador.",
      "questions": [
        {
          "id": "mapa-1",
          "type": "multiple",
          "question": "Quantos Dragões Elementais uma equipe precisa abater para conquistar a Alma do Dragão?",
          "options": [
            "2 dragões",
            "3 dragões",
            "4 dragões",
            "5 dragões"
          ],
          "correctIndex": 2,
          "explanation": "A Alma do Dragão é concedida à equipe que abater 4 dragões. Depois disso, o próximo dragão que nascer será o Dragão Ancião."
        },
        {
          "id": "mapa-2",
          "type": "multiple",
          "question": "Qual objetivo concede o buff 'Mão do Barão'?",
          "options": [
            "Dragão Ancião",
            "Barão Nashor",
            "Arauto do Vale",
            "Gromp"
          ],
          "correctIndex": 1,
          "explanation": "O Barão Nashor concede a Mão do Barão, que fortalece as tropas próximas e aumenta o poder de ataque e o poder de habilidade do time."
        },
        {
          "id": "mapa-3",
          "type": "multiple",
          "question": "O que o Arauto do Vale faz após ser abatido e invocado?",
          "options": [
            "Concede visão de todo o mapa por 60 segundos",
            "Cura todos os aliados próximos",
            "Invoca tropas poderosas na rota mais próxima",
            "Avança pela rota mais próxima e ataca estruturas"
          ],
          "correctIndex": 3,
          "explanation": "O Arauto marcha pela rota mais próxima e investe contra torres e estruturas, causando dano massivo. Ele não ataca campeões espontaneamente."
        },
        {
          "id": "mapa-4",
          "type": "multiple",
          "question": "Qual dragão concede um buff de execução que cresce conforme o dano já causado ao alvo?",
          "options": [
            "Dragão Infernal",
            "Dragão Montês",
            "Dragão Ancião",
            "Dragão das Nuvens"
          ],
          "correctIndex": 2,
          "explanation": "O Dragão Ancião (Elder Dragon) concede o buff de execução: os ataques e habilidades causam dano verdadeiro adicional e executam alvos com pouca vida."
        },
        {
          "id": "mapa-5",
          "type": "reveal",
          "question": "Qual é este item, essencial para negar a visão inimiga?",
          "image": {
            "type": "item",
            "id": "2055"
          },
          "answer": "Sentinela de Controle",
          "explanation": "A Sentinela de Controle revela e desativa sentinelas inimigas na área, além de conceder visão. É limitada a uma unidade ativa por vez."
        },
        {
          "id": "mapa-6",
          "type": "multiple",
          "question": "Qual é o tempo aproximado de respawn do Barão Nashor após ser abatido?",
          "options": [
            "3 minutos",
            "5 minutos",
            "6 minutos",
            "8 minutos"
          ],
          "correctIndex": 2,
          "explanation": "O Barão Nashor ressurge 6 minutos após ser abatido, dando tempo para o time vencedor converter o buff em objetivos."
        },
        {
          "id": "mapa-7",
          "type": "reveal",
          "question": "Qual mapa é este?",
          "image": {
            "type": "map",
            "id": "11"
          },
          "answer": "Rift do Invocador (Summoner's Rift)",
          "explanation": "O Rift do Invocador é o mapa principal 5v5, com três rotas, jungle e objetivos como Dragão, Arauto do Vale e Barão Nashor."
        }
      ]
    },
    {
      "id": "habilidades",
      "name": "Habilidades de Campeões",
      "icon": "fa-wand-magic-sparkles",
      "description": "Reconheça campeões e domine o funcionamento de hooks, roots, knock-ups e passivas.",
      "questions": [
        {
          "id": "hab-1",
          "type": "reveal",
          "question": "Qual campeão é este?",
          "image": {
            "type": "champion",
            "id": "Ahri"
          },
          "answer": "Ahri",
          "explanation": "Ahri, a Raposa de Nove Caudas, é uma maga de dano mágico com mobilidade na ultimate e charme (E) que força o alvo a caminhar até ela."
        },
        {
          "id": "hab-2",
          "type": "multiple",
          "question": "Qual habilidade de Blitzcrank puxa o inimigo até ele?",
          "options": [
            "Q — Foguete de Gancho",
            "W — Sobrecarga",
            "E — Soco Foguete",
            "R — Campo Estático"
          ],
          "correctIndex": 0,
          "explanation": "O Q (Foguete de Gancho) lança um projétil que puxa o primeiro inimigo atingido. É o famoso 'hook' do Blitzcrank."
        },
        {
          "id": "hab-3",
          "type": "multiple",
          "question": "A ultimate de Yasuo, Tempestade de Aço, exige qual condição para ser usada em um alvo?",
          "options": [
            "O alvo estar com escudo",
            "O alvo estar no ar (airborne)",
            "O alvo estar com menos de 50% de vida",
            "O alvo estar enraizado"
          ],
          "correctIndex": 1,
          "explanation": "Yasuo só pode conjurar a R em inimigos arremessados ao ar (pelo próprio Q3, pelo W do time ou por knock-ups aliados)."
        },
        {
          "id": "hab-4",
          "type": "multiple",
          "question": "Qual habilidade de Lux pode enraizar até dois inimigos?",
          "options": [
            "Q — Ligação de Luz",
            "W — Barreira Prismática",
            "E — Singularidade Lucente",
            "R — Raio Final"
          ],
          "correctIndex": 0,
          "explanation": "A Q de Lux lança um projétil que enraíza até dois inimigos atingidos. A E causa dano em área e a R é um feixe de longo alcance."
        },
        {
          "id": "hab-5",
          "type": "reveal",
          "question": "Qual campeão é este?",
          "image": {
            "type": "champion",
            "id": "Thresh"
          },
          "answer": "Thresh",
          "explanation": "Thresh, o Guardião das Correntes, é um suporte com gancho (Q), lanterna que resgata aliados (W), empurrão (E) e ultimate que cria uma prisão de paredes."
        },
        {
          "id": "hab-6",
          "type": "multiple",
          "question": "Qual é a passiva de Anivia?",
          "options": [
            "Reencarnação",
            "Fúria Glacial",
            "Permafrost",
            "Cristalização"
          ],
          "correctIndex": 0,
          "explanation": "A passiva Reencarnação transforma Anivia em um ovo ao morrer. Se o ovo sobreviver, ela renasce com vida cheia."
        },
        {
          "id": "hab-7",
          "type": "multiple",
          "question": "Qual habilidade de Malphite arremessa inimigos ao ar em área?",
          "options": [
            "Q — Fragmento Sísmico",
            "W — Trovão Trovejante",
            "E — Terra Treme",
            "R — Força Incontornável"
          ],
          "correctIndex": 3,
          "explanation": "A R (Força Incontornável) avança e arremessa todos os inimigos atingidos ao ar, sendo uma das iniciações mais fortes do jogo."
        }
      ]
    },
    {
      "id": "itens",
      "name": "Itens e Receitas",
      "icon": "fa-gem",
      "description": "Identifique itens icônicos, efeitos passivos e os componentes das principais receitas.",
      "questions": [
        {
          "id": "item-1",
          "type": "reveal",
          "question": "Qual é este item?",
          "image": {
            "type": "item",
            "id": "3031"
          },
          "answer": "Gume do Infinito",
          "explanation": "O Gume do Infinito potencializa os acertos críticos, aumentando o dano crítico e a chance de crítico. É item central de atiradores."
        },
        {
          "id": "item-2",
          "type": "multiple",
          "question": "Qual item aumenta o dano dos acertos críticos?",
          "options": [
            "Gume do Infinito",
            "Lembrete Mortal",
            "Mata-Cráquens",
            "Lâmina da Fúria de Guinsoo"
          ],
          "correctIndex": 0,
          "explanation": "O Gume do Infinito aumenta o dano crítico. Mata-Cráquens causa dano adicional a cada terceiro ataque e Lembrete Mortal aplica Feridas Graves."
        },
        {
          "id": "item-3",
          "type": "multiple",
          "question": "Qual item causa dano adicional a cada terceiro ataque básico?",
          "options": [
            "Mata-Cráquens",
            "Gume do Infinito",
            "Dança da Morte",
            "Sedenta por Sangue"
          ],
          "correctIndex": 0,
          "explanation": "O Mata-Cráquens dispara um projétil extra a cada terceiro ataque, ótimo contra alvos com muita vida."
        },
        {
          "id": "item-4",
          "type": "multiple",
          "question": "Quais componentes formam o Capuz da Morte de Rabadon?",
          "options": [
            "Dois Bastões Desnecessariamente Grandes",
            "Bastão Desnecessariamente Grande + Tomo Amplificador",
            "Varinha Explosiva + Joia da Ruína",
            "Cajado do Vazio + Tomo Amplificador"
          ],
          "correctIndex": 0,
          "explanation": "O Capuz da Morte de Rabadon é construído com dois Bastões Desnecessariamente Grandes e concede um grande aumento percentual de Poder de Habilidade."
        },
        {
          "id": "item-5",
          "type": "multiple",
          "question": "Qual item aplica Feridas Graves em campeões, reduzindo a cura recebida?",
          "options": [
            "Morellonomicon",
            "Capuz da Morte de Rabadon",
            "Eco de Luden",
            "Chama Sombria"
          ],
          "correctIndex": 0,
          "explanation": "O Morellonomicon aplica Feridas Graves com dano mágico, reduzindo a cura de campeões atingidos. É a opção de AP contra times com muita sustain."
        },
        {
          "id": "item-6",
          "type": "reveal",
          "question": "Qual é este item?",
          "image": {
            "type": "item",
            "id": "3153"
          },
          "answer": "Espada do Rei Destruído",
          "explanation": "A Espada do Rei Destruído causa dano adicional com base na vida atual do alvo e permite roubar velocidade de movimento ao acertar três vezes."
        },
        {
          "id": "item-7",
          "type": "multiple",
          "question": "Qual item concede penetração de magia percentual?",
          "options": [
            "Cajado do Vazio",
            "Cetro de Cristal de Rylai",
            "Eco de Luden",
            "Morellonomicon"
          ],
          "correctIndex": 0,
          "explanation": "O Cajado do Vazio concede penetração de magia percentual, sendo eficaz contra inimigos com alta Resistência Mágica."
        }
      ]
    }
  ]
};
