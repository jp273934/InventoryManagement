using InventoryManagement.Api.DTOs;
using InventoryManagement.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
        {
            var products = await _productService.GetAllAsync();

            return Ok(products);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> Create(
            CreateProductDto dto)
        {
            try
            {
                var product = await _productService.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = product.Id },
                    product);
            }
            catch (DbUpdateException ex) when (IsDuplicateKey(ex))
            {
                return Conflict(new
                {
                    message = "A product with this SKU already exists."
                });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id, UpdateProductDto dto)
        {
            try
            {
                var updated = await _productService.UpdateAsync(id, dto);

                if (!updated)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (DbUpdateException ex) when (IsDuplicateKey(ex))
            {
                return Conflict(new
                {
                    message = "A product with this SKU already exists."
                });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _productService.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

        private static bool IsDuplicateKey(DbUpdateException exception)
        {
            return exception.InnerException is SqlException sqlException
                && sqlException.Number is 2601 or 2627;
        }
    }
}
