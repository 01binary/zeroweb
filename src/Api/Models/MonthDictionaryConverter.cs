/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Contribution summary Json converter.
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
    /// Serialize MonthDictionary to Json.
    /// </summary>
    [JsonConverter(typeof(MonthDictionaryConverter))]
    public class MonthDictionaryConverter: JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(IDictionary<DateTime, MonthSummary>);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var source = value as MonthDictionary;
            writer.WriteStartObject();

            if (source != null)
            {
                // Sort months from most to least recent.
                foreach (DateTime monthKey in source.Keys.OrderByDescending(key => key))
                {
                    // Key each month summary by month name (MMM).
                    writer.WritePropertyName(monthKey.ToString("MMM").ToLower());

                    // Write the month summary.
                    serializer.Serialize(writer, source[monthKey]);
                }
            }

            writer.WriteEndObject();
        }
    }
}