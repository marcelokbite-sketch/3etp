import { Injectable, signal, computed, inject } from '@angular/core';
import { CustomerApiClient } from '../api/api-client';
import { firstValueFrom } from 'rxjs';

export interface CustomerAddress {
  id: string;
  label?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  addresses: CustomerAddress[];
  preferences: Record<string, unknown>;
  favorites: string[];
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerActivity {
  profile: CustomerAccount;
  orders: {
    id: string;
    publicTrackingToken?: string;
    companyId: string;
    companyName: string;
    total: number;
    status: string;
    channel: string;
    createdAt: string;
    items: { name: string; quantity: number; unitPrice: number; total: number }[];
  }[];
  companyRelationships: {
    companyId: string;
    companyName: string;
    logoUrl: string;
    points: number;
    totalSpent: number;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'VIP';
    memberSince: string;
    lastPurchaseAt?: string;
  }[];
  favoriteCompanies: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    bannerUrl: string;
    category: string;
  }[];
  addresses: CustomerAddress[];
}

@Injectable({
  providedIn: 'root'
})
export class CustomerIdentityService {
  private api = inject(CustomerApiClient);

  readonly currentCustomer = signal<CustomerAccount | null>(null);
  readonly customerToken = signal<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('3eatcru_customer_token') : null
  );
  readonly isAuthenticated = computed(() => !!this.currentCustomer());

  constructor() {
    if (this.customerToken()) {
      void this.fetchMe();
    }
  }

  async register(data: { name: string; email: string; phone: string; password: string }): Promise<CustomerAccount> {
    const res = await firstValueFrom(
      this.api.post<{ token: string; customer: CustomerAccount }>('/customer/auth/register', data)
    );
    this.setSession(res.token, res.customer);
    return res.customer;
  }

  async login(data: { email: string; password: string }): Promise<CustomerAccount> {
    const res = await firstValueFrom(
      this.api.post<{ token: string; customer: CustomerAccount }>('/customer/auth/login', data)
    );
    this.setSession(res.token, res.customer);
    return res.customer;
  }

  logout(): void {
    if (this.customerToken()) {
      firstValueFrom(this.api.post('/customer/auth/logout', {})).catch(() => undefined);
    }
    this.clearSession();
  }

  async fetchMe(): Promise<CustomerAccount | null> {
    if (!this.customerToken()) return null;
    try {
      const res = await firstValueFrom(
        this.api.get<{ customer: CustomerAccount }>('/customer/auth/me')
      );
      this.currentCustomer.set(res.customer);
      return res.customer;
    } catch {
      this.clearSession();
      return null;
    }
  }

  async updateProfile(data: Partial<CustomerAccount>): Promise<CustomerAccount> {
    const res = await firstValueFrom(
      this.api.put<{ customer: CustomerAccount }>('/customer/profile', data)
    );
    this.currentCustomer.set(res.customer);
    return res.customer;
  }

  async addAddress(address: Omit<CustomerAddress, 'id'>): Promise<CustomerAddress[]> {
    const res = await firstValueFrom(
      this.api.post<{ addresses: CustomerAddress[] }>('/customer/addresses', address)
    );
    if (this.currentCustomer()) {
      this.currentCustomer.update(c => c ? { ...c, addresses: res.addresses } : null);
    }
    return res.addresses;
  }

  async deleteAddress(addressId: string): Promise<CustomerAddress[]> {
    const res = await firstValueFrom(
      this.api.delete<{ addresses: CustomerAddress[] }>(`/customer/addresses/${addressId}`)
    );
    if (this.currentCustomer()) {
      this.currentCustomer.update(c => c ? { ...c, addresses: res.addresses } : null);
    }
    return res.addresses;
  }

  async toggleFavorite(companyId: string): Promise<boolean> {
    const res = await firstValueFrom(
      this.api.post<{ isFavorite: boolean; favorites: string[] }>('/customer/favorites/toggle', { companyId })
    );
    if (this.currentCustomer()) {
      this.currentCustomer.update(c => c ? { ...c, favorites: res.favorites } : null);
    }
    return res.isFavorite;
  }

  async fetchActivity(): Promise<CustomerActivity> {
    return firstValueFrom(
      this.api.get<CustomerActivity>('/customer/activity')
    );
  }

  private setSession(token: string, customer: CustomerAccount) {
    this.customerToken.set(token);
    this.currentCustomer.set(customer);
    if (typeof window !== 'undefined') {
      localStorage.setItem('3eatcru_customer_token', token);
    }
  }

  private clearSession() {
    this.customerToken.set(null);
    this.currentCustomer.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('3eatcru_customer_token');
    }
  }
}
