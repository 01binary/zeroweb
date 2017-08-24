/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Assembles the Contribution Summary model.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Assemblers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using ZeroWeb.Api.Aggregators;
    using ZeroWeb.Api.Models;
    using ZeroWeb.Models;

    /// <summary>
    /// Contribution summary assembler.
    /// </summary>
    public interface IContributionAssembler
    {
        ContributionSummary GetContributionSummary(IQueryable<Article> articles, int? year, int? max);
    }

    /// <summary>
    /// Contribution summary assembler.
    /// </summary>
    public class ContributionAssembler: IContributionAssembler
    {
        /// <summary>
        /// The contribution summary aggregator.
        /// </summary>
        private IContributionAggregator contributionAggregator;

        /// <summary>
        /// The contribution summary paginator.
        /// </summary>
        private IContributionPaginator contributionPaginator;

        /// <summary>
        /// Initializes a new instance of the <see cref="ContributionAssembler"/> class.
        /// </summary>
        /// <param name="contributionAggregator">The contribution aggregator.</param>
        /// <param name="contributionPaginator">The contribution paginator.</param>
        public ContributionAssembler(
            IContributionAggregator contributionAggregator,
            IContributionPaginator contributionPaginator)
        {
            this.contributionAggregator = contributionAggregator;
            this.contributionPaginator = contributionPaginator;
        }

        /// <summary>
        /// Assembles the contribution summary.
        /// </summary>
        public ContributionSummary GetContributionSummary(IQueryable<Article> articles, int? year, int? max)
        {
            var summary = articles
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
                    new ContributionSummary
                    {
                        Pages = new List<PageSummary>(),
                        Months = new MonthDictionary(),
                        Years = new List<int>(),
                        Year = year ?? DateTime.Now.Year
                    },
                    (accumulator, next) =>
                {
                    return this.contributionAggregator.Aggregate(
                        accumulator,
                        next.Key,
                        next.Title,
                        next.Date,
                        next.Tag);
                });

            return this.contributionPaginator.Paginate(
                summary,
                max ?? Shared.ArticlesPerPage);
        }
    }
}
