/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Shared site functionality
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Html;

namespace ZeroWeb
{
    /// <summary>
    /// Shared functionality.
    /// </summary>
    public static class Shared
    {
        /// <summary>
        /// Format story content using GitHub Markdown Api.
        /// </summary>
        /// <param name="tagName">The content to format.</param>
        /// <returns>The formatted content.</returns>
        public static HtmlString FormatContent(string content)
        {
            const string GitHubApiUrl = "https://api.github.com/markdown/raw";
            const string Operation = "format content";
            string formatted = string.Empty;

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("User-Agent", "ZeroWeb");

                    var result = client.PostAsync(GitHubApiUrl, new StringContent(content)).Result;
                    formatted = result.Content.ReadAsStringAsync().Result;
                }
            }
            catch (Exception ex)
            {
                formatted = FormatError(Operation, "server error", ex.Message);
            }

            return new HtmlString(formatted);
        }

        /// <summary>
        /// Format a tag to enforce content transformation policy.
        /// </summary>
        /// <param name="tagName">The tag to format.</param>
        /// <returns>The formatted tag.</returns>
        public static string FormatTag(string tagName)
        {
            return tagName.ToLower();
        }

        /// <summary>
        /// Format a date for end user display.
        /// </summary>
        /// <param name="date">The date to format</param>
        /// <returns>The formatted date.</returns>
        public static string FormatDate(DateTime date)
        {
            if (date.Year == DateTime.Today.Year)
            {
                if (date.Month == DateTime.Today.Month)
                {
                    if (date.Date == DateTime.Today)
                    {
                        // Today but different time.
                        return string.Format("{0} today", date.ToString("h:mm tt")).ToLower();
                    }
                    else
                    {
                        DateTime weekStart = DateTime.Today.DayOfWeek == DayOfWeek.Sunday ?
                            DateTime.Today.AddDays(-6) :
                            DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek - 1);

                        if (date >= weekStart)
                        {
                            // Another day this week.
                            return string.Format("{0} at {1}", date.ToString("ddd"), date.ToString("h:mm tt")).ToLower();
                        }
                    }
                }

                // This month or this year.
                return date.ToString("M/d h:mm tt").ToLower();
            }
            else
            {
                // Display the full date.
                return date.ToString("M/d/yy h:mm tt").ToLower();
            }
        }

        /// <summary>
        /// Gets the request IP address.
        /// </summary>
        /// <returns>The request IP address.</returns>
        public static string GetRequestIpAddress(HttpRequest request)
        {
            return request.HttpContext.Connection.RemoteIpAddress.ToString();
        }

        /// <summary>
        /// Renders a formatted error.
        /// </summary>
        /// <param name="operation">The operation that resulted in the error.</param>
        /// <param name="code">The error code.</param>
        /// <param name="message">The error message.</param>
        /// <returns>The formatted error rendered with error directive on the client.</returns>
        private static string FormatError(string operation, string code, string message)
        {
            return string.Format(
                "<error data-operation=\"'{0}'\" data-code=\"'{1}'\" data-message=\"'{2}'\"></error>",
                operation,
                code,
                message);
        }
    }
}