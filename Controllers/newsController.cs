/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  News server-side controller.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using Microsoft.AspNetCore.Mvc;

namespace ZeroWeb.Controllers
{
    /// <summary>
    /// News controller.
    /// </summary>
    public class NewsController : Controller
    {
        /// <summary>
        /// Default action.
        /// </summary>
        public IActionResult Index()
        {
            return View();
        }
    }
}
