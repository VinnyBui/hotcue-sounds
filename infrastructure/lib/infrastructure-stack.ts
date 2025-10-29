import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';


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

    // CloudFront Distribution to serve the website (Content Delivery Network)
    const distribution = new cloudfront.Distribution(this, 'HotCueDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket), // Fetch from this bucket if not cached
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, // Force HTTPS connections
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED, // cached for 24 hours
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

  }
}
