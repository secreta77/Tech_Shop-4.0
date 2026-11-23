import { inject, Injectable, input } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../auth/data-access/auth.service';
import { CartService } from '../../cart/data-access/cart.service';
import { CategoriesService } from '../../categories/data-access/categories.service';
import { FavoritesService } from '../../favorites/data-access/favorites.service';
import { ProductsService } from '../../products/data-access/products.service';
import { ProfileService } from '../../profile/data-access/profile.service';
import { ToolDefinition } from '../models/chat.model';

type ToolInput = Record<string, unknown>;


const toNumber = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined;


const toText = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

@Injectable({
  providedIn: 'root',
})



export class ChatToolsService {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);







  readonly definitions: ToolDefinition[] = [
    {
      name: 'search_products',
      description:
        'Search and filter the shop catalog. Use for any question about products, brands, prices or recommendations.',
      input_schema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Free text matched against product name' },
          categoryId: { type: 'integer', description: 'Category id from list_categories' },
          brand: { type: 'string', description: 'Exact brand name, for example Apple' },
          minPrice: { type: 'number' },
          maxPrice: { type: 'number' },
          minRating: { type: 'number', description: 'Minimum rating from 1 to 5' },
          inStock: { type: 'boolean', description: 'Only products that are in stock' },
          sortBy: { type: 'string', description: 'One of: rating, price, name, createdAt' },
          sortDescending: { type: 'boolean' },
          take: { type: 'integer', description: 'How many products to return, default 8, max 10' },
        },
        required: [],
      },
    },
    {
      name: 'get_product_details',
      description: 'Get full details for one product: description, specifications, price, stock, rating.',
      input_schema: {
        type: 'object',
        properties: { productId: { type: 'integer' } },
        required: ['productId'],
      },
    },
    {
      name: 'list_categories',
      description: 'List all shop categories with their ids and product counts.',
      input_schema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'get_cart',
      description: "Get the logged-in customer's cart with item ids and the total price.",
      input_schema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'add_to_cart',
      description: "Add a product to the logged-in customer's cart.",
      input_schema: {
        type: 'object',
        properties: {
          productId: { type: 'integer' },
          quantity: { type: 'integer', description: 'Defaults to 1' },
        },
        required: ['productId'],
      },
    },
    {
      name: 'update_cart_quantity',
      description: 'Change the quantity of an item already in the cart. Use itemId from get_cart, not productId.',
      input_schema: {
        type: 'object',
        properties: { itemId: { type: 'integer' }, quantity: { type: 'integer' } },
        required: ['itemId', 'quantity'],
      },
    },
    {
      name: 'remove_from_cart',
      description: 'Remove one item from the cart. Use itemId from get_cart, not productId.',
      input_schema: {
        type: 'object',
        properties: { itemId: { type: 'integer' } },
        required: ['itemId'],
      },
    },
    {
      name: 'checkout',
      description:
        'Place the order with everything in the cart. Only call after the customer explicitly confirmed a cart summary you already showed them.',
      input_schema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'get_my_profile',
      description: "Get the logged-in customer's profile: name, email, phone and address.",
      input_schema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'list_favorites',
      description: "List the logged-in customer's favorite products.",
      input_schema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'toggle_favorite',
      description: 'Add a product to favorites, or remove it if it is already a favorite.',
      input_schema: {
        type: 'object',
        properties: { productId: { type: 'integer' } },
        required: ['productId'],
      },
    },
  ];


  private readonly loginRequired = new Set([
    'get_cart',
    'add_to_cart',
    'update_cart_quantity',
    'remove_from_cart',
    'checkout',
    'get_my_profile',
    'list_favorites',
    'toggle_favorite',
  ]);



  async execute(name:string , input:ToolInput):Promise<string>{
    if(this.loginRequired.has(name) && !this.authService.isLoggedIn()){
      return JSON.stringify({
        error: 'The customer is not logged in. Ask them to sign in first and do not retry this tool.',
      })

    }


    try {
      return JSON.stringify(await this.run(name, input));
    } catch {
      return JSON.stringify({ error: 'The request failed. Tell the customer something went wrong.' });
    }

  
  }


  private async run(name: string, input: ToolInput): Promise<unknown> {
    switch (name) {
      case 'search_products':
        return this.searchProducts(input);
      case 'get_product_details':
        return this.getProductDetails(input);
      case 'list_categories':
        return this.listCategories();
      case 'get_cart':
        return this.getCart();
      case 'add_to_cart':
        return this.addToCart(input);
      case 'update_cart_quantity':
        return this.updateCartQuantity(input);
      case 'remove_from_cart':
        return this.removeFromCart(input);
      case 'checkout':
        return this.checkout();
      case 'get_my_profile':
        return this.getMyProfile();
      case 'list_favorites':
        return this.listFavorites();
      case 'toggle_favorite':
        return this.toggleFavorite(input);
      default:
        return { error: `Unknown tool: ${name}` };
    }
  }


  private async searchProducts(input: ToolInput): Promise<unknown> {
    const page = await firstValueFrom(
      this.productsService.getFiltered({
        take: Math.min(toNumber(input['take']) ?? 8, 10),
        page: 1,
        search: toText(input['query']),
        brand: toText(input['brand']),
        categoryId: toNumber(input['categoryId']),
        minPrice: toNumber(input['minPrice']),
        maxPrice: toNumber(input['maxPrice']),
        minRating: toNumber(input['minRating']),
        inStock: input['inStock'] === true ? true : undefined,
        sortBy: toText(input['sortBy']),
        sortDescending: input['sortDescending'] === true,
      }),
    );


    return {
      total: page.totalCount,
      products: page.items.map((product) => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        rating: product.rating,
        stock: product.stock,
        category: product.category.name,
      })),
    };
  }


  private async getProductDetails(input:ToolInput):Promise<unknown>{
    const productId =toNumber(input['productId'])
    if(productId === undefined){
    return { error: 'productId is required' };
    }

    const product = await firstValueFrom(this.productsService.getById(productId));
    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      model: product.model,
      price: product.price,
      rating: product.rating,
      stock: product.stock,
      category: product.category.name,
      description: product.description,
      specifications: product.specifications,
    };
  }


  private async listCategories():Promise<unknown>{
    const categories = await firstValueFrom(this.categoriesService.categories)
    return categories.map((category)=>({
      id: category.id,
      name: category.name,
      productCount: category.productCount,
    }))
  }


  private async getCart():Promise<unknown>{
    const page = await firstValueFrom(this.cartService.getItems())
    return {
      items: page.items.map((item) => ({
        itemId: item.id,
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.totalPrice,
      })),

      total:page.items.reduce((sum ,items )=>sum +items.totalPrice,0)
    }
  }


  private async addToCart(input:ToolInput):Promise<unknown>{
    const productId = toNumber(input['productId'])

    if(productId === undefined){
      return { error: 'productId is required' };
    }

    await firstValueFrom(this.cartService.add(productId,toNumber(input['quantity']) ?? 1))
    this.cartService.reload()
    return {ok:true}
  }


  private async updateCartQuantity(input:ToolInput):Promise<unknown>{
    const itemId  = toNumber(input["itemId"])
    const quantity = toNumber(input["quantity"])
    if(itemId === undefined || quantity === undefined){
      return { error: 'itemId and quantity are required' };
    }

    await firstValueFrom(this.cartService.editQuantity(itemId,quantity))

    this.cartService.reload()
    return {ok:true}
  }


  private async removeFromCart(input:ToolInput):Promise<unknown>{
    const itemId = toNumber(input['itemId'])
    if(itemId === undefined){
      return { error: 'itemId is required' };
    }

  await firstValueFrom(this.cartService.remove(itemId))
  this.cartService.reload()
  return {ok:true}
  }

  private async checkout():Promise<unknown>{
    await firstValueFrom(this.cartService.placeOrder())
    this.cartService.reload()
    this.toastService.success('Checkout successfully!')
    return {ok:true}

  }


private async getMyProfile():Promise<unknown>{
  const user = await firstValueFrom(this.profileService.getMe())
  return {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.details.phoneNumber,
    address: user.details.address,
  };
}

private async listFavorites():Promise<unknown>{
  const page = await firstValueFrom(this.favoritesService.getItems())
  return page.items.map((product) => ({
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: product.price,
  }));
}

private async toggleFavorite(input:ToolInput):Promise<unknown>{
  const productId = toNumber(input["productId"])
  if(productId === undefined){
    return { error: 'productId is required' };


  
  }


const wasFavorite = this.favoritesService.ids().has(productId)
await firstValueFrom(
  wasFavorite ? this.favoritesService.remove(productId) : this.favoritesService.add(productId),
);
this.favoritesService.reload();
return { ok: true, isFavorite: !wasFavorite };
}
}
