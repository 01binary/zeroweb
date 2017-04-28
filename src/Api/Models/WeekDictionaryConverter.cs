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
using System.Linq;
using Newtonsoft.Json;
using ZeroWeb.Api.Models;

namespace ZeroWeb
{
    /// <summary>
    /// Serialize Week Summary dictionary to JSON.
    /// </summary>
    [JsonConverter(typeof(WeekDictionaryConverter))]
    public class WeekDictionaryConverter: JsonConverter
    {
        /// <summary>
        /// Week entry format.
        /// </summary>
        private const string WeekFormat = "MMM d";

        /// <summary>
        /// Determine whether the converter can convert an object type.
        /// </summary>
        /// <param name="objectType">The object type.</param>
        /// <returns>Whether the convert can convert an object type.</returns>
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(WeekDictionary) || objectType == typeof(WeekTotalsDictionary);
        }

        /// <summary>
        /// Deserialize an object.
        /// </summary>
        /// <param name="reader">The Json reader.</param>
        /// <param name="objectType">The object type.</param>
        /// <param name="existingValue">The value to deserialize.</param>
        /// <param name="serializer">The Json serializer.</param>
        /// <returns>The deserialized object.</returns>
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Serialize an object.
        /// </summary>
        /// <param name="reader">The Json writer.</param>
        /// <param name="existingValue">The value to serialize.</param>
        /// <param name="serializer">The Json serializer.</param>
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            WeekDictionary summarySource = null;
            WeekTotalsDictionary totalsSource = null;
            writer.WriteStartObject();

            if ((summarySource = value as WeekDictionary) != null)
            {
                // Write a sorted dictionary of week summaries.
                foreach (DateTime weekKey in summarySource.Keys.OrderByDescending(key => key))
                {
                    // Key each week by start and end days.
                    writer.WritePropertyName(GetMonthWeekName(weekKey));

                    // Write the week summary.
                    serializer.Serialize(writer, summarySource[weekKey]);
                }
            }
            else if ((totalsSource = value as WeekTotalsDictionary) != null)
            {
                // Write a sorted dictionary of tag summaries.
                foreach (DateTime weekKey in totalsSource.Keys.OrderByDescending(key => key))
                {
                    // Key each week by start and end days.
                    writer.WritePropertyName(GetMonthWeekName(weekKey));

                    // Write the week summary.
                    writer.WriteValue(totalsSource[weekKey]);
                }
            }

            writer.WriteEndObject();
        }

        /// <summary>
        /// Get the week name given first day of the week.
        /// </summary>
        /// <param name="firstDayOfWeek">The first day of the week.</param>
        /// <returns>The week name.</returns>
        private static string GetMonthWeekName(DateTime firstDayOfWeek)
        {
            DateTime lastDayOfWeek = firstDayOfWeek.AddDays(7);
            return string.Format("{0} - {1}",
                firstDayOfWeek.ToString(WeekFormat),
                lastDayOfWeek.ToString(WeekFormat))
                .ToLower();
        }
    }
}