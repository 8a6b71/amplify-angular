import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { omit } from 'lodash';

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
    const oAuthQueryKeys = ['code', 'state'];

    if (this.hasOAuthQuery(route)) {
      urlTree.queryParams = omit(urlTree.queryParams, oAuthQueryKeys);

      return urlTree;
    }

    return true;
  }

  private hasOAuthQuery(route: ActivatedRouteSnapshot): boolean {
    return route.queryParamMap.has('code') || route.queryParamMap.has('state');
  }
}
