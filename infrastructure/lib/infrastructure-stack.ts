import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayIntegrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket to host the static website
    const websiteBucket = new s3.Bucket(this, 'HotCueBucket'  , {
      websiteIndexDocument: 'index.html',
      bucketName: 'hotcue-sounds-website',
      publicReadAccess: false, 
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Switch to retain if its need to be preserved
      autoDeleteObjects: true, // Automatically delete objects when the bucket is destroyed
    });

    // Lambda Function to handle backend logic
    const apiFunction = new lambda.Function(this, 'ApiFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          return {
            statusCode: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
              message: "Hello from HotCue API!",
              path: event.rawPath,
              timeStamp: new Date().toISOString()
            }),
          };
        };
      `),
    timeout: cdk.Duration.seconds(30),
    memorySize: 512,  
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
        origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket), // Fetch from this bucket if not cached
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
