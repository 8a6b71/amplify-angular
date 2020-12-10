import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TruncateOAuthQueryParamsGuard implements CanActivate {
  constructor(private readonly router: Router) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    routerStateSnapshot: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const urlTree = this.router.parseUrl(routerStateSnapshot.url);
    if (this.hasOAuthQuery(route)) {
      const {code, state, ...noOAuthQuery} = urlTree.queryParams;
      urlTree.queryParams = noOAuthQuery;
      return urlTree;
    }
    return true;
  }

  private hasOAuthQuery(route: ActivatedRouteSnapshot): boolean {
    return route.queryParamMap.has('code') || route.queryParamMap.has('state');
  }
}
