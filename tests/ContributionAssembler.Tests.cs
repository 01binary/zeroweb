/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Contribution Summary Assembler tests.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Tests
{
    using System;
    using System.Linq;
    using ZeroWeb.Models;
    using ZeroWeb.Api.Aggregators;
    using ZeroWeb.Api.Assemblers;
    using ZeroWeb.Api.Models;
    using ZeroWeb.Tests.Fixtures;
    using Moq;
    using Xunit;

    /// <summary>
    /// Contribution Summary Assembler tests.
    /// </summary>
    public class ContributionAssemblerTests : ArticleTestsFixture
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ContributionAssemblerTests"/> class.
        /// </summary>
        public ContributionAssemblerTests()
        {
            this.mockAggregator = new Mock<IContributionAggregator>();
            this.mockAggregator
                .Setup(a => a.Aggregate(
                    It.IsAny<ContributionSummary>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<DateTime>(),
                    It.IsAny<string>()))
                .Returns(It.IsAny<ContributionSummary>())
                .Callback<ContributionSummary, string, string, DateTime, string>
                    ((summary, key, title, date, tag) => {
                    this.aggregator.Aggregate(summary, key, title, date, tag);
                });

            this.weekAggregator = new WeekContributionAggregator();
            this.monthAggregator = new MonthContributionAggregator(weekAggregator);
            this.aggregator = new ContributionAggregator(this.monthAggregator, this.weekAggregator);
            this.assembler = new ContributionAssembler(this.mockAggregator.Object);
        }

        /// <summary>
        /// Verifies the aggregator is called for every tag of every article.
        /// </summary>
        [Fact]
        public void CallsContributionAggregatorForArticleTags() 
        {
            GivenArticles(this
                .GivenArticle("web design article")
                    .WithDate(DateTime.Now.AddMonths(-1))
                    .WithTags("story", "design", "web")
                .GivenArticle("mechanical engineering article")
                    .WithSameDate()
                    .WithTags("story", "engineering", "mechanical")
                .GivenArticle("robotics article")
                    .WithNextDayDate()
                    .WithTags("story", "engineering", "robotics")
                .GivenArticle("software engineering article")
                    .WithSameDate()
                    .WithTags("story", "engineering", "software")
                .GivenArticle("another software engineering article")
                    .WithSameDate()
                    .WithTags("story", "engineering", "software")
                .GivenArticle("art of music production")
                    .WithNextWeekDate()
                    .WithTags("story", "art", "music")
                .Build()
            );

            WhenGetContributionSummary();

            ThenForEachArticleTag((meta) =>
                VerifyAggregatorCalled(
                    meta.Article.Key,
                    meta.Article.Title,
                    meta.Article.Date,
                    meta.Tag.Name));
        }

        /// <summary>
        /// Verifies the assembler sets the contribution summary year provided.
        /// </summary>
        [Fact]
        public void SetsContributionYearProvided()
        {
            GivenContributionYear(DateTime.Now.Year - 1);
            GivenArticles(this
                .GivenArticle("underpainting")
                    .WithDate(DateTime.Now.AddYears(-1))
                    .WithTags("story", "art", "painting")
                .GivenArticle("one more mechanical")
                    .WithNextDayDate()
                    .WithTags("story", "engineering", "mechanical")
                .Build()
            );

            WhenGetContributionSummary();

            ThenHasContributionYear(DateTime.Now.Year - 1);
        }

        /// <summary>
        /// Verifies the assembler sets current year when not provided.
        /// </summary>
        [Fact]
        public void SetsCurrentYearWhenNotProvided()
        {
            GivenNoContributionYear();
            GivenArticles(this
                .GivenArticle("robotics ai")
                    .WithDate(DateTime.Now)
                    .WithTags("story", "engineering", "robotics")
                .GivenArticle("water based actuators")
                    .WithNextDayDate()
                    .WithTags("story", "engineering", "robotics")
                .Build()
            );

            WhenGetContributionSummary();

            ThenHasContributionYear(DateTime.Now.Year);
        }

        /// <summary>
        /// Verifies the assembler uses the provided page size for paginating.
        /// </summary>
        [Fact]
        public void UsesProvidedPageSize()
        {
            GivenMaxArticlesPerPage(2);
            GivenArticles(this
                .GivenArticle("quadrupedal locomotion")
                    .WithDate(DateTime.Parse("02/28/2017"))
                    .WithTags("story", "engineering", "robotics")
                .GivenArticle("the tolerance stack")
                    .WithNextDayDate()
                    .WithTags("story", "engineering", "mechanical")
                .GivenArticle("machining, laser cutting, or investing")
                    .WithNextDayDate()
                    .WithTags("story", "engineering", "mechanical")
                .GivenArticle("grids in design")
                    .WithSameDate()
                    .WithTags("story", "design", "ui")
                .Build()
            );

            WhenGetContributionSummary();

            ThenHasPages(2);
            ThenHasPage(0, "feb", 4, "feb", 4);
            ThenHasPage(1, "mar", 0, "mar", 0);
        }

        /// <summary>
        /// Verifies that pagination occurs with default page size when page size not provided.
        /// </summary>
        [Fact]
        public void UsesDefaultPageSize()
        {
            GivenNoMaxArticlesPerPage();
            GivenArticles(this
                .GivenArticle("controllers and buses")
                    .WithDate(DateTime.Parse("04/15/2017"))
                    .WithTags("story", "engineering", "robotics")
                .GivenArticle("much about sensors")
                    .WithNextWeekDate()
                    .WithTags("story", "engineering", "robotis")
                .GivenArticle("point cloud computer vision")
                    .WithNextWeekDate()
                    .WithTags("story", "engineering", "robotics")
                .GivenArticle("painting addons")
                    .WithNextDayDate()
                    .WithTags("story", "art", "painting")
                .Build()
            );

            WhenGetContributionSummary();

            ThenHasPages(1);
            ThenHasPage(0, "apr", 2, "may", 0);
        }

        private void GivenArticles(Article[] articles)
        {
            this.articles = articles;
        }

        private void GivenContributionYear(int year)
        {
            this.year = year;
        }

        private void GivenNoContributionYear()
        {
            this.year = null;
        }

        private void GivenMaxArticlesPerPage(int max)
        {
            this.max = max;
        }

        private void GivenNoMaxArticlesPerPage()
        {
            this.max = null;
        }

        private void WhenGetContributionSummary()
        {
            this.summary = this.assembler.GetContributionSummary(
                this.articles.AsQueryable(),
                this.year,
                this.max);
        }

        private void VerifyAggregatorCalled(string key, string title, DateTime date, string tag)
        {
            this.mockAggregator.Verify(a => a.Aggregate(
                It.IsAny<ContributionSummary>(),
                It.Is<string>(passedKey => passedKey == key),
                It.Is<string>(passedTitle => passedTitle == title),
                It.Is<DateTime>(passedDate => passedDate == date),
                It.IsAny<string>()
            ), Times.Once);
        }

        private void ThenHasContributionYear(int year)
        {
            Assert.Equal(year, this.summary.Year);
        }

        private void ThenHasPages(int pages)
        {
            Assert.Equal(pages, this.summary.Pages.Count);
        }

        private void ThenHasPage(int page, string month, int week, string endMonth, int endWeek)
        {
            Assert.Equal(month, this.summary.Pages[page].Start.Month);
            Assert.Equal(week, this.summary.Pages[page].Start.Week);

            Assert.Equal(endMonth, this.summary.Pages[page].End.Month);
            Assert.Equal(endWeek, this.summary.Pages[page].End.Week);
        }

        private void ThenForEachArticleTag(Action<Metadata> action)
        {
            foreach (var meta in this.articles.SelectMany(article => article.Metadata))
            {
                action.Invoke(meta);
            }
        }

        private IContributionAssembler assembler;
        private Mock<IContributionAggregator> mockAggregator;
        private IContributionAggregator aggregator;
        private IMonthContributionAggregator monthAggregator;
        private IWeekContributionAggregator weekAggregator;
        private ContributionSummary summary;
        private Article[] articles;
        private int? year;
        private int? max;
    }
}
