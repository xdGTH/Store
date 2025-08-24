using System.Text.Json;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;

        public ProductsController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
        {
            //Making it og type IQueryable
            var query = _context.Products
            .Sort(productParams.OrderBy) //Extension Method where we build the query and return it here
            .Search(productParams.SearchTerm) //Extension method
            .Filter(productParams.Brands, productParams.Types)
            .AsQueryable();

            var products = await PagedList<Product>.ToPagedList(query, productParams.pageNumber,
            productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData);

            return products;

        }

        [HttpGet("{id}")] // api/products/{id}
        public async Task<ActionResult<Product>> GetProductByID(int Id)
        {
            Product product = await _context.Products.FindAsync(Id);

            if (product == null) return NotFound();

            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(b => b.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(t => t.Type).Distinct().ToListAsync();

            return Ok(new { brands, types });
        }
    }
}