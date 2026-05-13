using MarketFlow.Business.Interfaces;
using MarketFlow.DTOs.PurchaseInvoice;
using MarketFlow.DTOs.SaleInvoice;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MarketFlow.Controllers
{
    [Route("api/sale-invoices")]
    public class SaleInvoicesController : BaseController
    {
        private readonly ISaleInvoiceService _service;

        public SaleInvoicesController(ISaleInvoiceService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] SaleInvoiceFilterDTO filters)
        {
            return FromResult(await _service.GetFilteredAsync(filters));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SaleInvoiceDTO dto)
        {
            return FromResult(await _service.AddAsync(dto));
        }

    }
}
