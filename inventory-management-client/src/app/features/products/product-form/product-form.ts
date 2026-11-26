
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly productForm = this.fb.nonNullable.group({
    name: ['', [
      Validators.required,
      Validators.maxLength(100)
    ]],
    sku: ['', [
      Validators.required,
      Validators.maxLength(50)
    ]],
    description: ['', [
      Validators.maxLength(500)
    ]],
    unitPrice: [0, [
      Validators.required,
      Validators.min(0)
    ]],
    quantityInStock: [0, [
      Validators.required,
      Validators.min(0)
    ]],
    reorderLevel: [0, [
      Validators.required,
      Validators.min(0)
    ]]
  });


constructor() {
  if (this.data) {
    this.productForm.patchValue({
      name: this.data.name,
      sku: this.data.sku,
      description: this.data.description ?? '',
      unitPrice: this.data.unitPrice,
      quantityInStock: this.data.quantityInStock,
      reorderLevel: this.data.reorderLevel
    });
  }
}

save(): void {
  if (this.productForm.invalid || this.isSaving) {
    this.productForm.markAllAsTouched();
    return;
  }

  const product = this.productForm.getRawValue();

  if (!Number.isInteger(product.quantityInStock) ||
      !Number.isInteger(product.reorderLevel)) {
    this.errorMessage =
      'Stock quantity and reorder level must be whole numbers.';
    return;
  }

  this.isSaving = true;
  this.errorMessage = '';

  const request$: Observable<unknown> = this.data
  ? this.productService.update(this.data.id, product)
  : this.productService.create(product);

  request$
    .pipe(
      finalize(() => {
  this.isSaving = false;
  this.cdr.markForCheck();
})
    )
    .subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage =
            'A product with this SKU already exists.';
        } else {
          this.errorMessage =
            'Unable to save the product. Please try again.';
        }
      }
    });
}

private readonly dialogRef = inject(MatDialogRef<ProductForm>);

private readonly productService = inject(ProductService);

isSaving = false;
errorMessage = '';

readonly data = inject<Product | null>(MAT_DIALOG_DATA);

readonly isEditMode = this.data !== null;

readonly dialogTitle = this.isEditMode
  ? 'Edit Product'
  : 'Add Product';

}
