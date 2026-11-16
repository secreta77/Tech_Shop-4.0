import { Routes } from "@angular/router";

export const CATEGORY_ROUTES:Routes =[

    {
        path:"categories",
        loadComponent:()=>import("./pages/categories/categories").then((m)=>m.Categories)


    }
]