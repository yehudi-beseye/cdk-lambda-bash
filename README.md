# cdk-lambda-bash

Deploy Lambda container image with Bash script support in AWS CDK


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
