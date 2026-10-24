import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientApiClient } from '../../api/api-client';
import { AppCatalogItem, StoreAppResponse } from '../../domain/store/app-catalog.entity';
import { StoreRepository } from '../../domain/store/store.repository';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiStoreRepository implements StoreRepository {
  private api = inject(ClientApiClient);
  private readonly baseUrl = '/store/apps';

  async getAllApps(): Promise<StoreAppResponse[]> {
    const data = await firstValueFrom(this.api.get<StoreAppResponse[]>(this.baseUrl));
    return data || [];
  }

  async getAppById(id: string): Promise<StoreAppResponse | null> {
    try {
      const data = await firstValueFrom(this.api.get<StoreAppResponse>(`${this.baseUrl}/${id}`));
      return data;
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse && e.status === 404) return null;
      throw e;
    }
  }

  async getCatalogApps(): Promise<AppCatalogItem[]> {
    const data = await this.getAllApps();
    return data.map(x => x.app);
  }
}
