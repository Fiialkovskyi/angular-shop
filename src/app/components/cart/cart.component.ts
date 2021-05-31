import { Component, OnInit } from '@angular/core';
import { ShopApiService, CartItem, CatalogItem } from 'src/app/shared/shop-api.service';
import { CatalogComponent } from './../catalog/catalog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = []

  total = 0;

  constructor(private shopApiService: ShopApiService, private catalogComponent: CatalogComponent, private router: Router ) { }

  ngOnInit(): void {
    this.shopApiService.fetchCatalog();
    this.cartItems = this.shopApiService.cartItems;
    this.calculateTotal()
  }

  addItem(id: number) {
    this.catalogComponent.loadCatalog()
    this.shopApiService.addToCart(id, this.catalogComponent.catalogItems);
    this.calculateTotal()
  }

  removeItem(id: number) {
    this.catalogComponent.loadCatalog()
    this.shopApiService.removeFromCart(id, this.catalogComponent.catalogItems);
    this.calculateTotal()
  }
  
  calculateTotal() {
    this.total = this.cartItems.reduce((prev, curr) => {
      return prev + (Math.round(curr.price * curr.qty * 100) / 100);
    }, 0);
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
