aws cloudformation deploy \
    --template-file serverless-output.yaml \
    --stack-name zeroweb-api \
    --capabilities CAPABILITY_IAM