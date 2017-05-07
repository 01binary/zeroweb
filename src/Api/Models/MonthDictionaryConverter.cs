/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Month summary Json converter.
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
    /// Serialize the Month Summary dictionary to Json.
    /// </summary>
    [JsonConverter(typeof(MonthDictionaryConverter))]
    public class MonthDictionaryConverter: JsonConverter
    {
        /// <summary>
        /// Month entry format.
        /// </summary>
        private const string MonthFormat = "MMM";

        /// <summary>
        /// Determine whether the converter can convert an object type.
        /// </summary>
        /// <param name="objectType">The object type.</param>
        /// <returns>Whether the convert can convert an object type.</returns>
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(IDictionary<DateTime, MonthSummary>);
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
            var source = value as MonthDictionary;
            writer.WriteStartObject();

            if (source != null)
            {
                // Sort months from most to least recent.
                foreach (DateTime monthKey in source.Keys.OrderByDescending(key => key))
                {
                    // Key each month summary by month name.
                    writer.WritePropertyName(monthKey.ToString(MonthFormat).ToLower());

                    // Write the month summary.
                    serializer.Serialize(writer, source[monthKey]);
                }
            }

            writer.WriteEndObject();
        }
    }
}