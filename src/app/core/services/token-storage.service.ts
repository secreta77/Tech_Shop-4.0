import { Injectable, signal } from '@angular/core';

const ACCESS_TOKEN = 'accessToken'
const REFRESH_TOKEN = 'refreshToken'


@Injectable({
  providedIn: 'root',
})



export class TokenStorageService {
  private readonly _accessToken = signal<string | null>(this.read(ACCESS_TOKEN));

  readonly accessToken = this._accessToken.asReadonly()

  getRefreshToken(): string | null{
    return this.read(REFRESH_TOKEN)
  }


  save(accessToken:string , refreshToken:string,remember:boolean):void{
    this.clear()
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(ACCESS_TOKEN,accessToken)
    storage.setItem(REFRESH_TOKEN,refreshToken)
    this._accessToken.set(accessToken)

  }

  clear():void{
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    sessionStorage.removeItem(ACCESS_TOKEN)
    sessionStorage.removeItem(REFRESH_TOKEN)
    this._accessToken.set(null)

  }

  private read(key:string):string | null{
    return localStorage.getItem(key) ?? sessionStorage.getItem(key)
  }
  
}

