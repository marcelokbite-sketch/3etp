import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerApiClient } from '../../core/api/api-client';
import { MarketplaceListingItem } from './components/marketplace-listing-card.component';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private api = inject(CustomerApiClient);

  getListings(): Observable<MarketplaceListingItem[]> {
    return this.api.get<MarketplaceListingItem[]>('/marketplace/listings');
  }
}
