using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace InventoryManagement.Api.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Sku { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Precision(18, 2)]
        [Range(typeof(decimal), "0", "9999999999999999.99")]
        public decimal UnitPrice { get; set; }

        [Range(0, int.MaxValue)]
        public int QuantityInStock { get; set; }

        [Range(0, int.MaxValue)]
        public int ReorderLevel { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
