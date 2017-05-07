/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines a sorted Week Summary dictionary.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace ZeroWeb.Api.Models
{
    /// <summary>
    /// The Week Summary dictionary with custom formatting.
    /// </summary>
    [JsonConverter(typeof(WeekDictionaryConverter))]
    public class WeekDictionary: Dictionary<DateTime, WeekSummary>
    {
    }
}