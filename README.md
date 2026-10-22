# 3eatcru Business OS & Platform

A plataforma de Gestão Integrada e Ecossistema Comunitário para negócios locais de alto desempenho.

## Visão Geral do Ecossistema

O 3eatcru Business OS é uma arquitetura orientada a serviços unificada, projetada para gerenciar operações físicas de PDV, transações de marketplace digital, governança centralizada de governos/conglomerados e espaços públicos de exibição.

### Arquitetura de Módulos
- **HQ (Gabinete de Governo):** Camada central de controle. Governança, BI, Auditoria e gestão de inquilinos (Tenants).
- **OS (Operating System):** Módulo operacional de borda. Gerenciamento de dispositivos, telemetria, ciclo de vida de apps e operação física.
- **Public Spaces:** Vitrines comerciais, marketplace digital e integração de pedidos online.

## Caminho de Funcionamento
1. **Provisionamento:** O HQ provisiona tenants e gerencia permissões via `CentralDatabaseEngine`.
2. **Operação:** O OS gerencia terminais que rodam apps, enviam telemetria e processam vendas.
3. **Consumo:** Public Spaces refletem o catálogo, aceitam pedidos e sincronizam pagamentos com o ecossistema.

## Documentação Técnica
- [Gabinete de Governo (HQ)](src/app/ui/hq-os/README.md)
- [Sistema Operacional (OS)](src/app/ui/os/README.md)
- [Espaços Públicos (Public Space)](src/app/ui/public-space/README.md)
