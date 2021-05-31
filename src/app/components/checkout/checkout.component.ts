import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem, ShopApiService } from './../../shared/shop-api.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  cartItems: CartItem[] = [];
  form!: FormGroup;

  constructor(private shopApiService: ShopApiService, private router: Router) { }
  

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      secondName: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
        Validators.minLength(6)
      ]),
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ])
    });
    this.shopApiService.fetchCatalog();
    this.cartItems = this.shopApiService.cartItems;
  }

  submit() {
    if(this.form.valid) {
      this.form.reset();
      this.shopApiService.clearCart();
      this.router.navigate(['/thank-you']);
    }
  }
}
