using System.ComponentModel.DataAnnotations;

namespace InventoryManagement.Api.DTOs
{
    public class UpdateProductDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Sku { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Range(typeof(decimal), "0", "9999999999999999.99")]
        public decimal UnitPrice { get; set; }

        [Range(0, int.MaxValue)]
        public int QuantityInStock { get; set; }

        [Range(0, int.MaxValue)]
        public int ReorderLevel { get; set; }
    }
}
