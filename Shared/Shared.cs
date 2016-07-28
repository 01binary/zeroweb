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

namespace ZeroWeb
{
    /// <summary>
    /// Shared functionality.
    /// </summary>
    public static class Shared
    {
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
                    DateTime weekStart = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + 1);
                    DateTime weekEnd = weekStart.AddDays(7);

                    if (date >= weekStart && date <= weekEnd)
                    {
                        if (date.Date == DateTime.Today)
                        {
                            // Today but different time.
                            return date.ToString("h:MM tt") + " today";
                        }
                        else
                        {
                            // Another day this week.
                            return date.ToString("ddd").ToLower() + " at " + date.ToString("h:MM tt");
                        }
                    }
                }

                // This month or this year.
                return date.ToString("mm/dd h:MM tt");
            }
            else
            {
                // Display the full date.
                return date.ToString("mm/dd/yy h:MM tt");
            }
        }
    }
}