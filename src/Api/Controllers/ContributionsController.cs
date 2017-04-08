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
using ZeroWeb.Api.Models;

namespace ZeroWeb.Api
{
    /// <summary>
    /// The News Endpoint.
    /// </summary>
    [Route("api/contrib")]
    public class ContributionsController: Controller
    {
        /// <summary>
        /// The application container.
        /// </summary>
        private IServiceProvider services;

        /// <summary>
        /// Initializes a new instance of the <see cref="NewsController"/> class.
        /// </summary>
        /// <param name="services">The application container.</param>
        public ContributionsController(IServiceProvider services)
        {
            this.services = services;
        }

        /// <summary>
        /// Gets the contributions.
        /// </summary>
        /// <param name="tag">The type of articles to retrieve.</param>
        /// <param name="articles">Limit articles per page.</param>
        /// <param name="days">Limit days per page.</param>
        [HttpGet("{tag}/{articles:int?}/{days:int?}")]
        public IActionResult GetContributions(string tag, int? articles, int? days)
        {
            try
            {
                IDataStore store = this.services.GetService(typeof(IDataStore)) as IDataStore;

                ContributionSummary summary = store
                    .GetArticles(tag)
                    .SelectMany(
                        article => article.Metadata, 
                        (article, metadata) => new
                    {
                        Id = article.Id,
                        Title = article.Title,
                        Date = article.Date,
                        Tag = metadata.Tag.Name
                    })
                    .ToList()
                    .Aggregate(
                        new ContributionSummary(),
                        (accumulator, next) =>
                    {
                        return accumulator.Aggregate(
                            next.Id,
                            next.Title,
                            next.Date,
                            next.Tag);
                    });

                return this.Json(summary.Paginate(
                    Shared.ArticlesPerPage,
                    Shared.DaysPerPage));
            }
            catch(Exception error)
            {
                return this.StatusCode(500, error.Message);
            }
        }
    }
}