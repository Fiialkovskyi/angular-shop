import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';

export interface CatalogItem {
  id: number,
  name: string,
  price: number,
  available: number
}

export interface CartItem {
  id: number,
  name: string,
  price: number,
  qty: number,
  available: number,
}

@Injectable({
  providedIn: 'root'
})

export class ShopApiService {

  cartItems: CartItem[] = [];

  constructor(private http: HttpClient) {}

  fetchCatalog(): Observable<CatalogItem[]> {
    let cart = JSON.parse(localStorage.getItem('cartItems')!);
    if (cart?.length) {
      this.cartItems = cart;
    }
    return this.http.get<CatalogItem[]>('/assets/products.json');
  }

  addToCart(id: number, catalog: CatalogItem[]) {
    let indexInCatalog = catalog.findIndex(item => item.id == id);
    let indexInCart = this.cartItems.findIndex(item => item.id == id);
    
    if (indexInCart > -1) {
      if(catalog[indexInCatalog].available) {
        catalog[indexInCatalog].available--;
        this.cartItems[indexInCart].available = catalog[indexInCatalog].available;
        this.cartItems[indexInCart].qty++;
      }

    } else {
      let newItem: CartItem = {
        id: catalog[indexInCatalog].id,
        name: catalog[indexInCatalog].name,
        price: catalog[indexInCatalog].price,
        qty: 1,
        available: catalog[indexInCatalog].available,
      }

      catalog[indexInCatalog].available--;
      this.cartItems = [...this.cartItems, newItem];
    }

    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    localStorage.setItem('catalogItems', JSON.stringify(catalog));
  }

  removeFromCart(id: number, catalog: CatalogItem[]) {
    let indexInCatalog = catalog.findIndex(item => item.id == id);
    let indexInCart = this.cartItems.findIndex(item => item.id == id);

    if(this.cartItems[indexInCart].qty > 1) {
      catalog[indexInCatalog].available++;
      this.cartItems[indexInCart].available = catalog[indexInCatalog].available;
      this.cartItems[indexInCart].qty--;
    } else {
      catalog[indexInCatalog].available++;
      this.cartItems.splice(indexInCart, 1);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    localStorage.setItem('catalogItems', JSON.stringify(catalog));
  }

  clearCart() {
    this.cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }


}
