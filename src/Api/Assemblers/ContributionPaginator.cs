/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Paginates the Contribution Summary model.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Assemblers
{
    using System;
    using System.Linq;
    using ZeroWeb.Api.Models;

    /// <summary>
    /// Contribution summary paginator.
    /// </summary>
    public interface IContributionPaginator
    {
        ContributionSummary Paginate(ContributionSummary summary, int articlesPerPage);
    }

    /// <summary>
    /// Contribution summary paginator.
    /// </summary>
    public class ContributionPaginator: IContributionPaginator
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ContributionPaginator"/> class.
        /// </summary>
        public ContributionPaginator()
        {
        }

        /// <summary>
        /// Paginates the contribution summary in-place.
        /// </summary>
        /// <param name="summary">The contribution summary model.</param>
        /// <param name="articlesPerPage">Max. articles per page.</param>
        /// <returns>The updated contribution summary.</returns>
        public ContributionSummary Paginate(ContributionSummary summary, int articlesPerPage)
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

                        if (articleCount == articlesPerPage)
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
