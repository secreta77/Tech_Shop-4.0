import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginated } from '../../../core/models/paginated.model';
import { Product } from '../models/product.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient)

  getProducts(take:number,page:number):Observable<Paginated<Product>>{
    const params =  new HttpParams().set('Take',take).set("Page",page)

    return this.http.get<ApiResponse<Paginated<Product>>>(`${environment.apiUrl}/api/products`,{params})
    .pipe(map((response)=>response.data))
  }
}
