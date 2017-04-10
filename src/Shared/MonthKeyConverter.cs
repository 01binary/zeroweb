/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Contribution summary month converter.
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
    /// Serialize IDictionary<DateTime, MonthSummary> to JSON.
    /// </summary>
    public class MonthKeyConverter: JsonConverter
    {
        protected abstract IDictionary<DateTime, MonthSummary> Create(Type objectType, KObject obj)
        {
            throw new NotImplementedException();
        }

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
            IDictionary<DateTime, MonthSummary> source = value as IDictionary<DateTime, MonthSummary>;

            if (source == null)
            {
                serializer.Serialize(writer, null);
                return;
            }

            writer.WriteStartObject();

            // Sort months from most to least recent.
            foreach (DateTime monthKey in source.Keys.OrderByDescending(key => key))
            {
                // Key each month summary by month name (mmm).
                writer.WritePropertyName(monthKey.ToString("mmm"));

                // Write the month summary.
                serializer.Serialize(writer, source[monthKey]);
            }

            writer.WriteEndObject();
        }
    }
}