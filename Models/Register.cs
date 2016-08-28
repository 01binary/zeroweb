/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines a user registration request.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Models
{
    public class Register
    {
        /// <summary>
        /// Gets or sets the external login provider.
        /// </summary>
        public string Provider { get; set; }

        /// <summary>
        /// Gets or sets the external login provider key.
        /// </summary>
        public string ProviderKey { get; set; }

        /// <summary>
        /// Gets or sets the application user name.
        /// </summary>
        public string Name { get; set; }
    }
}