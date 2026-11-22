import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>
            import('./features/home/pages/home/home').then((m)=> m.Home)
    },


    {
        path:"",
        loadChildren:()=> import('./features/auth/auth.routes').then((m)=>m.AUTH_ROUTES)
    },


    {
        path:"",
        loadChildren:()=> import("./features/products/products.routes").then((m)=>m.PRODUCTS_ROUTES),
    },

    {
        path:'',
        loadChildren:()=>import('./features/categories/categories.routes').then((m)=>m.CATEGORY_ROUTES)
    },

    {
        path:'',
        loadChildren:()=>import('./features/profile/profile.routes').then((m)=>m.PROFILE_ROUTES)
    }


];
