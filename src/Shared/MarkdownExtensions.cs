/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Markdown post-processing extensions.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace ZeroWeb
{
    /// <summary>
    /// Markdown extensions for site content.
    /// </summary>
    public static class MarkdownExtensions
    {
        private static readonly Regex view3DPattern = new Regex(
            @"<a href=""(?<url>[^\""]*)""[^\>]*>3d-?(?<options>[^\<]*)<\/a>",
            RegexOptions.Compiled);

        /// <summary>
        /// Markdown extensions for site content.
        /// </summary>
        /// <param name="html">The markdown converted to HTML to post-process.</param>
        /// <returns>The post-processed HTML.</returns>
        public static string PostProcess(string html)
        {
            return view3DPattern.Replace(html, View3DEvaluator);
        }

        /// <summary>
        /// Evaluate matches for 3D view markdown.
        /// </summary>
        /// <param name="match">The matched 3D view.</param>
        /// <returns>The replacement HTML.</param>
        /// <remarks>
        /// [3d](projectname/partname)
        /// [3d-option](projectname/partname)
        /// [3d-firstoption-secondoption=value-thirdoption](projectname/partname)
        /// </remarks>
        private static string View3DEvaluator(Match match)
        {
            try
            {
                string[] url = match.Groups["url"].Value.Split('/');
                List<string> options = match.Groups["options"].Value
                    .Split('-')
                    .Select(option => option.IndexOf('=') != -1 ? $"data-{option}" : $"data-{option}={""}1{""}")
                    .ToList();

                if (url.Length == 2 && !string.IsNullOrWhiteSpace(url[0]))
                {
                    options.Add($"data-project={url[0]}");
                    options.Add($"data-part={url[1]}");
                }

                return $"<model {string.Join(" ", options)}/>";
            }
            catch
            {
                return match.Value;
            }
        }
    }
}