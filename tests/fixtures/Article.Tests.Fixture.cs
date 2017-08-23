/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Article factory for unit tests.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Tests.Fixtures
{
    using System;
    using System.Collections.Generic;
    using ZeroWeb.Models;

    /// <summary>
    /// Article tests fixture.
    /// </summary>
    public class ArticleTestsFixture
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ArticleTestsFixture"/> class.
        /// </summary>
        public ArticleTestsFixture()
        {
            this.articleList = new List<Article>();
        }

        /// <summary>
        /// Starts an article definition chain.
        /// </summary>
        public ArticleTestsFixture GivenArticle(string title)
        {
            this.prevArticle = this.article;
            this.article = new Article();
            this.articleList.Add(article);
            this.article.Title = title;
            this.article.Key = this.article.Title.ToLower().Replace(' ', '-');

            return this;
        }

        /// <summary>
        /// Defines the date for an article.
        /// </summary>
        /// <param name="date">The article date.</param>
        public ArticleTestsFixture WithDate(DateTime date)
        {
            this.article.Date = date;
            return this;
        }

        /// <summary>
        /// Defines the date for an article same as previously defined article date.
        /// </summary>
        public ArticleTestsFixture WithSameDate()
        {
            if (this.prevArticle != null)
            {
                this.article.Date = this.prevArticle.Date;
            }

            return this;
        }

        /// <summary>
        /// Defines the date for an article one day after previously defined article date.
        /// </summary>
        public ArticleTestsFixture WithNextDayDate()
        {
            if (this.prevArticle != null)
            {
                this.article.Date = this.prevArticle.Date.AddDays(1);
            }

            return this;
        }

        /// <summary>
        /// Defines the date for an article one week after previously defined article date.
        /// </summary>
        public ArticleTestsFixture WithNextWeekDate()
        {
            if (this.prevArticle != null)
            {
                this.article.Date = this.prevArticle.Date.AddDays(7);
            }

            return this;
        }

        /// <summary>
        /// Defines the tags for an article.
        /// </summary>
        public ArticleTestsFixture WithTags(params string[] tags)
        {
            if (this.article.Metadata == null)
            {
                this.article.Metadata = new List<Metadata>();
            }

            foreach (string tag in tags)
            {
                string[] parentChild = tag.Split('-');

                if (parentChild.Length > 1)
                {
                    this.article.Metadata.Add(new Metadata
                    {
                        Article = this.article,
                        Tag = new Tag
                        {
                            Name = parentChild[1],
                            Parent = new Tag
                            {
                                Name = parentChild[0]
                            }
                        }
                    });
                }
                else
                {
                    this.article.Metadata.Add(new Metadata
                    {
                        Article = this.article,
                        Tag = new Tag
                        {
                            Name = tag
                        }
                    });
                }
            }

            return this;
        }

        /// <summary>
        /// Completes the article definition chain.
        /// </summary>
        public Article[] Build()
        {
            return this.articleList.ToArray();
        }

        /// <summary>
        /// The current article being defined.
        /// </summary>
        private Article article;

        /// <summary>
        /// The previous article defined.
        /// </summary>
        private Article prevArticle;

        /// <summary>
        /// The article list being defined.
        /// </summary>
        private List<Article> articleList;
    }
}