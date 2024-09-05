using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using project_main.Models;
using project_main.Service;
using project_main.Services;

namespace project_main.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : Controller
    {
        private readonly IClientService _clientService;
        private readonly ILicensesService _licensesService;

        public ClientController(IClientService clientService, ILicensesService licensesService)
        {
            _clientService = clientService;
            _licensesService = licensesService;
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var client = _clientService.GetAll();
            return Ok(client);
        }

        //ATENTION! This path only returns 3 fields of client table
        [HttpGet("GetClientInfo")]
        public IActionResult GetClientInfo(Guid idLicense)
        {
            var licenseData = _licensesService.GetLicenseById(idLicense);
            if(licenseData == null)
            {
                return NotFound("License Data not found");
            }

            var clientNecessaryInfo = _clientService.GetClientInfoById(licenseData.FkIdClient);

            return Ok(clientNecessaryInfo);
        }

        [HttpPost("SuspendClient")]
        public IActionResult SuspendClient(Client client)
        {

            _clientService.Update(client);

            return Ok("Client suspended successfully");
        }
    }
}
