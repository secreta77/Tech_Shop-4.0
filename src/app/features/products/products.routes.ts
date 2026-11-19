import { Routes } from "@angular/router";



export const PRODUCTS_ROUTES:Routes=[
    {
        path:'shop',
        loadComponent:()=>import("./pages/shop/shop").then((m)=>m.Shop)
    },

    {

        path: 'products/:id',
        loadComponent: () => import('./pages/product-page/product-page').then((m) => m.ProductPage),

    }
]

