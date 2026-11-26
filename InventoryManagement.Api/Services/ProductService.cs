using InventoryManagement.Api.Data;
using InventoryManagement.Api.DTOs;
using InventoryManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Api.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            var products = await _context.Products
                .AsNoTracking()
                .OrderBy(p => p.Name)
                .ToListAsync();

            return products.Select(MapToDto);
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var product = await _context.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            return product == null ? null : MapToDto(product);
        }

        public async Task<ProductDto> CreateAsync(CreateProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name.Trim(),
                Sku = dto.Sku.Trim(),
                Description = dto.Description,
                UnitPrice = dto.UnitPrice,
                QuantityInStock = dto.QuantityInStock,
                ReorderLevel = dto.ReorderLevel,
                CreatedDate = DateTime.UtcNow
            };

            _context.Products.Add(product);

            await _context.SaveChangesAsync();

            return MapToDto(product);
        }

        public async Task<bool> UpdateAsync(
            int id, UpdateProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return false;
            }

            product.Name = dto.Name.Trim();
            product.Sku = dto.Sku.Trim();
            product.Description = dto.Description;
            product.UnitPrice = dto.UnitPrice;
            product.QuantityInStock = dto.QuantityInStock;
            product.ReorderLevel = dto.ReorderLevel;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return false;
            }

            _context.Products.Remove(product);

            await _context.SaveChangesAsync();

            return true;
        }

        private static ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Sku = product.Sku,
                Description = product.Description,
                UnitPrice = product.UnitPrice,
                QuantityInStock = product.QuantityInStock,
                ReorderLevel = product.ReorderLevel,
                CreatedDate = product.CreatedDate
            };
        }
    }
}
