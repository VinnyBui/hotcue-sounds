import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayIntegrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket to host the static website
    const websiteBucket = new s3.Bucket(this, 'HotCueBucket'  , {
      websiteIndexDocument: 'index.html',
      bucketName: 'hotcue-sounds-website',
      publicReadAccess: true, 
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Switch to retain if its need to be preserved
      autoDeleteObjects: true, // Automatically delete objects when the bucket is destroyed
    });


    // Lambda Function to handle backend logic
    const apiFunction = new lambda.Function(this, 'ApiFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../.open-next/server-functions/default'), // Path to Lambda function code
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      environment: {
        NODE_ENV: 'production',
        // Add your Shopify credentials here:
        SHOPIFY_STOREFRONT_ACCESS_TOKEN: '',
        SHOPIFY_STORE_DOMAIN: '',
      },  
    });

    // API Gateway to expose the Lambda function
    const httpApi = new apigateway.HttpApi(this, 'HttpApi', {
      apiName: 'HotCueApi',
      description: 'API for HotCue Sounds',
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [
          apigateway.CorsHttpMethod.GET,
          apigateway.CorsHttpMethod.POST,
          apigateway.CorsHttpMethod.PUT,
          apigateway.CorsHttpMethod.DELETE,
          apigateway.CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ['*'],
      },
    });  

    // Connect API Gateway to Lambda
    httpApi.addRoutes({
      path: '/api/{proxy+}',  // Matches /api/anything
      methods: [apigateway.HttpMethod.ANY],
      integration: new apigatewayIntegrations.HttpLambdaIntegration(
        'ApiIntegration',
        apiFunction
      ),
    });
    
    // CloudFront Distribution to serve the website (Content Delivery Network)
    const distribution = new cloudfront.Distribution(this, 'HotCueDistribution', {
      defaultBehavior: {
        origin: new origins.S3StaticWebsiteOrigin(websiteBucket), // Fetch from this bucket if not cached
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, // Force HTTPS connections
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED, // cached for 24 hours
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.HttpOrigin(`${httpApi.apiId}.execute-api.${this.region}.amazonaws.com`,),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED, // Do not cache API responses
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        },
      },  
      defaultRootObject: 'index.html',
    });

    // 5. DEPLOY STATIC ASSETS TO S3
    new s3deploy.BucketDeployment(this, 'DeployStaticAssets', {
      sources: [
        s3deploy.Source.asset('../.open-next/assets'),  // Static files
        s3deploy.Source.asset('../public'),              // Public folder
      ],
      destinationBucket: websiteBucket,
      distribution: distribution,
      distributionPaths: ['/*'], // Invalidate CloudFront cache
    });

    // Outputs - Shows URLs after deployment
    new cdk.CfnOutput(this, 'DistributionUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront URL',
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: websiteBucket.bucketName,
      description: 'S3 Bucket Name',
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: httpApi.url || 'API URL not available',
      description: 'API Gateway URL',
    });

  }
}
