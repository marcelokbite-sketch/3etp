import { Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LinuxThemeService } from '../../../core/theme/linux-theme.service';
import { OsProfileService } from '../../../core/os-profile/os-profile.service';

export interface StartMenuAppItem {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  category: 'ALL' | 'OFFICE' | 'NETWORK' | 'SYSTEM' | 'UTILITIES';
  isSystem: boolean;
}

export type LinuxMenuCategory = 'ALL' | 'OFFICE' | 'NETWORK' | 'SYSTEM' | 'UTILITIES';

export interface InstalledAppItem {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
}

@Component({
  selector: 'app-os-start-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (isOpen()) {
      <div 
        id="linux-start-menu"
        class="start-menu absolute bottom-16 left-2 sm:left-4 w-[calc(100vw-1rem)] sm:w-[680px] md:w-[740px] h-[540px] max-h-[calc(100vh-5rem)] z-50 rounded-2xl flex flex-col overflow-hidden animate-start-slide select-none">
        
        <!-- Top Distro & Operator Header -->
        <div class="menu-header px-4 py-3 border-b flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="launcher-icon w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-md">
              <mat-icon class="text-xl">{{ themeService.isDeskTheme() ? 'inventory_2' : 'terminal' }}</mat-icon>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-white tracking-wide">
                  {{ themeService.isDeskTheme() ? 'Fichário & Gaveta Central' : themeService.currentTheme().distro }}
                </span>
                <span class="badge theme-badge px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border">
                  {{ themeService.currentTheme().name }}
                </span>
                <span 
                  [class.retail-badge]="profileService.activeProfile() === 'retail'"
                  [class.restaurant-badge]="profileService.activeProfile() === 'restaurant'"
                  class="badge px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border">
                  {{ profileService.activeProfile() === 'retail' ? '🏬 Varejo' : '🍽️ Restaurante' }}
                </span>
              </div>
              <div class="text-[10px] font-mono flex items-center gap-1.5 mt-0.5 opacity-70">
                <span>{{ operatorName() }}</span>
                @if (companyName()) {
                  <span>•</span>
                  <span class="font-semibold">{{ companyName() }}</span>
                }
                <span>•</span>
                <span class="font-bold uppercase">{{ operatorRole() }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons in Header -->
          <div class="flex items-center gap-1">
            <button 
              type="button"
              (click)="openSettings.emit(); closeMenu.emit()"
              title="Configurações do Sistema"
              class="menu-action-btn w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
              <mat-icon class="text-sm">settings</mat-icon>
            </button>
            <button 
              type="button"
              (click)="lockSystem.emit(); closeMenu.emit()"
              title="Bloquear Terminal (Super + L)"
              class="menu-action-btn w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
              <mat-icon class="text-sm">lock</mat-icon>
            </button>
            <button 
              type="button"
              (click)="closeMenu.emit()"
              title="Fechar Menu"
              class="menu-close-btn w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
              <mat-icon class="text-sm">close</mat-icon>
            </button>
          </div>
        </div>


        <!-- Fast Search Input -->
        <div class="p-3 border-b border-white/5 bg-black/20 shrink-0">
          <div class="relative flex items-center">
            <mat-icon class="absolute left-3 text-slate-400 text-sm">search</mat-icon>
            <input 
              id="start-menu-search"
              type="text" 
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              (keydown.enter)="onSearchEnter()"
              placeholder="Pesquisar aplicativos, utilitários e manuais..."
              class="w-full bg-slate-900/80 border border-white/10 focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
            />
            @if (searchQuery()) {
              <button 
                type="button"
                (click)="searchQuery.set('')"
                class="absolute right-2 text-slate-400 hover:text-white p-1">
                <mat-icon class="text-xs">clear</mat-icon>
              </button>
            }
          </div>
        </div>

        <!-- Middle Body: Categories Sidebar + App Grid -->
        <div class="flex-1 flex min-h-0">
          
          <!-- Categories Sidebar (BigLinux Style) -->
          <div class="menu-sidebar w-44 sm:w-48 py-2 flex flex-col gap-0.5 overflow-y-auto no-scrollbar shrink-0">
            @for (cat of categories; track cat.id) {
              <button 
                type="button"
                (click)="selectedCategory.set(cat.id)"
                [class.active-category]="selectedCategory() === cat.id"
                class="category-btn w-full py-2.5 pr-3 text-left text-xs flex items-center gap-2.5 transition-all cursor-pointer">
                <mat-icon class="text-sm category-icon">{{ cat.icon }}</mat-icon>
                <span class="truncate">{{ cat.label }}</span>
              </button>
            }

            <div class="my-2 border-t border-white/5 mx-3"></div>

            <!-- Fast Native App Launchers in Sidebar -->
            <button 
              type="button"
              (click)="openBrowser.emit(); closeMenu.emit()"
              class="menu-nav-btn w-full py-2 pl-4 pr-3 text-left text-xs flex items-center gap-2.5 transition-all">
              <mat-icon class="text-sm text-cyan-400">explore</mat-icon>
              <span>Navegador Web</span>
            </button>
            <button 
              type="button"
              (click)="openTaskManager.emit(); closeMenu.emit()"
              class="menu-nav-btn w-full py-2 pl-4 pr-3 text-left text-xs flex items-center gap-2.5 transition-all">
              <mat-icon class="text-sm text-emerald-400">view_timeline</mat-icon>
              <span>Gerenciador</span>
            </button>
            <button 
              type="button"
              (click)="openCalculator.emit(); closeMenu.emit()"
              class="menu-nav-btn w-full py-2 pl-4 pr-3 text-left text-xs flex items-center gap-2.5 transition-all">
              <mat-icon class="text-sm text-amber-400">calculate</mat-icon>
              <span>Calculadora</span>
            </button>
            <button 
              type="button"
              (click)="openFileExplorer.emit(); closeMenu.emit()"
              class="menu-nav-btn w-full py-2 pl-4 pr-3 text-left text-xs flex items-center gap-2.5 transition-all">
              <mat-icon class="text-sm text-indigo-400">folder_open</mat-icon>
              <span>Explorador</span>
            </button>
          </div>

          <!-- Apps Grid Area -->
          <div class="flex-1 p-3.5 overflow-y-auto no-scrollbar">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              @for (app of categoryFilteredApps(); track app.id) {
                <button 
                  type="button"
                  (click)="onSelectApp(app)"
                  class="app-card group flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 text-left">
                  
                  <div class="app-icon-wrapper w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform" [ngClass]="app.color">
                    <mat-icon class="text-white text-lg">{{ app.icon }}</mat-icon>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="app-name text-xs font-bold transition-colors truncate group-hover:scale-105">
                        {{ app.name }}
                      </span>
                      @if (app.isSystem) {
                        <span class="system-badge px-1 py-0.2 rounded text-[8px] font-mono">CORE</span>
                      }
                    </div>
                    <p class="app-desc text-[10px] line-clamp-1 mt-0.5">
                      {{ app.desc }}
                    </p>
                  </div>
                </button>
              }

              @if (categoryFilteredApps().length === 0) {
                <div class="col-span-full py-12 flex flex-col items-center justify-center text-center opacity-50">
                  <mat-icon class="text-3xl mb-2">search_off</mat-icon>
                  <p class="text-xs font-semibold">Nenhum aplicativo encontrado</p>
                  <p class="text-[10px] mt-0.5">Pressione Enter para pesquisar nos manuais</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Bottom Footer Bar: Session controls -->
        <div class="menu-footer px-4 py-2.5 border-t flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <button 
              type="button"
              (click)="openInstalledApps.emit(); closeMenu.emit()"
              class="footer-main-btn px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md">
              <mat-icon class="text-sm">apps</mat-icon>
              <span>Meus Aplicativos</span>
            </button>
            <button 
              type="button"
              (click)="openSettings.emit(); closeMenu.emit()"
              class="footer-action-btn px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors">
              <mat-icon class="text-sm">tune</mat-icon>
              <span>Ajustes</span>
            </button>
            <button 
              type="button"
              (click)="refreshDesktop.emit(); closeMenu.emit()"
              title="Recarregar Área de Trabalho"
              class="footer-action-btn px-2 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors">
              <mat-icon class="text-sm">refresh</mat-icon>
            </button>
          </div>

          <button 
            type="button"
            (click)="logoutSession.emit(); closeMenu.emit()"
            class="logout-btn px-2.5 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors">
            <mat-icon class="text-sm">power_settings_new</mat-icon>
            <span>Encerrar Sessão</span>
          </button>
        </div>


      </div>
    }
  `
})
export class OsStartMenuComponent {
  themeService = inject(LinuxThemeService);
  profileService = inject(OsProfileService);

  isOpen = input<boolean>(false);
  companyName = input<string>('');
  activeOperator = input<{ name: string; role: string } | null>(null);
  installedApps = input<InstalledAppItem[]>([]);

  closeMenu = output<void>();
  openInstalledApps = output<void>();
  openSettings = output<void>();
  openBrowser = output<void>();
  openTaskManager = output<void>();
  openCalculator = output<void>();
  openFileExplorer = output<void>();
  openApp = output<string>();
  launchApp = output<StartMenuAppItem>();
  lockSystem = output<void>();
  refreshDesktop = output<void>();
  logoutSession = output<void>();
  searchWeb = output<string>();

  searchQuery = signal<string>('');
  selectedCategory = signal<LinuxMenuCategory>('ALL');

  operatorName = computed(() => this.activeOperator()?.name || 'Operador');
  operatorRole = computed(() => this.activeOperator()?.role || 'OPERATOR');

  readonly categories: { id: LinuxMenuCategory; label: string; icon: string }[] = [
    { id: 'ALL', label: 'Todos os Apps', icon: 'apps' },
    { id: 'OFFICE', label: 'Escritório & Negócios', icon: 'point_of_sale' },
    { id: 'NETWORK', label: 'Canais & Integrações', icon: 'hub' },
    { id: 'SYSTEM', label: 'Sistema & Kernel', icon: 'tune' },
    { id: 'UTILITIES', label: 'Utilitários & Ferramentas', icon: 'build' }
  ];

  allAppItems = computed<StartMenuAppItem[]>(() => {
    const rawBusinessApps = this.installedApps() || [];
    const businessApps: StartMenuAppItem[] = rawBusinessApps.map(app => ({
      id: app.id,
      name: app.name,
      desc: app.description || 'Aplicativo corporativo do tenant',
      icon: app.icon || 'apps',
      color: this.getAppColor(app.category, app.id),
      category: this.mapBusinessCategory(app.category, app.id),
      isSystem: false
    }));

    const systemApps: StartMenuAppItem[] = [
      { id: 'app_settings', name: 'Painel de Controle', desc: 'Configurações de temas Linux, som e tela', icon: 'settings', color: 'bg-slate-700', category: 'SYSTEM', isSystem: true },
      { id: 'app_store', name: 'Loja de Apps', desc: 'Gerenciador de pacotes e catálogo central', icon: 'storefront', color: 'bg-indigo-600', category: 'OFFICE', isSystem: true },
      { id: 'app_dev_hub', name: 'Developer Hub', desc: 'Depurador de Kernel, releases OTA e telemetria', icon: 'developer_board', color: 'bg-emerald-600', category: 'SYSTEM', isSystem: true },
      { id: 'app_browser', name: 'Navegador Web', desc: 'Navegador integrado para documentação e web', icon: 'language', color: 'bg-cyan-600', category: 'NETWORK', isSystem: true },
      { id: 'app_calculator', name: 'Calculadora', desc: 'Calculadora rápida para conferência de caixa', icon: 'calculate', color: 'bg-amber-600', category: 'UTILITIES', isSystem: true },
      { id: 'app_notes', name: 'Bloco de Notas', desc: 'Editor rápido de anotações da operação', icon: 'description', color: 'bg-teal-600', category: 'UTILITIES', isSystem: true },
      { id: 'app_health_diagnostics', name: 'Diagnósticos de Hardware', desc: 'Status da impressora térmica, balança e SQLite', icon: 'monitor_heart', color: 'bg-purple-600', category: 'SYSTEM', isSystem: true }
    ];

    return [...businessApps, ...systemApps];
  });

  categoryFilteredApps = computed<StartMenuAppItem[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const items = this.allAppItems();

    if (query) {
      return items.filter(a => 
        a.name.toLowerCase().includes(query) || 
        a.desc.toLowerCase().includes(query) ||
        a.id.toLowerCase().includes(query)
      );
    }

    if (cat === 'ALL') {
      return items;
    }

    return items.filter(a => a.category === cat);
  });

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input?.value || '');
  }

  onSearchEnter() {
    const q = this.searchQuery().trim();
    if (q) {
      this.searchWeb.emit(q);
      this.closeMenu.emit();
    }
  }

  onSelectApp(app: StartMenuAppItem) {
    this.launchApp.emit(app);
    this.openApp.emit(app.id);
    this.closeMenu.emit();
  }

  private mapBusinessCategory(category?: string, appId?: string): LinuxMenuCategory {
    if (appId === 'app_pos' || category === 'SALES' || appId === 'app_tables' || category === 'RESTAURANT' || appId === 'app_finance' || category === 'FINANCE') {
      return 'OFFICE';
    }
    if (appId === 'app_whatsapp' || appId === 'app_telegram' || appId === 'app_ifood' || appId === 'app_public_space') {
      return 'NETWORK';
    }
    if (appId === 'app_inventory' || category === 'INVENTORY' || appId === 'app_crm' || category === 'CRM') {
      return 'OFFICE';
    }
    return 'UTILITIES';
  }

  private getAppColor(category?: string, appId?: string): string {
    if (appId === 'app_pos' || category === 'SALES') return 'bg-cyan-600';
    if (appId === 'app_inventory' || category === 'INVENTORY') return 'bg-emerald-600';
    if (appId === 'app_crm' || category === 'CRM') return 'bg-purple-600';
    if (appId === 'app_finance' || category === 'FINANCE') return 'bg-teal-600';
    if (appId === 'app_tables' || category === 'RESTAURANT') return 'bg-amber-600';
    if (appId === 'app_public_space' || category === 'PUBLIC_SPACE') return 'bg-blue-600';
    if (appId === 'app_whatsapp') return 'bg-emerald-500';
    if (appId === 'app_telegram') return 'bg-sky-500';
    if (appId === 'app_ifood') return 'bg-rose-500';
    return 'bg-indigo-600';
  }
}
