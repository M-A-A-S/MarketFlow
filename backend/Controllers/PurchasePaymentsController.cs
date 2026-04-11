using MarketFlow.Business.Interfaces;
using MarketFlow.DTOs.PurchasePayment;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MarketFlow.Controllers
{
    [Route("api/purchase-payments")]
    public class PurchasePaymentsController : BaseController
    {
        private readonly IPurchasePaymentService _service;

        public PurchasePaymentsController(IPurchasePaymentService service)
        {
            _service = service;
        }

        [HttpGet("invoice/{invoiceId}")]
        public async Task<IActionResult> GetByInvoice(int invoiceId)
        {
            return FromResult(await _service.GetByInvoiceIdAsync(invoiceId));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PurchasePaymentDTO dto)
        {
            return FromResult(await _service.AddAsync(dto));
        }
    }
}
