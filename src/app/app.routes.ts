import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>
            import('./features/home/pages/home/home').then((m)=> m.Home)
    },


    {
        path:"",
        loadChildren:()=> import('./features/auth/auth.routes').then((m)=>m.AUTH_ROUTES)
    }

];
