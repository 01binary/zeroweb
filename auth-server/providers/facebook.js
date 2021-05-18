const axios = require('axios');

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

exports.validateFacebookToken = async (token) => (
  new Promise((resolve, reject) => {
    axios
      .get('https://graph.facebook.com/debug_token', {
        params: {
          input_token: token,
          access_token: `${FACEBOOK_CLIENT_ID}|${FACEBOOK_CLIENT_SECRET}`,
        },
      })
      .then(({ data: { data: { is_valid, user_id, error }}}) => {
        if (is_valid === false && error) {
          console.error('invalid facebook token', token, error.message);
        }

        resolve({ id: user_id, valid: is_valid });
      })
      .catch((error) => {
        console.error('validateFacebookToken failed with', error);
        reject(error);
      })
  })
);
