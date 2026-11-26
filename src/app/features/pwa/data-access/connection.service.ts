import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private readonly _offline = signal(!navigator.onLine);

  readonly offline = this._offline.asReadonly();

  constructor() {
    window.addEventListener('offline', () => this._offline.set(true));
    window.addEventListener('online', () => this._offline.set(false));
  }
}
