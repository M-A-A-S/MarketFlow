using MarketFlow.Business.Interfaces;
using MarketFlow.DTOs.Customer;
using MarketFlow.DTOs.Product;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MarketFlow.Controllers
{
    [Route("api/customers")]
    public class CustomersController : BaseController
    {
        private readonly ICustomerService _service;

        public CustomersController(ICustomerService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] CustomerFilterDTO filters)
        {
            return FromResult(await _service.GetFilteredAsync(filters));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return FromResult(await _service.GetByIdAsync(id));
        }

        [HttpGet("dropdown")]
        public async Task<IActionResult> GetDropdown([FromQuery] CustomerDropdownRequestDTO dto)
        {
            return FromResult(await _service.GetDropdownAsync(dto));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CustomerDTO DTO)
        {
            return FromResult(await _service.AddAsync(DTO));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CustomerDTO DTO)
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
