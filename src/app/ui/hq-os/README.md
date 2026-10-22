# Gabinete de Governo (HQ - Control Plane)

O módulo HQ é o cérebro administrativo da plataforma 3eatcru.

## Arquitetura e Governança

Responsável pelo controle centralizado, auditoria e inteligência sobre todo o ecossistema de tenants.

### Componentes Principais
- **Dashboard Executivo:** Consolidação de métricas (GMV Omnicanal, MRR, transações).
- **Módulo de Marketplace:** Moderação de vitrines comerciais, suspensão de tenants e supervisão de catálogos.
- **Trilha de Auditoria (Audit Log):** Registro imutável (SQLite) de todas as intervenções administrativas via `hq_audit_logs`.

### Fluxo de Dados
- **BI:** Consome dados de `sales` (PDV) e `orders` (Marketplace) para gerar visões de governança.
- **Moderador:** API de moderação dispara comandos de `upsert` no catálogo e registros de auditoria, garantindo conformidade.
