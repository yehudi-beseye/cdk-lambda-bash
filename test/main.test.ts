import '@aws-cdk/assert/jest';
import * as path from 'path';
import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { BashExecFunction } from '../src';
import { IntegTesting } from '../src/integ.default';

test('integ snapshot validation', () => {
  const integ = new IntegTesting();
  integ.stack.forEach(stack => {
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});


test('re-execution on assets update', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'test-stack');
  new BashExecFunction(stack, 'Demo', {
    script: path.join(__dirname, '../demo.sh'),
  }).run({ runOnUpdate: true });
  expect(stack).toHaveResourceLike('AWS::CloudFormation::CustomResource', {
    assetHash: 'ad25580395760d7a779725647e9844b96c1c4408dc877f21856a14a99a976784',
  });
});
