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
        /// Initializes a new instance of the <see cref="ContributionsController"/> class.
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
                    .GetArticles(true, tag)
                    .Select(article => new {
                        Key = article.Key,
                        Title = article.Title,
                        Date = article.Date,
                        Tags = article.Metadata
                            .Where(filter => filter.Tag.ParentId != null)
                            .Select(metadata => metadata.Tag.ParentId != null ?
                                metadata.Tag.Parent.Name + "-" + metadata.Tag.Name :
                                metadata.Tag.Name)
                    })
                    .ToList()
                    .SelectMany(
                        article => article.Tags,
                        (article, articleTag) => new
                    {
                        Key = article.Key,
                        Title = article.Title,
                        Date = article.Date,
                        Tag = articleTag
                    })
                    .Aggregate(
                        new ContributionSummary(),
                        (accumulator, next) =>
                    {
                        return accumulator.Aggregate(
                            next.Key,
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