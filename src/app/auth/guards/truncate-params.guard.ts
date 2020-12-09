import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class TruncateParamsGuard implements CanActivate {
  constructor(private readonly router: Router) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const urlTree = this.router.parseUrl(state.url);
    if (this.isParams(route)) {
      urlTree.queryParams = {};
      return urlTree;
    }
    return true;
  }

  private isParams(route: ActivatedRouteSnapshot): boolean {
    return route.queryParamMap.keys.length > 0;
  }
}
