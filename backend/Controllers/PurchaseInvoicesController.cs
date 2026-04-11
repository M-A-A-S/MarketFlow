using MarketFlow.Business.Interfaces;
using MarketFlow.DTOs.PurchaseInvoice;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MarketFlow.Controllers
{
    [Route("api/purchase-invoices")]
    public class PurchaseInvoicesController : BaseController
    {
        private readonly IPurchaseInvoiceService _service;

        public PurchaseInvoicesController(IPurchaseInvoiceService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return FromResult(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return FromResult(await _service.GetByIdAsync(id));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PurchaseInvoiceDTO dto)
        {
            return FromResult(await _service.AddAsync(dto));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PurchaseInvoiceDTO dto)
        {
            return FromResult(await _service.UpdateAsync(id, dto));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return FromResult(await _service.DeleteAsync(id));
        }
    }
}
