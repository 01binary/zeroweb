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
using Microsoft.AspNetCore.Http;

namespace ZeroWeb
{
    /// <summary>
    /// Shared functionality.
    /// </summary>
    public static class Shared
    {
        /// <summary>
        /// Get the application settings file path.
        /// </summary>
        public static string GetAppSettingsPath()
        {
            return Path.Combine(
                Directory.GetCurrentDirectory(),
                "Properties/appsettings.json");
        }

        /// <summary>
        /// Format a title to enforce content transformation policy.
        /// </summary>
        /// <param name="title">The title to format.</param>
        /// <returns>The formatted title.</returns>
        public static string FormatTitle(string title)
        {
            return title.ToLower();
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
    }
}