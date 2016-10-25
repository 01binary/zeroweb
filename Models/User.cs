/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines a tag taxonomy model.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Application user.
    /// </summary>
    public class User : IdentityUser
    {
        // TODO: link to a single Tag.
    }
}