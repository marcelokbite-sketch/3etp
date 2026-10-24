# Plano de Refatoração: Centralização de Temas (RUN OS)

O objetivo é substituir as condicionais de estilo espalhadas (`themeService.isDeskTheme() ? ... : ...`) por uma implementação baseada em variáveis CSS e diretivas de estilo, reduzindo a complexidade técnica e aumentando a estabilidade.

## Etapas da Refatoração

1.  **Criação de Variáveis CSS de Tema:**
    -   Expandir as variáveis em `:root` no `src/styles.css` para incluir propriedades específicas para o tema "DEsk" (ex: `--border-radius-desk`, `--shadow-desk`).
    -   Definir classes globais baseadas no tema ativo no `body` ou na `div.h-screen` principal do `OsShellComponent`.

2.  **Migração dos Componentes:**
    -   Alterar o `OsShellComponent` para aplicar uma classe CSS baseada no tema ativo (`.theme-desk` ou `.theme-linux`).
    -   Substituir as condicionais nos templates dos componentes (`os-taskbar`, `os-window-compositor`, etc.) por classes que se comportam de forma diferente dependendo da classe pai do tema.
    -   *Exemplo:* `[class.desk-brass-plate]="..."` -> `class="bg-accent-desk"` (onde `.theme-desk .bg-accent-desk { ... }` define o estilo).

3.  **Refatoração do `LinuxThemeService`:**
    -   Garantir que ele gerencie não apenas a troca de cores, mas a aplicação da classe de tema correta no nível superior do DOM.

## Benefícios esperados
-   **Estabilidade:** Menos lógica de decisão nos templates HTML (evita erros de renderização).
-   **Manutenibilidade:** Estilos definidos em um único local (CSS), não espalhados em dezenas de componentes TS.
-   **Performance:** Menor sobrecarga de detecção de mudanças (Angular Change Detection).

## Próximo Passo
Iniciaremos a refatoração pelo componente `os-taskbar.component.ts` como piloto. Posso prosseguir com a implementação desta mudança?
