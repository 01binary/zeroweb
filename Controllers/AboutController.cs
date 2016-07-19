/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  About server-side controller.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using Microsoft.AspNetCore.Mvc;

namespace ZeroWeb.Controllers
{
    /// <summary>
    /// About controller.
    /// </summary>
    public class AboutController : Controller
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
