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
        /// <param name="year">The year to retrieve contributions for, current if null.</param>
        /// <param name="articles">Limit articles per page.</param>
        [HttpGet("{tag}/{year:int?}/{articles:int?}")]
        public IActionResult GetContributions(string tag, int? year, int? articles)
        {
            try
            {
                IDataStore store = this.services.GetService(typeof(IDataStore)) as IDataStore;
                DateTime start = DateTime.MinValue;
                DateTime end = DateTime.MaxValue;

                if (year.HasValue)
                {
                    end = new DateTime(year.Value, 1, 1);
                    start = end.AddMonths(12);
                }
                else
                {
                    var today = DateTime.Now.Date;
                    end = new DateTime(today.Year, today.Month, 1);
                    start = end.AddMonths(-12);
                }

                return this.Json(store
                    .GetArticles(true, tag)
                    .Where(article =>
                        article.Date.Date >= start &&
                        article.Date.Date <= end)
                    .OrderByDescending(article => article.Date.Ticks)
                    .Select(article => new {
                        Key = article.Key,
                        Title = article.Title,
                        Date = article.Date,
                        Tags = article.Metadata
                            .Where(filter => filter.Tag.ParentId != null)
                            .Select(metadata => metadata.Tag.Parent.Name + "-" + metadata.Tag.Name)
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
                    })
                    .Paginate(Shared.ArticlesPerPage));
            }
            catch (Exception error)
            {
                return this.StatusCode(500, error.Message);
            }
        }
    }
}