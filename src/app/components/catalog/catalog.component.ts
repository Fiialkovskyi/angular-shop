import { Component, Injectable, OnInit } from '@angular/core';
import { CatalogItem, ShopApiService } from 'src/app/shared/shop-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})

@Injectable({
  providedIn: 'root'
})

export class CatalogComponent implements OnInit {

  catalogItems: CatalogItem[] = [];
  loading: boolean = false;

  constructor(private shopApiService: ShopApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadCatalog();
  }

  loadCatalog() {
    let catalog = JSON.parse(localStorage.getItem('catalogItems')!);
    if (catalog?.length) {
      this.catalogItems = catalog;
    } else {
      this.loading = true;
      this.shopApiService.fetchCatalog().subscribe(catalogItems => {
        this.catalogItems = catalogItems;
        this.loading = false;
      })
    }
  }

  addToCart(id: number) {
    this.shopApiService.addToCart(id, this.catalogItems);
    this.router.navigate(['/cart']);
  }
}
