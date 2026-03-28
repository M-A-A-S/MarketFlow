using MarketFlow.Business.Interfaces;
using MarketFlow.DTOs.Category;
using MarketFlow.DTOs.Product;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MarketFlow.Controllers
{
    [Route("api/products")]
    public class ProductsController : BaseController
    {
        private readonly IProductService _service;

        public ProductsController(IProductService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ProductFilterDTO filters)
        {
            return FromResult(await _service.GetFilteredAsync(filters));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return FromResult(await _service.GetByIdAsync(id));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductDTO DTO)
        {
            return FromResult(await _service.AddAsync(DTO));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductDTO DTO)
        {
            return FromResult(await _service.UpdateAsync(id, DTO));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return FromResult(await _service.DeleteAsync(id));
        }
    }
}
