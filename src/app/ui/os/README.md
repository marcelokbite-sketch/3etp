# Sistema Operacional (OS - Terminal Layer)

O OS é a camada de execução de borda (edge) instalada em terminais físicos.

## Arquitetura de Operação

Focado na resiliência da operação de balcão e no ciclo de vida dos dispositivos.

### Responsabilidades
- **Telemetria:** Envio periódico de status de saúde e logs do terminal para o HQ.
- **Gestão de Apps:** Instalação, atualização e execução de aplicações autorizadas pelo catálogo central.
- **Operação Local:** Execução de transações de PDV mesmo em condições de rede restritas (Offline-First/WAL).

### Integração
- Sincroniza estado de pedidos e vendas com o `CentralDatabaseEngine` através de webhooks e polling resiliente.
