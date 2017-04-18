/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines a sorted Month Summary dictionary.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace ZeroWeb.Api.Models
{
    /// <summary>
    /// The Month Summary dictionary with custom formatting.
    /// </summary>
    [JsonConverter(typeof(MonthDictionaryConverter))]
    public class MonthDictionary: Dictionary<DateTime, MonthSummary>
    {
    }
}