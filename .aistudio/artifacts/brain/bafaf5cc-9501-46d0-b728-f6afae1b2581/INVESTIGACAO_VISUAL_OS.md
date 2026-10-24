# Plano de Investigação: Conflitos Visuais e Código Legado no RUN OS

O objetivo desta etapa é limpar e harmonizar a interface do RUN OS, que apresenta sinais de sobreposição entre estilos físicos ("skeuomorphic") e modernos.

## Escopo da Investigação

1.  **Auditoria de Estilos CSS (`/src/styles.css`):**
    -   Mapear classes `.desk-*` (antigas/físicas) versus `.linux-*` (modernas/temáticas).
    -   Identificar quais classes físicas ainda estão sendo usadas ativamente no template do `OsShellComponent`.

2.  **Verificação de Componentes:**
    -   Analisar os componentes em `/src/app/ui/os/components` para identificar referências a estilos legados que não deveriam mais existir.

3.  **Auditoria de `localStorage`:**
    -   Listar as chaves de persistência usadas pelo `LinuxThemeService` (`3eatcru_os_*`) para garantir que chaves antigas não estejam causando comportamentos inesperados.

## Etapas Propostas

1.  **Mapeamento de Uso de Classes:** Executar busca por todas as classes `.desk-*` e `.linux-*` no template do shell e subcomponentes.
2.  **Limpeza/Migração:**
    -   Se uma classe `.desk-*` não for mais necessária ou se estiver conflitando, vamos marcar para remoção.
    -   Garantir que todos os estilos dinâmicos dependam exclusivamente do `LinuxThemeService` e das variáveis CSS (`--accent-color`, etc.).
3.  **Relatório de Ações:** Criar um checklist de remoção de código/estilo legado.

## Próximo Passo

Por favor, aprove este plano para que eu possa iniciar o mapeamento detalhado das classes CSS e verificar as chaves de persistência.
