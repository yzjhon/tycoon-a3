
export interface Decision {
  text: string;
  impact: {
    money: number;
    sustainability: number;
  };
  isCorrect: boolean;
}

export interface Question {
  id: number;
  question: string;
  options: Decision[];
}

export const questionsByStation: { [key: string]: Question[] } = {
  production: [
    {
      id: 1,
      question: "Como melhorar a eficiência da produção?",
      options: [
        {
          text: "Comprar novas máquinas",
          impact: { money: -4000, sustainability: -5 },
          isCorrect: false
        },
        {
          text: "Treinar os funcionários",
          impact: { money: 5000, sustainability: -2 },
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      question: "Como aumentar a capacidade produtiva?",
      options: [
        {
          text: "Aumentar turnos de trabalho",
          impact: { money: 6000, sustainability: -8 },
          isCorrect: false
        },
        {
          text: "Adotar energia solar",
          impact: { money: 2000, sustainability: 3 },
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      question: "Como organizar a produção?",
      options: [
        {
          text: "Produzir sem planejamento",
          impact: { money: -5000, sustainability: -6 },
          isCorrect: false
        },
        {
          text: "Controlar processos",
          impact: { money: 4000, sustainability: 0 },
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      question: "De onde comprar insumos?",
      options: [
        {
          text: "Importar mais barato",
          impact: { money: 4000, sustainability: -5 },
          isCorrect: false
        },
        {
          text: "Comprar insumos locais",
          impact: { money: 3000, sustainability: 4 },
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      question: "Como garantir a qualidade?",
      options: [
        {
          text: "Reduzir testes de qualidade",
          impact: { money: -3000, sustainability: -3 },
          isCorrect: false
        },
        {
          text: "Padronizar processos",
          impact: { money: 4000, sustainability: 0 },
          isCorrect: true
        }
      ]
    },
    {
      id: 6,
      question: "Como modernizar a produção?",
      options: [
        {
          text: "Automatizar sem planejamento",
          impact: { money: -3000, sustainability: -4 },
          isCorrect: false
        },
        {
          text: "Otimizar linha de montagem",
          impact: { money: 3000, sustainability: 2 },
          isCorrect: true
        }
      ]
    }
  ],
  innovation: [
    {
      id: 1,
      question: "Que tipo de produto desenvolver?",
      options: [
        {
          text: "Produto descartável",
          impact: { money: -2000, sustainability: -4 },
          isCorrect: false
        },
        {
          text: "Produto reciclável",
          impact: { money: 3000, sustainability: 6 },
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      question: "Como expandir a operação?",
      options: [
        {
          text: "Aumentar produção sem plano",
          impact: { money: -3000, sustainability: -5 },
          isCorrect: false
        },
        {
          text: "Energia limpa",
          impact: { money: 4000, sustainability: 5 },
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      question: "Em que inovar primeiro?",
      options: [
        {
          text: "Nova embalagem",
          impact: { money: -1000, sustainability: -2 },
          isCorrect: false
        },
        {
          text: "Novo método de produção",
          impact: { money: 3000, sustainability: 3 },
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      question: "Como testar ideias?",
      options: [
        {
          text: "Publicidade massiva",
          impact: { money: -2000, sustainability: -2 },
          isCorrect: false
        },
        {
          text: "Prototipagem rápida",
          impact: { money: 2000, sustainability: 4 },
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      question: "Como valorizar a inovação?",
      options: [
        {
          text: "Aumentar preços sem justificar",
          impact: { money: -2000, sustainability: -3 },
          isCorrect: false
        },
        {
          text: "Investir em funcionários",
          impact: { money: 4000, sustainability: 3 },
          isCorrect: true
        }
      ]
    },
    {
      id: 6,
      question: "Como desenvolver produtos?",
      options: [
        {
          text: "Copiar concorrentes",
          impact: { money: -2000, sustainability: -2 },
          isCorrect: false
        },
        {
          text: "Investir em P&D",
          impact: { money: 5000, sustainability: 5 },
          isCorrect: true
        }
      ]
    }
  ],
  marketing: [
    {
      id: 1,
      question: "Como ajustar preços?",
      options: [
        {
          text: "Reduzir preços aleatoriamente",
          impact: { money: -3000, sustainability: -3 },
          isCorrect: false
        },
        {
          text: "Promover sustentabilidade",
          impact: { money: 5000, sustainability: 2 },
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      question: "Como comunicar com clientes?",
      options: [
        {
          text: "Prometer entregas falsas",
          impact: { money: -2000, sustainability: -2 },
          isCorrect: false
        },
        {
          text: "Mostrar impacto ambiental",
          impact: { money: 4000, sustainability: 1 },
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      question: "Como divulgar produtos?",
      options: [
        {
          text: "Panfletos",
          impact: { money: 3000, sustainability: -2 },
          isCorrect: false
        },
        {
          text: "Redes sociais",
          impact: { money: 6000, sustainability: 0 },
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      question: "Como fazer eventos?",
      options: [
        {
          text: "Eventos poluentes",
          impact: { money: -4000, sustainability: -6 },
          isCorrect: false
        },
        {
          text: "Parceria com ONGs",
          impact: { money: 2000, sustainability: 4 },
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      question: "Como mostrar sustentabilidade?",
      options: [
        {
          text: "Greenwashing",
          impact: { money: -3000, sustainability: -5 },
          isCorrect: false
        },
        {
          text: "Transparência ambiental",
          impact: { money: 4000, sustainability: 3 },
          isCorrect: true
        }
      ]
    },
    {
      id: 6,
      question: "Onde anunciar?",
      options: [
        {
          text: "Outdoor em rodovia",
          impact: { money: 3000, sustainability: -3 },
          isCorrect: false
        },
        {
          text: "Campanha digital",
          impact: { money: 4000, sustainability: 2 },
          isCorrect: true
        }
      ]
    }
  ],
  hr: [
    {
      id: 1,
      question: "Como lidar com custos?",
      options: [
        {
          text: "Demissão em massa",
          impact: { money: -2000, sustainability: -5 },
          isCorrect: false
        },
        {
          text: "Treinamento",
          impact: { money: 3000, sustainability: 4 },
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      question: "Como reduzir gastos?",
      options: [
        {
          text: "Redução de salário",
          impact: { money: -1500, sustainability: -3 },
          isCorrect: false
        },
        {
          text: "Comunicação interna",
          impact: { money: 2000, sustainability: 2 },
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      question: "Como motivar equipe?",
      options: [
        {
          text: "Cobrança excessiva",
          impact: { money: -1000, sustainability: -2 },
          isCorrect: false
        },
        {
          text: "Reconhecimento",
          impact: { money: 2000, sustainability: 3 },
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      question: "Como definir objetivos?",
      options: [
        {
          text: "Excesso de metas",
          impact: { money: -2000, sustainability: -2 },
          isCorrect: false
        },
        {
          text: "Diversidade",
          impact: { money: 3000, sustainability: 4 },
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      question: "Como cuidar dos funcionários?",
      options: [
        {
          text: "Cortes constantes",
          impact: { money: -2000, sustainability: -4 },
          isCorrect: false
        },
        {
          text: "Benefícios",
          impact: { money: 3000, sustainability: 3 },
          isCorrect: true
        }
      ]
    },
    {
      id: 6,
      question: "Como organizar trabalho?",
      options: [
        {
          text: "Pressão contínua",
          impact: { money: -1000, sustainability: -2 },
          isCorrect: false
        },
        {
          text: "Horário flexível",
          impact: { money: 2000, sustainability: 3 },
          isCorrect: true
        }
      ]
    }
  ]
};

// Função para selecionar perguntas aleatórias sem repetir na mesma rodada
export const getRandomQuestions = (stationType: string, usedQuestionIds: number[] = []): Question[] => {
  const allQuestions = questionsByStation[stationType] || [];
  const availableQuestions = allQuestions.filter(q => !usedQuestionIds.includes(q.id));
  
  // Se não há perguntas disponíveis, resetar (nova rodada)
  if (availableQuestions.length === 0) {
    return allQuestions.slice(0, 2); // Retorna 2 perguntas aleatórias
  }
  
  // Selecionar 2 perguntas aleatórias das disponíveis
  const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
};
