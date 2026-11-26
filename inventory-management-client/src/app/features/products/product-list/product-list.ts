
import { Component, OnInit, inject, signal } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ProductForm } from '../product-form/product-form';
import {
  ConfirmDialog,
  ConfirmDialogData
} from '../../../shared/components/confirm-dialog/confirm-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-product-list',
  imports: [
  CurrencyPipe,
  MatTableModule,
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatCardModule
],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly displayedColumns: string[] = [
  'name',
  'sku',
  'unitPrice',
  'quantityInStock',
  'reorderLevel',
  'status',
  'actions'
];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getAll().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage.set('Unable to load products.');
        this.isLoading.set(false);
      }
    });
  }

  openAddProductDialog(): void {
  const dialogRef = this.dialog.open(ProductForm, {
    width: '650px',
    maxWidth: '95vw',
    disableClose: true,
    data: null
  });

  dialogRef.afterClosed().subscribe(result => {
  if (result === true) {
    this.loadProducts();

    this.snackBar.open(
      'Product created successfully.',
      'Close',
      { duration: 4000 }
    );
  }
});
}

openEditProductDialog(product: Product): void {
  const dialogRef = this.dialog.open(ProductForm, {
    width: '650px',
    maxWidth: '95vw',
    disableClose: true,
    data: product
  });

  dialogRef.afterClosed().subscribe(result => {
  if (result === true) {
    this.loadProducts();

    this.snackBar.open(
      'Product updated successfully.',
      'Close',
      { duration: 4000 }
    );
  }
});
}

openDeleteProductDialog(product: Product): void {
  const dialogRef = this.dialog.open(ConfirmDialog, {
    width: '450px',
    maxWidth: '95vw',
    disableClose: true,
    autoFocus: 'first-tabbable',
    data: {
      title: 'Delete Product',
      message: `Are you sure you want to delete ${product.name}? This action cannot be undone.`,
      confirmButtonText: 'Delete Product'
    } satisfies ConfirmDialogData
  });

 dialogRef.afterClosed().subscribe(result => {
  if (result === true) {
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.loadProducts();

        this.snackBar.open(
          `${product.name} was deleted successfully.`,
          'Close',
          { duration: 4000 }
        );
      },
      error: (error) => {
        console.error('Error deleting product:', error);

        this.snackBar.open(
          'Unable to delete the product. Please try again.',
          'Close',
          { duration: 5000 }
        );
      }
    });
  }
});
}
}
