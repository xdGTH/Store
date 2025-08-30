using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _storeContext;
        public OrdersController(StoreContext storeContext)
        {
            _storeContext = storeContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDTO>>> GetOrders()
        {
            return await _storeContext.Orders
                .ProjectOrderToOrderDTO()
                .Where(x => x.BuyerId == User.Identity.Name)
                .ToListAsync();
        }

        [HttpGet("{id}", Name ="GetOrderById")]
        public async Task<ActionResult<OrderDTO>> GetOrderById(int id)
        {
            return await _storeContext.Orders
                //.Include(x => x.OrderItems)
                .ProjectOrderToOrderDTO()
                .Where(o => o.Id == id && o.BuyerId == User.Identity.Name)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDTO createOrderDTO)
        {
            var basket = await _storeContext.Baskets.RetrieveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();

            if (basket == null) return BadRequest(new ProblemDetails { Title = "Could not locate the basket" });

            var items = new List<OrderItems>();

            foreach (var item in basket.Items)
            {
                //double checking the item in the database
                var productItem = await _storeContext.Products.FindAsync(item.ProductId);
                var itemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };
                var orderItem = new OrderItems
                {
                    ItemOrdered = itemOrdered, //from db (double checked)
                    Price = productItem.Price, //from db
                    Quantity = item.Quantity //from basket
                };
                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }

            var subTotal = items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = subTotal > 10000 ? 0 : 500;

            var order = new Order
            {
                OrderItems = items,
                BuyerId = User.Identity.Name,
                ShippingAddress = createOrderDTO.ShippingAddress,
                SubTotal = subTotal,
                DeliveryFee = deliveryFee
            };

            await _storeContext.Orders.AddAsync(order);
            _storeContext.Baskets.Remove(basket); //we added the order so we remove the basket

            if (createOrderDTO.SaveAddress)
            {
                var user = await _storeContext.Users
                    .Include(x => x.Address)
                    .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

                var address=  new UserAddress
                {
                    FullName = createOrderDTO.ShippingAddress.FullName,
                    Address1 = createOrderDTO.ShippingAddress.Address1,
                    Address2 = createOrderDTO.ShippingAddress.Address2,
                    City = createOrderDTO.ShippingAddress.City,
                    State = createOrderDTO.ShippingAddress.State,
                    Zip = createOrderDTO.ShippingAddress.Zip,
                    Country = createOrderDTO.ShippingAddress.Country,
                };
                user.Address = address;
                // _storeContext.Update(user);
            }
            var result = await _storeContext.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetOrderById", new {id = order.Id}, order.Id); //returning int inside CreatedAtRoute is allowed

            return BadRequest("Problem creating order");
        }
    }
}