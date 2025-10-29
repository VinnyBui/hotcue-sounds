import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

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


    // Lambda Function to handle SSR (Server-Side Rendering)
    const ssrFunction = new lambda.Function(this, 'SSRFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../.open-next/server-functions/default'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      environment: {
        NODE_ENV: 'production',
        // TODO: Add your Shopify credentials here before deploying:
        // NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: 'your-token-here',
        // NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: 'hotcue-sounds.myshopify.com',
      },
    });

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

  }
}
