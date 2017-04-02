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
using System.Globalization;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ZeroWeb.Models;
using ZeroWeb.Api.Models;

namespace ZeroWeb.Api
{
    /// <summary>
    /// The News Endpoint.
    /// </summary>
    [Route("api/contributions")]
    public class ContributionsController: Controller
    {
        /// <summary>
        /// The application container.
        /// </summary>
        private IServiceProvider services;

        /// <summary>
        /// The calendar for getting a week of month.
        /// </summary>
        private GregorianCalendar calendar;

        /// <summary>
        /// Initializes a new instance of the <see cref="NewsController"/> class.
        /// </summary>
        /// <param name="services">The application container.</param>
        public ContributionsController(IServiceProvider services)
        {
            this.services = services;
            this.calendar = new GregorianCalendar();
        }

        private int GetMonthWeek(DateTime date)
        {
            DateTime firstOfMonth = new DateTime(date.Year, date.Month, 1);
            int givenWeekOfYear = this.calendar.GetWeekOfYear(date, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
            int firstWeekOfYear = this.calendar.GetWeekOfYear(firstOfMonth, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
            return givenWeekOfYear - firstWeekOfYear;
        }

        private string GetMonthWeekName(DateTime date)
        {
            return string.Format("{0} - {1}",
                this.GetStartOfWeek(date).ToString("mmm d"),
                this.GetEndOfWeek(date).ToString("mmm d"));
        }

        private DateTime GetStartOfWeek(DateTime date)
        {
            return date.AddDays(-(int)date.DayOfWeek);
        }

        private DateTime GetEndOfWeek(DateTime date)
        {
            return date.AddDays(7 - (int)date.DayOfWeek);
        }

        /// <summary>
        /// Gets the contributions.
        /// </summary>
        /// <param name="typeTagName">The type of article contributions to get (defaults to story).</param>
        public IActionResult GetContributions(string typeTagName)
        {
            try
            {
                IDataStore store = this.services.GetService(typeof(IDataStore)) as IDataStore;

                Tags typeTag = Tags.Story;
                Tags.TryParse(typeTagName, out typeTag);
                typeTagName = typeTag.ToString();

                // Shared.ArticlesPerPage
                // Shared.DaysPerPage

                return this.Json(store
                    .GetArticles(typeTag)
                    .Select(story => new 
                    {
                        Month = story.Date.ToString("mmm"),
                        Week = this.GetMonthWeek(story.Date),
                        WeekName = this.GetMonthWeekName(story.Date),
                        Tags = story.Metadata
                            .Where(metadata => metadata.Tag.Name != typeTagName)
                            .Select(metadata => metadata.Tag.Name)
                    })
                    .ToArray()
                    .Aggregate(new ContributionSummary(), (contributions, articleSummary) =>
                    {
                        foreach (string tag in articleSummary.Tags)
                        {
                            contributions.Aggregate(
                                articleSummary.Month,
                                articleSummary.Week,
                                articleSummary.WeekName,
                                tag);
                        }

                        return contributions;
                    }));
            }
            catch
            {
                return this.StatusCode(500);
            }
        }

        /// <summary>
        /// Star a news story.
        /// </summary>
        /// <param name="id">The story id</param>
        [HttpPost("star/{id}")]
        public IActionResult StarStory(int id)
        {
            try
            {
                IDataStore store = this.services.GetService(typeof(IDataStore)) as IDataStore;
                var story = store.GetArticle(id);

                if (story == null)
                {
                    return this.NotFound();
                }
                
                var storyStars = store.GetArticleStars(id);
                string excludeIpAddress = Shared.GetRequestIpAddress(this.Request);
                
                if (storyStars.Any(star => star.IpAddress == excludeIpAddress))
                {
                    return this.BadRequest();
                }
                
                story.Stars.Add(new Star(story, excludeIpAddress));
                store.Save();
                
                return this.Ok(new { stars = storyStars.Count() });
            }
            catch
            {
                return this.StatusCode(500);
            }
        }
    }
}