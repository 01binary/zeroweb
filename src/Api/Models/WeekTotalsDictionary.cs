/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines a sorted WeekSummary dictionary.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace ZeroWeb.Api.Models
{
    /// <summary>
    /// The week summary dictionary with custom formatting.
    /// </summary>
    [JsonConverter(typeof(WeekDictionaryConverter))]
    public class WeekTotalsDictionary: Dictionary<DateTime, int>
    {
    }
}