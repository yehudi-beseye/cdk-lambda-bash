# cdk-lambda-bash

Deploy Lambda container image with Bash script support in AWS CDK

# Why

AWS Lambda has the [docker container image support](https://aws.amazon.com/tw/blogs/aws/new-for-aws-lambda-container-image-support/) since AWS re:Invent 2020 which allows you to run your Lambda code in a custom container image. Inspired by [nikovirtala/cdk-eks-experiment](https://github.com/nikovirtala/cdk-eks-experiment/), `cdk-lambda-bash` allows you to specify a local shell script and bundle it up as a custom resource in your cdk stack. On cdk deployment, your shell script will be executed in a Lambda container environment.


# BashExecFunction

At this moment, we are offering `BashExecFunction` construct class which is a high-level abstraction of `lambda.Function`. By defining the `script` property which poins to your local shell script, on `cdk deploy`, this script will be bundled into a custom docker image and published as a `lambda.DockerImageFunction`.

If you `fn.run()`, a custom resource will be created and the `lambda.DockerImageFunction` will be executed on deployment.


# Sample

```ts
const app = new cdk.App();

const stack = new cdk.Stack(app, 'my-stack');

// bundle your Lambda function to execute the local demo.sh in container
const fn = new BashExecFunction(stack, 'Demo', {
  script: path.join(__dirname, '../demo.sh'),
})

// run it as custom resource on deployment
fn.run();

```
