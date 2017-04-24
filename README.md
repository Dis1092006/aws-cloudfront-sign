## About this fork
This repository is a fork of [this repo](https://github.com/jasonsims/aws-cloudfront-sign).
I decided to fork that because I needed use of the module under Node.js 0.8.

## Usage
### Requirements
* Node.js >=0.8.0
* Active CloudFront distribution with origin configured

### Configuring CloudFront
1. Create a CloudFront distribution
2. Configure your origin with the following settings:

   **Origin Domain Name:** {your-s3-bucket}  
   **Restrict Bucket Access:** Yes  
   **Grant Read Permissions on Bucket:** Yes, Update Bucket Policy  
3. Create CloudFront Key Pair. [more info][cf_keypair_docs]

### Installing
```sh
npm install aws-cloudfront-sign-node_0.8
```

### API
#### getSignedUrl(url, options)
* `@param {String} url` - Cloudfront URL to sign
* `@param {Object} options` - URL signature [options](#options)
* `@return {String} signedUrl` - Signed CloudFrontUrl

#### getSignedRTMPUrl(domainName, s3key, options)
* `@param {String} domainName` - Domain name of your Cloudfront distribution
* `@param {String} s3key` - Path to s3 object
* `@param {Object} options` - URL signature [options](#options)
* `@return {Object} url.rtmpServerPath` - RTMP formatted server path
* `@return {Object} url.rtmpStreamName` - Signed RTMP formatted stream name

#### getSignedCookies(url, options)
* `@param {String} url` - Cloudfront URL to sign
* `@param {Object} options` - URL signature [options](#options)
* `@return {Object} cookies` - Signed AWS cookies

### Options
* `expireTime` (**Optional** - Default: 1800 sec == 30 min) - The time when the URL should expire. Accepted values are
   * number - Time in milliseconds (`new Date().getTime() + 1800000`)
   * moment - Valid [momentjs][moment_docs] object (`moment().add(1, 'day')`)
   * Date - Javascript Date object (`new Date(2016, 0, 1)`)
* `ipRange` (**Optional**) - IP address range allowed to make GET requests
  for your signed URL. This value must be given in standard IPv4 CIDR format
  (for example, 10.52.176.0/24).
* `keypairId` - The access key ID from your Cloudfront keypair
* `privateKeyString` || `privateKeyPath` - The private key from your Cloudfront
   keypair. It can be provided as either a string or a path to the .pem file.
  **Note:** When providing the private key as a string, ensure that the newline
  character is also included.

  ```js
  var privateKeyString =
    '-----BEGIN RSA PRIVATE KEY-----\n'
    'MIIJKAIBAAKCAgEAwGPMqEvxPYQIffDimM9t3A7Z4aBFAUvLiITzmHRc4UPwryJp\n'
    'EVi3C0sQQKBHlq2IOwrmqNiAk31/uh4FnrRR1mtQm4x4IID58cFAhKkKI/09+j1h\n'
    'tuf/gLRcOgAXH9o3J5zWjs/y8eWTKtdWv6hWRxuuVwugciNckxwZVV0KewO02wJz\n'
    'jBfDw9B5ghxKP95t7/B2AgRUMj+r47zErFwo3OKW0egDUpV+eoNSBylXPXXYKvsL\n'
    'AlznRi9xNafFGy9tmh70pwlGG5mVHswD/96eUSuLOZ2srcNvd1UVmjtHL7P9/z4B\n'
    'KdODlpb5Vx+54+Fa19vpgXEtHgfAgGW9DjlZMtl4wYTqyGAoa+SLuehjAQsxT8M1\n'
    'BXqfMJwE7D9XHjxkqCvd93UGgP+Yxe6H+HczJeA05dFLzC87qdM45R5c74k=\n'
    '-----END RSA PRIVATE KEY-----'
  ```
  Also, here are some examples if prefer to store your private key as a string
  but within an environment variable.
  ```sh
  # Local env example
  CF_PRIVATE_KEY="$(cat your-private-key.pem)"

  # Heroku env
  heroku config:set CF_PRIVATE_KEY="$(cat your-private-key.pem)"  
  ```

## Examples
### Creating a signed URL
By default the URL will expire after half an hour.
```js
var cf = require('aws-cloudfront-sign')
var options = {keypairId: 'APKAJM2FEVTI7BNPCY4A', privateKeyPath: '/foo/bar'}
var signedUrl = cf.getSignedUrl('http://xxxxxxx.cloudfront.net/path/to/s3/object', options);
console.log('Signed URL: ' + signedUrl);
```

### Creating a signed RTMP URL
```js
var cf = require('aws-cloudfront-sign')
var options = {keypairId: 'APKAJM2FEVTI7BNPCY4A', privateKeyPath: '/foo/bar'}
var signedRTMPUrlObj = cf.getSignedRTMPUrl('xxxxxxx.cloudfront.net', '/path/to/s3/object', options);
console.log('RTMP Server Path: ' + signedRTMPUrlObj.rtmpServerPath);
console.log('Signed Stream Name: ' + signedRTMPUrlObj.rtmpStreamName);
```

### Creating signed cookies
```js
var cf = require('aws-cloudfront-sign')
var options = {keypairId: 'APKAJM2FEVTI7BNPCY4A', privateKeyPath: '/foo/bar'}
var signedCookies = cf.getSignedCookies('http://xxxxxxx.cloudfront.net/*', options);

// You can now set cookies in your response header. For example:
for(var cookieId in signedCookies) {
 res.cookie(cookieId, signedCookies[cookieId]);
}
```

[moment_docs]: http://momentjs.com/docs
[cf_keypair_docs]: http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html#private-content-creating-cloudfront-key-pairs
