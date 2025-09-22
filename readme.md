# 🎮 Yu-Gi-Oh | Jo-ken-po Edition

Um jogo de jokenpo temático Yu-Gi-Oh! desenvolvido para demonstrar conceitos de lógica de programação aplicados a jogos, com uma experiência visual e sonora rica.

## 🎯 Sobre o Projeto

Este projeto foi criado para explicar conceitos fundamentais de programação através de um jogo interativo. O jogo combina a mecânica clássica do jokenpo (pedra, papel, tesoura) com o universo Yu-Gi-Oh!, oferecendo uma experiência envolvente e educativa.

## ✨ Funcionalidades

### 🎲 **Mecânica de Jogo**

- **Sistema de Cartas**: 9 cartas diferentes baseadas em personagens Yu-Gi-Oh!
- **Combate Estratégico**: Sistema de fraquezas e forças entre diferentes tipos de cartas
- **Drag & Drop**: Interface intuitiva para seleção de cartas (desktop e mobile)
- **Touch Support**: Controles otimizados para dispositivos móveis

### 🎨 **Experiência Visual**

- **Animações Fluidas**: Transições suaves com CSS3 e keyframes
- **Efeitos de Partículas**: Sistema de sparkles e explosões de energia
- **Feedback Visual**: Animações de vitória, derrota e empate
- **Tema RPG**: Interface estilizada com elementos de jogos de RPG
- **Responsividade**: Layout adaptável para desktop e mobile

### 🔊 **Sistema de Áudio**

- **Música de Fundo**: Trilha sonora temática egípcia
- **Efeitos Sonoros**: Sons para vitória, derrota e interações
- **Controles de Volume**: Controles separados para BGM e SFX
- **Cache de Áudio**: Sistema otimizado para melhor performance

### 📊 **Sistema de Pontuação**

- **Estatísticas Detalhadas**: Vitórias, derrotas, empates
- **Taxa de Vitória**: Percentual de sucesso calculado em tempo real
- **Sequência de Vitórias**: Contador de vitórias consecutivas
- **Melhor Sequência**: Registro da maior sequência alcançada

### 📱 **Recursos Mobile**

- **Feedback Tátil**: Vibração para diferentes tipos de interação
- **Touch Gestures**: Suporte completo a gestos de toque
- **Layout Responsivo**: Interface otimizada para telas pequenas
- **Área de Toque**: Botões com tamanho mínimo de 44px para acessibilidade

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Animações, flexbox, grid e media queries
- **JavaScript ES6+**: Lógica do jogo e manipulação do DOM
- **Web APIs**: Vibration API, Audio API, Touch Events

## 📁 Estrutura do Projeto

```
js-yugioh-assets/
├── index.html                 # Página principal
├── readme.md                  # Documentação do projeto
└── src/
    ├── assets/
    │   ├── audios/           # Arquivos de áudio
    │   ├── cursor/           # Cursores personalizados
    │   ├── favicon/          # Ícone do site
    │   ├── icons/            # Imagens das cartas
    │   └── rpg/              # Assets de interface RPG
    ├── scripts/
    │   └── engine.js         # Lógica principal do jogo
    └── styles/
        ├── main.css          # Estilos principais
        ├── buttons.css       # Estilos dos botões
        ├── containers_and_frames.css # Layout e frames
        └── reset.css         # Reset CSS
```

## 🎮 Como Jogar

1. **Início**: Clique em "Começar" para iniciar o jogo
2. **Seleção**: Clique ou arraste uma carta da sua mão para o campo de batalha
3. **Combate**: O computador escolherá uma carta automaticamente
4. **Resultado**: Veja o resultado do duelo com animações e efeitos especiais
5. **Continuar**: Clique no botão de resultado para jogar novamente

### 🃏 **Tipos de Cartas**

| Carta                  | Tipo     | Vence    | Perde Para |
| ---------------------- | -------- | -------- | ---------- |
| Blue Eyes White Dragon | Paper    | Rock     | Scissors   |
| Dark Magician          | Rock     | Scissors | Paper      |
| Exodia                 | Scissors | Paper    | Rock       |

## ⚙️ Configurações

- **Volume BGM**: Controle o volume da música de fundo
- **Volume SFX**: Controle o volume dos efeitos sonoros
- **Modo Silencioso**: Desative áudios individualmente

## 🎯 Conceitos de Programação Demonstrados

### **Gerenciamento de Estado**

```javascript
const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    draws: 0,
    totalGames: 0,
    winStreak: 0,
    bestWinStreak: 0,
  },
};
```

### **Funções Puras e Reutilizáveis**

```javascript
async function checkDuelResults(playerCardId, computerCardId) {
  // Lógica de combate isolada e testável
}
```

### **Manipulação do DOM**

```javascript
function createCardImage(randomIdCard, fieldSide) {
  // Criação dinâmica de elementos
}
```

### **Event Handling**

```javascript
cardImage.addEventListener("click", () => {
  playSelectSound();
  setCardsField(cardImage.getAttribute("data-id"));
});
```

### **Responsive Design**

```css
@media (max-width: 900px) {
  .container {
    flex-direction: column;
    gap: 1rem;
  }
}
```

## 🎨 Recursos Visuais

### **Animações CSS**

- **Card Appear**: Rotação 3D ao aparecer no campo
- **Win Pulse**: Pulsação dourada para vitórias
- **Lose Shake**: Tremor para derrotas
- **Victory Sweep**: Efeito de varredura dourada

### **Efeitos de Partículas**

- **Sparkle System**: Partículas coloridas com múltiplas ondas
- **Energy Explosion**: Explosão de energia para vitórias
- **Particle Physics**: Movimento realista das partículas

## 📱 Compatibilidade

- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Tablets**: iPad, Android tablets
- **Touch Devices**: Suporte completo a gestos

## 🔧 Desenvolvimento

### **Estrutura de Código**

- **Modular**: Código organizado em funções específicas
- **Documentado**: Comentários explicativos em português
- **Performático**: Cache de áudio e otimizações de animação
- **Acessível**: Suporte a leitores de tela e navegação por teclado

### **Padrões Utilizados**

- **ES6+**: Arrow functions, async/await, destructuring
- **CSS3**: Flexbox, Grid, Custom Properties
- **Semantic HTML**: Tags semânticas para melhor acessibilidade

## 🎯 Objetivos Educacionais

Este projeto demonstra:

1. **Gerenciamento de Estado**: Como manter e atualizar dados do jogo
2. **Manipulação do DOM**: Interação dinâmica com elementos HTML
3. **Event Handling**: Resposta a interações do usuário
4. **Animações CSS**: Criação de efeitos visuais atraentes
5. **Responsive Design**: Adaptação para diferentes dispositivos
6. **Audio/Video APIs**: Integração de mídia no navegador
7. **Touch Events**: Suporte a dispositivos móveis
8. **Performance**: Otimizações para melhor experiência

## 🚀 Melhorias Futuras

- [ ] Sistema de conquistas
- [ ] Modo multiplayer online
- [ ] Mais cartas e tipos
- [ ] Sistema de níveis
- [ ] Modo história
- [ ] Ranking global

## 📄 Licença

Este projeto é de código aberto e pode ser usado para fins educacionais.

---

**Desenvolvido com ❤️ para fins educacionais**
