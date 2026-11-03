import { Category } from "../../categories/models/category.model";


export interface Product {
    id: number;
    stock: number;
    name: string;
    brand: string;
    model: string;
    price: number;
    imageUrl: string;
    isFavorite: boolean;
    rating: number;
    createdAt: string;
    canDelete: boolean;
    category: Category;
}
