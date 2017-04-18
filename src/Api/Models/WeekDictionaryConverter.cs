/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Contribution summary week converter.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using ZeroWeb.Api.Models;

namespace ZeroWeb
{
    /// <summary>
    /// Serialize IDictionary<DateTime, WeekSummary> to JSON.
    /// </summary>
    [JsonConverter(typeof(WeekDictionaryConverter))]
    public class WeekDictionaryConverter: JsonConverter
    {
        /// <summary>
        /// Week entry format.
        /// </summary>
        private const string WeekFormat = "MMM d";

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(IDictionary<DateTime, WeekSummary>);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var summarySource = value as WeekDictionary;
            writer.WriteStartObject();

            if (summarySource != null)
            {
                // Sort weeks from most to least recent.
                foreach (DateTime weekKey in summarySource.Keys.OrderByDescending(key => key))
                {
                    // Key each week by start and end days.
                    writer.WritePropertyName(GetMonthWeekName(weekKey));

                    // Write the week summary.
                    serializer.Serialize(writer, summarySource[weekKey]);
                }
            }
            else
            {
                var totalsSource = value as WeekTotalsDictionary;

                if (totalsSource != null)
                {
                    foreach (DateTime weekKey in totalsSource.Keys.OrderByDescending(key => key))
                    {
                        // Key each week by start and end days.
                        writer.WritePropertyName(GetMonthWeekName(weekKey));

                        // Write the week summary.
                        writer.WriteValue(totalsSource[weekKey]);
                    }
                }
            }

            writer.WriteEndObject();
        }

        private static string GetMonthWeekName(DateTime date)
        {
            return string.Format("{0} - {1}",
                date.ToString(WeekFormat),
                GetEndOfWeek(date).ToString(WeekFormat))
                .ToLower();
        }

        private static DateTime GetEndOfWeek(DateTime date)
        {
            return date.AddDays(6 - (int)date.DayOfWeek);
        }
    }
}