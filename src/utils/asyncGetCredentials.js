import AWS from 'aws-sdk/global';

const IDENTITY_POOL_ID = process.env.IDENTITY_POOL_ID;

export default function asyncGetCredentials(clearCache = false) {
  return new Promise((resolve, reject) => {
    // !! Don't put an empty object for "Logins" -> the prop is test is exist not empty
    // -> if "Logins" = {} -> cognitoIdentityCredentials can't load from cache
    let cognitoIdentityConf = {
      IdentityPoolId: IDENTITY_POOL_ID
    };
    // if (session)
    //   cognitoIdentityConf.Logins[USER_POOL_ID] = session.getIdToken().getJwtToken()

    // Allways create a new object => the store will not trigger the change in the app if not
    let cognitoIdentityCredentials = new AWS.CognitoIdentityCredentials(
      cognitoIdentityConf,
      { region: 'eu-west-1' }
    );

    if (clearCache) cognitoIdentityCredentials.clearCachedId();

    cognitoIdentityCredentials.get(err => {
      if (err) {
        reject(err);
        return;
      }
      /* .get mutate credentials object
       * .get is able to refresh if credentials are expired
       * see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Credentials.html#get-property
       */
      resolve(cognitoIdentityCredentials);
    });
  });
}
