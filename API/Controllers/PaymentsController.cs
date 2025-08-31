using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly PaymentService _paymentService;
        private readonly StoreContext _storeContext;
        private readonly IConfiguration _configuration;
        public PaymentsController(PaymentService paymentService, StoreContext storeContext, IConfiguration configuration)
        {
            _paymentService = paymentService;
            _storeContext = storeContext;
            _configuration = configuration;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDTO>> CreateOrUpdatePaymentIntent()
        {
            var basket = await _storeContext.Baskets.RetrieveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();

            if (basket == null) return NotFound();

            var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

            if (intent == null) return BadRequest(new ProblemDetails { Title = "Unable to process the payment" });

            basket.PaymentIntentId ??= intent.Id;
            basket.ClientSecret ??= intent.ClientSecret;

            _storeContext.Update(basket);

            var result = await _storeContext.SaveChangesAsync() > 0;

            if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });

            return basket.MapBasketToDTO();
        }

        //This needs to be Anonymous
        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _configuration["StripeSettings:WhSecret"]);

            var charge = (Charge)stripeEvent.Data.Object;

            var order = await _storeContext.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId);

            if (charge.Status == "succeeded") order.OrderStatus = OrderStatus.PaymentReceived;

            await _storeContext.SaveChangesAsync();

            return new EmptyResult(); //we need to send this back to stripe so that it will know we received its request
        }
    }
}