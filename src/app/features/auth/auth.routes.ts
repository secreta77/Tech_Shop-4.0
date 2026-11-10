import { Routes } from "@angular/router";
import { guestGuard } from "../../core/guards/guest.guard";



export const AUTH_ROUTES:Routes = [

    {
        path:'login',
        canActivate:[guestGuard],
        loadComponent:()=> import('./pages/login/login').then((m)=>m.Login)
    },

    {
        path:'register',
        canActivate:[guestGuard],
        loadComponent:()=> import('./pages/register/register').then((m)=>m.Register)

    },


    {
        path:'verify-email',
        canActivate:[guestGuard],
        loadComponent:()=> import('./pages/verify-email/verify-email').then((m)=>m.VerifyEmail)
    },



]