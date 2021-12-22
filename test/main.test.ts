import * as path from 'path';
import {
  App, Stack,
  aws_iam as iam,
  aws_s3 as s3,
} from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { BashExecFunction } from '../src';
import { IntegTesting } from '../src/integ.default';

test('integ snapshot validation', () => {
  const integ = new IntegTesting();
  integ.stack.forEach(stack => {
    const t = Template.fromStack(stack);
    expect(t).toMatchSnapshot();
  });
});


test('re-execution on assets update', () => {
  const app = new App();
  const stack = new Stack(app, 'test-stack');
  new BashExecFunction(stack, 'Demo', {
    script: path.join(__dirname, '../demo.sh'),
  }).run({ runOnUpdate: true });
  const t = Template.fromStack(stack);
  t.hasResourceProperties('Custom::RunLambdaBash', {
    assetHash: '9ddb8373fd34c96b5b86bd0d72e8fc9e3642733fbb4bf6d84f5c12461a9c71aa',
  });
});

test('run should return custom resource', () => {
  const app = new App();
  const stack = new Stack(app, 'test-stack');
  const fn = new BashExecFunction(stack, 'Demo', {
    script: path.join(__dirname, '../demo.sh'),
  });
  const cr = fn.run({ runOnUpdate: true });
  const bucket = new s3.Bucket(stack, 'Bucket');
  const t = Template.fromStack(stack);
  cr.node.addDependency(bucket);
  t.resourceCountIs('Custom::RunLambdaBash', 1);
  // to-fix: to check the dependency with cdk-assertions
  // t.hasResource('Custom::RunLambdaBash', {
  //       DependsOn: ['Bucket83908E77'],
  // })
});

test('custom lambda execution role', () => {
  const app = new App();
  const stack = new Stack(app, 'test-stack');
  const customRole = new iam.Role(stack, 'Role', {
    roleName: 'customRole',
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });
  new BashExecFunction(stack, 'Demo', {
    script: path.join(__dirname, '../demo.sh'),
    role: customRole,
  });
  const t = Template.fromStack(stack);
  t.hasResourceProperties('AWS::Lambda::Function', {
    Role: {
      'Fn::GetAtt': [
        'Role1ABCC5F0',
        'Arn',
      ],
    },
  });
});
