import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CustomerIdentityService } from './customer-identity.service';

export const customerAuthGuard: CanActivateFn = async () => {
  const customerIdentity = inject(CustomerIdentityService);
  const router = inject(Router);

  if (customerIdentity.isAuthenticated()) {
    return true;
  }

  // Attempt to re-verify customer session token
  const account = await customerIdentity.fetchMe();
  if (account) {
    return true;
  }

  // If unauthenticated, redirect to marketplace or open login flow
  router.navigate(['/marketplace']);
  return false;
};
