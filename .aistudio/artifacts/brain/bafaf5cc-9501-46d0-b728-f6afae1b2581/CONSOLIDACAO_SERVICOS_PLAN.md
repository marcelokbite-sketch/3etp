# Plano de Consolidação: Serviços e Lógica de Negócio

O foco é unificar a camada de serviços para evitar duplicação de lógica entre HQ, OS e Marketplace, garantindo que o estado do ecossistema seja previsível e compartilhado corretamente.

## Objetivos da Consolidação

1.  **Unificar Provedores de Serviço (Single Source of Truth):**
    -   Consolidar serviços de identidade e permissão (Atualmente espalhados em `core/identity`).
    -   Criar serviços de domínio transversais (`domain/`) para regras de negócio compartilhadas (ex: cálculo de estoque, validação de pedidos, regras de comissão).

2.  **Padronizar Comunicação com a API (`core/api`):**
    -   Garantir que todos os módulos utilizem um único cliente HTTP configurado com interceptores de autenticação, em vez de chamadas diretas com `HttpClient`.

3.  **Gestão de Estado Centralizada:**
    -   Reforçar o uso de `signals` e `computed` em serviços globais (como `OsStateService`) para servir como ponte entre os dados do backend e a UI.

## Cronograma de Execução

-   **Passo 1: Mapeamento de Serviços Concorrentes.** Identificar serviços que fazem o mesmo trabalho em pastas diferentes (ex: `core/application` vs `core/domain`).
-   **Passo 2: Migração e Unificação.** Mover regras de negócio para serviços em `core/domain` e configurar a injeção de dependência para que todos os módulos (`/ui/os`, `/ui/hq-os`, `/ui/marketplace`) injetem a mesma instância.
-   **Passo 3: Refatoração de APIs.** Centralizar a configuração de chamadas de API em `core/api/api-base.service.ts` para padronizar o tratamento de erros e a inclusão de headers de autorização.

## Próximo Passo

Por favor, aprove este plano para iniciarmos a unificação dos serviços. O primeiro passo será a análise dos serviços de `core/identity` e `core/sync` para evitar comportamentos divergentes entre o terminal (OS) e a central (HQ).
