/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Users API.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ZeroWeb.Models;

namespace ZeroWeb.API
{
    /// <summary>
    /// Users API.
    /// </summary>
    [Route("services/users")]
    public class UsersService: Controller
    {
        /// <summary>
        /// The view to display on successful login.
        /// </summary>
        private static readonly string Failure = "LoginFailure";

        /// <summary>
        /// The view to display on a failed login.
        /// </summary>
        private static readonly string Success = "LoginSuccess";

        /// <summary>
        /// The application user manager.
        /// </summary>
        private readonly UserManager<User> userManager;

        /// <summary>
        /// The application sign-in manager.
        /// </summary>
        private readonly SignInManager<User> signInManager;

        /// <summary>
        /// Initializes a new instance of the <see cref="UsersService"/> class.
        /// </summary>
        /// <param name="userManager">The user manager.</param>
        /// <param name="signInManager">The sign-in manager.</param>
        public UsersService(UserManager<User> userManager,
                            SignInManager<User> signInManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        /// <summary>
        /// Gets the current user name.
        /// </summary>
        [HttpGet("current")]
        public IActionResult GetName()
        {
            string userName = null;

            if (this.HttpContext.User != null)
            {
                userName = this.HttpContext.User.Identity.Name;
            }

            return this.Json(new { name = userName });
        }

        /// <summary>
        /// Initiates login with an external provider.
        /// </summary>
        /// <param name="provider">The external login provider.</param>
        [HttpGet("login/{provider}")]
        public async System.Threading.Tasks.Task<IActionResult> Login(string provider)
        {
            // When already signed in with external provider, continue to Register.
            // https://github.com/aspnet/Identity/issues/915
            var info = await this.signInManager.GetExternalLoginInfoAsync();

            if (info != null)
            {
                return this.Redirect("~/services/users/callback?interrupted=true");
            }

            // Request a redirect to the external login provider.
            var properties = this.signInManager.ConfigureExternalAuthenticationProperties(
                provider,
                "services/users/callback");

            return this.Challenge(properties, provider);
        }

        /// <summary>
        /// Completes login with an external provider.
        /// </summary>
        [HttpGet("callback")]
        public async System.Threading.Tasks.Task<IActionResult> LoginCallback([FromQuery]string interrupted)
        {
            var info = await this.signInManager.GetExternalLoginInfoAsync();

            if (info == null)
            {
                return this.View(Failure);
            }

            // Sign in user if registered.
            ViewBag.Provider = info.LoginProvider;
            ViewBag.Name = info.Principal.Identity.Name.Split(' ')[0];
            ViewBag.Interrupted = interrupted ?? "false";

            var result = await this.signInManager.ExternalLoginSignInAsync(
                info.LoginProvider,
                info.ProviderKey,
                false);

            if (result.Succeeded)
            {
                return this.View(Success);
            }

            // Prompt for name to register with.
            return this.View("Register");
        }

        /// <summary>
        /// Revokes authentication for the current user.
        /// </summary>
        [HttpPost("signout")]
        public async System.Threading.Tasks.Task<IActionResult> SignOut()
        {
            if (this.HttpContext.User.Identity.Name != null)
            {
                await this.signInManager.SignOutAsync();
                return this.Ok();
            }

            return this.BadRequest();
        }

        /// <summary>
        /// Registers a new application user and associates with external login.
        /// </summary>
        /// <param name="name">The new user name.</param>
        [HttpPost("register")]
        [ValidateAntiForgeryToken]
        public async System.Threading.Tasks.Task<IActionResult> Register(string name)
        {
            try
            {
                var info = await this.signInManager.GetExternalLoginInfoAsync();

                if (info == null)
                {
                    return this.View(Failure);
                }

                var user = new User { UserName = name };
                var createUser = await this.userManager.CreateAsync(user);

                if (createUser.Succeeded)
                {
                    var addLogin = await this.userManager.AddLoginAsync(user, info);

                    if (addLogin.Succeeded)
                    {
                        await this.signInManager.SignInAsync(user, isPersistent: false);

                        ViewBag.Name = name;
                        
                        return this.View(Success);
                    }
                }
            }
            catch
            {
            }

            return this.View(Failure);
        }
    }
}