namespace InventoryManagement.Api.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Sku { get; set; } = string.Empty;

        public string? Description { get; set; }

        public decimal UnitPrice { get; set; }

        public int QuantityInStock { get; set; }

        public int ReorderLevel { get; set; }

        public DateTime CreatedDate { get; set; }

        public bool IsLowStock => QuantityInStock <= ReorderLevel;
    }
}
