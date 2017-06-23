/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines an article grouped with associated index.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using ZeroWeb.Models;

namespace ZeroWeb.Api.Models
{
    /// <summary>
    /// Article with descending date sort ordinal.
    /// </summary>
    public class IndexedArticle
    {
        /// <summary>
        /// Gets or sets the article.
        /// </summary>
        public Article Article { get; set; }

        /// <summary>
        /// Gets or sets the article index.
        /// </summary>
        public int Index { get; set; }
    }
}