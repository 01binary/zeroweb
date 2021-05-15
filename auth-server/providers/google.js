const axios = require('axios');

exports.validateGoogleToken = async (access_token) => (
  new Promise((resolve, reject) => {
    axios
      .get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
        params: {
          access_token,
        },
      })
      .then(({ data: { user_id, error, error_description }}) => {
        if (!user_id && error) {
          console.error('invalid google token', access_token, error_description);
          resolve({ valid: false });
        } else {
          resolve({ id: user_id, valid: true });
        }
      })
      .catch((error) => {
        console.error('validateFacebookToken failed with', error);
        reject(error);
      });
    }
  )
);
