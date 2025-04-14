using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TableauController : ControllerBase
    {
        [HttpGet("tabs")]
        public ActionResult<IEnumerable<TableauTab>> GetTableauTabs()
        {
            // In a real application, this data would come from a database or configuration
            var tabs = new List<TableauTab>
            {
                new TableauTab
                {
                    Title = "Sales Dashboard",
                    Url = "https://your-tableau-server/views/sales-dashboard"
                },
                new TableauTab
                {
                    Title = "Marketing Analytics",
                    Url = "https://your-tableau-server/views/marketing-analytics"
                },
                new TableauTab
                {
                    Title = "Customer Insights",
                    Url = "https://your-tableau-server/views/customer-insights"
                }
            };

            return Ok(tabs);
        }
    }

    public class TableauTab
    {
        public string Title { get; set; }
        public string Url { get; set; }
    }
} 