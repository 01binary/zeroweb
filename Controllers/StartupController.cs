/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Startup server-side controller.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using Microsoft.AspNetCore.Mvc;

namespace ZeroWeb.Controllers
{
    /// <summary>
    /// Main controller.
    /// </summary>
    public class StartupController : Controller
    {
        /// <summary>
        /// Default action.
        /// </summary>
        public IActionResult Index()
        {
            return View("~/Views/Layout.cshtml");
        }
    }
}
