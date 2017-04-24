/**
 * Type definitions for aws-cloudfront-sign-node-0_8.
 */

interface SignatureParameters {
    privateKeyString?: string;
    privateKeyPath?: string;
    expireTime?: number;
    ipRange?: string;
    keypairId?: string;
}

interface RtmpServer {
    rtmpServerPath: string;
    rtmpStreamName: string;
}

interface SignedCookies {
    'CloudFront-Policy': string;
    'CloudFront-Signature': string;
    'CloudFront-Key-Pair-Id': string;
}

interface AwsCloudfrontSign {
    getSignedCookies(cfUrl: string, params: SignatureParameters): SignedCookies;
    getSignedUrl(cfUrl: string, params: SignatureParameters): string;
    getSignedRTMPUrl(domainName: string, s3Key: string, params: SignatureParameters): RtmpServer;
    // NOTE: commented out by developers.
    // normalizeBase64(str: string): string;
}

declare module 'aws-cloudfront-sign-node-0_8' {
    var awsCloudfrontSign: AwsCloudfrontSign;
    export = awsCloudfrontSign;
}