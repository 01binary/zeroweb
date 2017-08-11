/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines the Contributions Endpoint.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ZeroWeb.Api.Assemblers;
using ZeroWeb.Api.Models;

namespace ZeroWeb.Api
{
    /// <summary>
    /// The Contributions Endpoint.
    /// </summary>
    [Route("api/contrib")]
    public class ContributionsController: Controller
    {
        /// <summary>
        /// The application container.
        /// </summary>
        private IServiceProvider services;

        /// <summary>
        /// The contribution summary assembler.
        /// </summary>
        private IContributionAssembler assembler;

        /// <summary>
        /// Initializes a new instance of the <see cref="ContributionsController"/> class.
        /// </summary>
        /// <param name="services">The application container.</param>
        /// <param name="assembler">The contribution summary assembler.</param>
        public ContributionsController(IServiceProvider services, IContributionAssembler assembler)
        {
            this.services = services;
            this.assembler = assembler;
        }

        /// <summary>
        /// Gets the contributions.
        /// </summary>
        /// <param name="tag">The type of articles to retrieve.</param>
        /// <param name="year">The year to retrieve contributions for, current if null.</param>
        /// <param name="articles">Limit articles per page.</param>
        [HttpGet("{tag}/{year:int?}/{articles:int?}")]
        public IActionResult GetContributions(string tag, int? year, int? articles)
        {
            try
            {
                var store = this.services.GetService(typeof(IDataStore)) as IDataStore;
                var contributions = store
                    .GetArticles(true, tag)
                    .OrderByDescending(article => article.Date.Ticks);

                var summary = assembler.GetContributionSummary(contributions, year, articles);
                
                return this.Json(summary);
            }
            catch (Exception error)
            {
                return this.StatusCode(500, error.Message);
            }
        }
    }
}