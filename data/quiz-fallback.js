/* Fallback do quiz para abertura direta via file:// (o fetch de JSON local e bloqueado pelo navegador).
   Fonte oficial: data/quiz.json. Mantenha os dois em sincronia ao editar perguntas. */
window.QUIZ_FALLBACK_DATA = {
  "_comentario": "LoL Codex — Banco de perguntas do Quiz. Estrutura: categorias → níveis (facil/media/dificil) → perguntas. Tipos: 'multiple' (4 alternativas) e 'reveal' (imagem + Revelar Resposta).",
  "levels": [
    { "id": "facil", "name": "Fácil", "icon": "fa-feather" },
    { "id": "media", "name": "Média", "icon": "fa-bolt" },
    { "id": "dificil", "name": "Difícil", "icon": "fa-fire" }
  ],
  "categories": [
    {
      "id": "mapa",
      "name": "Mapa e Objetivos",
      "icon": "fa-map-location-dot",
      "description": "Dragões, Barão, Arauto, visão e tempos de respawn do Rift do Invocador.",
      "levels": {
        "facil": [
          {
            "id": "mapa-f1",
            "type": "multiple",
            "question": "Quantas equipes disputam uma partida no Rift do Invocador?",
            "options": ["2 equipes", "3 equipes", "4 equipes", "5 equipes"],
            "correctIndex": 0,
            "explanation": "Cada partida reúne duas equipes de 5 jogadores (5v5). Uma defende a base azul e a outra a base vermelha."
          },
          {
            "id": "mapa-f2",
            "type": "multiple",
            "question": "Qual objetivo concede o buff 'Mão do Barão'?",
            "options": ["Dragão Ancião", "Barão Nashor", "Arauto do Vale", "Gromp"],
            "correctIndex": 1,
            "explanation": "O Barão Nashor concede a Mão do Barão, que fortalece as tropas próximas e aumenta o poder de ataque e o poder de habilidade do time."
          },
          {
            "id": "mapa-f3",
            "type": "reveal",
            "question": "Qual mapa é este?",
            "image": { "type": "map", "id": "11" },
            "answer": "Rift do Invocador (Summoner's Rift)",
            "explanation": "O Rift do Invocador é o mapa principal 5v5, com três rotas, jungle e objetivos como Dragão, Arauto do Vale e Barão Nashor."
          }
        ],
        "media": [
          {
            "id": "mapa-m1",
            "type": "multiple",
            "question": "Quantos Dragões Elementais uma equipe precisa abater para conquistar a Alma do Dragão?",
            "options": ["2 dragões", "3 dragões", "4 dragões", "5 dragões"],
            "correctIndex": 2,
            "explanation": "A Alma do Dragão é concedida à equipe que abater 4 dragões. Depois disso, o próximo dragão que nascer será o Dragão Ancião."
          },
          {
            "id": "mapa-m2",
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
            "id": "mapa-m3",
            "type": "multiple",
            "question": "Qual dragão concede um buff de execução que cresce conforme o dano já causado ao alvo?",
            "options": ["Dragão Infernal", "Dragão Montês", "Dragão Ancião", "Dragão das Nuvens"],
            "correctIndex": 2,
            "explanation": "O Dragão Ancião (Elder Dragon) concede o buff de execução: os ataques e habilidades causam dano verdadeiro adicional e executam alvos com pouca vida."
          }
        ],
        "dificil": [
          {
            "id": "mapa-d1",
            "type": "multiple",
            "question": "Em qual minuto o Barão Nashor aparece pela primeira vez na partida?",
            "options": ["15 minutos", "20 minutos", "25 minutos", "30 minutos"],
            "correctIndex": 1,
            "explanation": "O Barão Nashor nasce aos 20 minutos e ressurge 6 minutos após ser abatido."
          },
          {
            "id": "mapa-d2",
            "type": "multiple",
            "question": "Qual é o tempo aproximado de respawn do Barão Nashor após ser abatido?",
            "options": ["3 minutos", "5 minutos", "6 minutos", "8 minutos"],
            "correctIndex": 2,
            "explanation": "O Barão Nashor ressurge 6 minutos após ser abatido, dando tempo para o time vencedor converter o buff em objetivos."
          },
          {
            "id": "mapa-d3",
            "type": "reveal",
            "question": "Qual é este item, essencial para negar a visão inimiga?",
            "image": { "type": "item", "id": "2055" },
            "answer": "Sentinela de Controle",
            "explanation": "A Sentinela de Controle revela e desativa sentinelas inimigas na área, além de conceder visão. É limitada a uma unidade ativa por vez."
          }
        ]
      }
    },
    {
      "id": "habilidades",
      "name": "Habilidades de Campeões",
      "icon": "fa-wand-magic-sparkles",
      "description": "Reconheça campeões e domine o funcionamento de hooks, roots, knock-ups e passivas.",
      "levels": {
        "facil": [
          {
            "id": "hab-f1",
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
            "id": "hab-f2",
            "type": "multiple",
            "question": "Qual é a passiva de Anivia?",
            "options": ["Reencarnação", "Fúria Glacial", "Permafrost", "Cristalização"],
            "correctIndex": 0,
            "explanation": "A passiva Reencarnação transforma Anivia em um ovo ao morrer. Se o ovo sobreviver, ela renasce com vida cheia."
          },
          {
            "id": "hab-f3",
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
        ],
        "media": [
          {
            "id": "hab-m1",
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
            "id": "hab-m2",
            "type": "reveal",
            "question": "Qual campeão é este?",
            "image": { "type": "champion", "id": "Ahri" },
            "answer": "Ahri",
            "explanation": "Ahri, a Raposa de Nove Caudas, é uma maga de dano mágico com mobilidade na ultimate e charme (E) que força o alvo a caminhar até ela."
          },
          {
            "id": "hab-m3",
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
          }
        ],
        "dificil": [
          {
            "id": "hab-d1",
            "type": "multiple",
            "question": "O que significa o status 'airborne' (no ar) aplicado a um campeão?",
            "options": [
              "Ele foi arremessado ao ar e não pode agir enquanto durar",
              "Ele ganhou velocidade de movimento temporária",
              "Ele ficou invisível para torres",
              "Ele teve o dano recebido reduzido pela metade"
            ],
            "correctIndex": 0,
            "explanation": "Airborne mantém o campeão arremessado no ar e sem poder agir. É exatamente a condição exigida pela ultimate de Yasuo e por outras combinações de knock-up."
          },
          {
            "id": "hab-d2",
            "type": "multiple",
            "question": "Qual é o efeito da ultimate de Sylas?",
            "options": [
              "Copiar a ultimate de um campeão inimigo",
              "Curar todos os aliados próximos",
              "Aplicar silêncio em área",
              "Invocar um clone que repete seus ataques básicos"
            ],
            "correctIndex": 0,
            "explanation": "A ultimate de Sylas rouba a ultimate de um inimigo escolhido e permite usá-la. Ele pode repetir o roubo em alvos diferentes na mesma partida."
          },
          {
            "id": "hab-d3",
            "type": "reveal",
            "question": "Qual campeão é este?",
            "image": { "type": "champion", "id": "Thresh" },
            "answer": "Thresh",
            "explanation": "Thresh, o Guardião das Correntes, é um suporte com gancho (Q), lanterna que resgata aliados (W), empurrão (E) e ultimate que cria uma prisão de paredes."
          }
        ]
      }
    },
    {
      "id": "itens",
      "name": "Itens e Receitas",
      "icon": "fa-gem",
      "description": "Identifique itens icônicos, efeitos passivos e os componentes das principais receitas.",
      "levels": {
        "facil": [
          {
            "id": "item-f1",
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
            "id": "item-f2",
            "type": "multiple",
            "question": "Qual item devolve o campeão à partida após a morte, com parte da vida restaurada?",
            "options": [
              "Anjo Guardião",
              "Ampulheta de Zhoya",
              "Manto de Banshee",
              "Dança das Fadas"
            ],
            "correctIndex": 0,
            "explanation": "O Anjo Guardião ressuscita o campeão após a morte com parte da vida e da mana, mas entra em recarga entre os usos."
          },
          {
            "id": "item-f3",
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
        ],
        "media": [
          {
            "id": "item-m1",
            "type": "reveal",
            "question": "Qual é este item?",
            "image": { "type": "item", "id": "3031" },
            "answer": "Gume do Infinito",
            "explanation": "O Gume do Infinito potencializa os acertos críticos, aumentando o dano crítico e a chance de crítico. É item central de atiradores."
          },
          {
            "id": "item-m2",
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
            "id": "item-m3",
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
          }
        ],
        "dificil": [
          {
            "id": "item-d1",
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
            "id": "item-d2",
            "type": "multiple",
            "question": "O que a estatística Letalidade faz?",
            "options": [
              "Reduz a armadura do alvo em um valor fixo",
              "Aumenta a chance de acerto crítico",
              "Cura o campeão a cada ataque básico",
              "Reduz o tempo de recarga das habilidades"
            ],
            "correctIndex": 0,
            "explanation": "A Letalidade reduz a armadura inimiga de forma plana, sendo mais eficaz contra alvos com pouca armadura."
          },
          {
            "id": "item-d3",
            "type": "reveal",
            "question": "Qual é este item?",
            "image": { "type": "item", "id": "3153" },
            "answer": "Espada do Rei Destruído",
            "explanation": "A Espada do Rei Destruído causa dano adicional com base na vida atual do alvo e permite roubar velocidade de movimento ao acertar três vezes."
          }
        ]
      }
    }
  ]
}
