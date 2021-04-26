aws cloudformation package \
    --template-file template.yaml \
    --output-template-file serverless-output.yaml \
    --s3-bucket zeroweb-api
