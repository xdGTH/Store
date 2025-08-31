namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new();
        public string PaymentIntentId { get; set; } //for stripe
        public string ClientSecret { get; set; }

        public void AddItem(Product product, int quantity)
        {
            if (Items.All(item => item.ProductId != product.Id))
            {
                Items.Add(new BasketItem { Product = product, Quantity = quantity });
            }

            var existingBasketItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            if (existingBasketItem != null) existingBasketItem.Quantity += quantity;
        }

        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);

            if (item == null) return;

            item.Quantity -= quantity;

            if (item.Quantity <= 0) Items.Remove(item);
        }
    }
}