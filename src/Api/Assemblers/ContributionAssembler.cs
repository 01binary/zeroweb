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
        /// Initializes a new instance of the <see cref="ContributionAssembler"/> class.
        /// </summary>
        /// <param name="contributionAggregator">The contribution aggregator.</param>
        public ContributionAssembler(IContributionAggregator contributionAggregator)
        {
            this.contributionAggregator = contributionAggregator;
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

            return this.Paginate(summary, max ?? Shared.ArticlesPerPage);
        }

        

        /// <summary>
        /// Paginate the contribution summary.
        /// </summary>
        /// <param name="maxArticles">Max. articles per page.</param>
        /// <returns>A self-reference for chaining.</returns>
        private ContributionSummary Paginate(ContributionSummary summary, int max)
        {
            string monthName = null;
            int articleCount = 0;
            DateTime[] weeks = null;
            WeekMapping pageStart = null;

            foreach (DateTime month in summary.Months.Keys.ToList().OrderByDescending(key => key))
            {
                MonthSummary monthSummary = summary.Months[month];
                monthName = month.ToString("MMM").ToLower();
                weeks = monthSummary.Weeks.Keys.OrderByDescending(key => key).ToArray();

                for (int weekIndex = 0; weekIndex < weeks.Length; weekIndex++)
                {
                    DateTime firstDayOfWeek = weeks[weekIndex];
                    WeekSummary weekSummary = monthSummary.Weeks[firstDayOfWeek];

                    for (int article = 0; article < weekSummary.Articles.Count; article++)
                    {
                        if (pageStart == null)
                        {
                            pageStart = new WeekMapping(monthName, weekIndex);
                        }

                        articleCount++;

                        if (articleCount == max)
                        {
                            summary.Pages.Add(new PageSummary
                            {
                                Start = pageStart,
                                End = new WeekMapping(monthName, weekIndex)
                            });

                            articleCount = 0;
                            pageStart = null;
                        }
                    }
                }
            }

            if (pageStart != null)
            {
                summary.Pages.Add(new PageSummary
                {
                    Start = pageStart,
                    End = new WeekMapping(monthName, weeks.Length - 1)
                });
            }

            return summary;
        }
    }
}