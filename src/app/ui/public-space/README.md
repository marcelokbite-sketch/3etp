# Espaços Públicos (Public Space - Marketplace)

O Public Space é a interface de vitrine digital do ecossistema 3eatcru.

## Arquitetura do Marketplace

Permite que estabelecimentos (tenants) exibam produtos para consumo online.

### Componentes de Fluxo
- **Catálogo:** Sincronizado com os dados dos produtos cadastrados no sistema central.
- **Checkout:** Integração de pedidos que gera transações de tipo `MARKETPLACE` integradas ao Ledger financeiro.
- **Visibilidade:** Vitrines públicas sujeitas à moderação administrativa realizada pelo módulo HQ.

### Integração Omnicanal
- Pedidos online realizados aqui são visíveis em tempo real no Dashboard Executivo do HQ e podem ser processados por terminais de borda do OS.
