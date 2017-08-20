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
            this.aggregator = new Mock<IContributionAggregator>();
            this.aggregator.Setup(a => a.Aggregate(
                It.IsAny<ContributionSummary>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<DateTime>(),
                It.IsAny<string>()))
                .Returns(It.IsAny<ContributionSummary>());

            this.assembler = new ContributionAssembler(this.aggregator.Object);
        }

        /// <summary>
        /// Verifies the aggregator is called for every tag of every article.
        /// </summary>
        [Fact]
        public void CallsContributionAggregatorForArticleTags() 
        {
            GivenArticles(
                GivenArticle("")
                    .WithDate(DateTime.Now.AddMonths(-1))
                    .WithTags("")
                .GivenArticle("")
                    .WithSameDate()
                    .WithTags("")
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

        }

        /// <summary>
        /// Verifies the assembler sets current year when not provided.
        /// </summary>
        [Fact]
        public void SetsCurrentYearWhenNotProvided()
        {

        }

        /// <summary>
        /// Verifies the assembler uses the provided page size for paginating.
        /// </summary>
        [Fact]
        public void UsesProvidedPageSize()
        {

        }

        /// <summary>
        /// Verifies that pagination occurs with default page size when page size not provided.
        /// </summary>
        [Fact]
        public void UsesDefaultPageSize()
        {

        }

        private void GivenArticles(Article[] articles)
        {
            this.articles = articles;
        }

        private void GivenYear(int year)
        {
            this.year = year;
        }

        private void GivenNoYear()
        {
            this.year = null;
        }

        private void GivenMax(int max)
        {
            this.max = max;
        }

        private void GivenNoMax()
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
            this.aggregator.Verify(a => a.Aggregate(
                It.IsAny<ContributionSummary>(),
                It.Is<string>(passedKey => passedKey == key),
                It.Is<string>(passedTitle => passedTitle == title),
                It.Is<DateTime>(passedDate => passedDate == date),
                It.IsAny<string>()
            ), Times.Once);
        }

        private void ThenHasContributionYear(int year)
        {
        }

        private void ThenHasPages(int pages)
        {

        }

        private void ThenHasPage(int page, string month, int week)
        {

        }

        private void ThenForEachArticleTag(Action<Metadata> action)
        {
            foreach (var meta in this.articles.SelectMany(article => article.Metadata))
            {
                action.Invoke(meta);
            }
        }

        private IContributionAssembler assembler;
        private Mock<IContributionAggregator> aggregator;
        private ContributionSummary summary;
        private Article[] articles;
        private int? year;
        private int? max;
    }
}
