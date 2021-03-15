function handler () {
  EVENT_DATA=$1
  echo "$EVENT_DATA" 1>&2;

  RESPONSE="$(./main.sh)"
  
  # send to cloudwatch logs
  echo "$RESPONSE" 1>&2;
}

function onEvent() {
  EVENT_DATA=$1
  echo "$EVENT_DATA" 1>&2;
  requestType=$(getRequestType $1)
  if [ $requestType == 'Create' ]; then
    onCreate
  elif [ $requestType == 'Update' ]; then
    onUpdate
  elif [ $requestType == 'Delete' ]; then
    onDelete
  else
    true
  fi
}

function onCreate() {
  invokeLambda 
}

function onUpdate() { 
  invokeLambda
}
function onDelete() { 
  return 
}

function invokeLambda() {
  aws lambda invoke --function-name ${LAMBDA_FUNCTION_ARN} /dev/stdout
}

function getRequestType() {
  echo $1 | jq -r .RequestType
}
