import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for static assets only (private, accessed via CloudFront OAC)
    const assetsBucket = new s3.Bucket(this, 'HotCueAssetsBucket', {
      bucketName: 'hotcue-sounds-assets',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // AWS Secrets Manager - Store Shopify API credentials securely
    const shopifySecret = new secretsmanager.Secret(this, 'ShopifyCredentials', {
      secretName: 'hotcue-sounds/shopify-credentials',
      description: 'Shopify Storefront API credentials for HotCue Sounds',
      secretObjectValue: {
        NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: cdk.SecretValue.unsafePlainText('PLACEHOLDER'),
        NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: cdk.SecretValue.unsafePlainText('PLACEHOLDER'),
      },
    });

    // Lambda Function to handle SSR (Server-Side Rendering)
    const ssrFunction = new lambda.Function(this, 'SSRFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../.open-next/server-functions/default'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      environment: {
        NODE_ENV: 'production',
        // Shopify credentials retrieved from Secrets Manager
        NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: shopifySecret.secretValueFromJson('NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN').unsafeUnwrap(),
        NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: shopifySecret.secretValueFromJson('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN').unsafeUnwrap(),
      },
    });

    // Grant Lambda function read access to the Shopify credentials secret
    shopifySecret.grantRead(ssrFunction);

    // Lambda Function for Image Optimization (Next.js Image component)
    const imageOptFunction = new lambda.Function(this, 'ImageOptimizationFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../.open-next/image-optimization-function'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      environment: {
        NODE_ENV: 'production',
      },
    });

    // Create Lambda Function URL for image optimization
    const imageOptUrl = imageOptFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ['*'],
      },
    });

    // Extract hostname from image optimization Function URL
    const imageOptHostname = cdk.Fn.select(2, cdk.Fn.split('/', imageOptUrl.url));

    // Create Lambda Function URL for CloudFront to access the SSR handler
    const functionUrl = ssrFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ['*'],
      },
    });

    // Extract hostname from Function URL for CloudFront origin
    const functionUrlHostname = cdk.Fn.select(2, cdk.Fn.split('/', functionUrl.url));

    // Custom Cache Policy for Image Optimization - includes query strings in cache key
    const imageOptCachePolicy = new cloudfront.CachePolicy(this, 'ImageOptCachePolicy', {
      cachePolicyName: 'HotCueImageOptimizationPolicy',
      comment: 'Cache policy for Next.js image optimization with query string parameters',
      defaultTtl: cdk.Duration.days(1),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.seconds(0),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(), // Include ALL query strings in cache key
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    });

    // CloudFront Distribution - Routes requests to Lambda (SSR) or S3 (static assets)
    const distribution = new cloudfront.Distribution(this, 'HotCueDistribution', {
      // Default behavior: ALL requests go to Lambda for server-side rendering
      defaultBehavior: {
        origin: new origins.HttpOrigin(functionUrlHostname, {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED, // Don't cache SSR pages
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      },
      // Static assets behaviors: Route to S3 for caching
      additionalBehaviors: {
        '_next/image': {
          origin: new origins.HttpOrigin(imageOptHostname, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: imageOptCachePolicy, // Use custom cache policy with query string support
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
        '_next/*': {
          origin: origins.S3BucketOrigin.withOriginAccessControl(assetsBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        'favicon.ico': {
          origin: origins.S3BucketOrigin.withOriginAccessControl(assetsBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        'images/*': {
          origin: origins.S3BucketOrigin.withOriginAccessControl(assetsBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        'BUILD_ID': {
          origin: origins.S3BucketOrigin.withOriginAccessControl(assetsBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
      },
    });

    // Deploy static assets to S3
    new s3deploy.BucketDeployment(this, 'DeployStaticAssets', {
      sources: [
        s3deploy.Source.asset('../.open-next/assets'), // OpenNext static files
      ],
      destinationBucket: assetsBucket,
      distribution: distribution,
      distributionPaths: ['/_next/*', '/favicon.ico', '/images/*', '/BUILD_ID'],
    });

    // Outputs - Shows URLs after deployment
    new cdk.CfnOutput(this, 'DistributionUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront URL',
    });

    new cdk.CfnOutput(this, 'AssetsBucketName', {
      value: assetsBucket.bucketName,
      description: 'S3 Assets Bucket Name',
    });

    new cdk.CfnOutput(this, 'SSRFunctionUrl', {
      value: functionUrl.url,
      description: 'Lambda Function URL (SSR Handler)',
    });

    new cdk.CfnOutput(this, 'ShopifySecretArn', {
      value: shopifySecret.secretArn,
      description: 'Shopify Credentials Secret ARN (update values in AWS Console)',
    });

    new cdk.CfnOutput(this, 'ImageOptFunctionUrl', {
      value: imageOptUrl.url,
      description: 'Image Optimization Function URL',
    });

  }
}
