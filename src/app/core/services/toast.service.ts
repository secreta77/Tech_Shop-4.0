import { Injectable, signal } from '@angular/core';

export interface Toast{
  id:number
  type:'success' | 'error'
  message:string
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextId = 1
  private readonly _toasts = signal<Toast[]>([]);
  readonly toast = this._toasts.asReadonly();


  success(message:string):void{
    this.show('success',message)
  }

  error(message:string):void{
    this.show('error',message)
  }


  remove(id:number):void{
    this._toasts.update((list)=>list.filter((t)=>  t.id !==id))
  }

  private show(type:'success' | 'error',message:string):void{
    const id = this.nextId++
    this._toasts.update((list)=>[...list,{id,type,message}])
    setTimeout(() =>this.remove(id), 5000);
  }
}


