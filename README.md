# Morbotron Slack bot

> "I'll always remember you, Fry-- memory deleted."

## Local development

1. `vagrant up`
1. `vagrant rsync-auto &`
1. `vagrant ssh`
1. `cd /vagrant`
1. `npm install`
1. `npm test`

## Deploying

Follow these steps to configure the slash command in Slack:

1. Navigate to https://<your-team-domain>.slack.com/services/new
1. Search for and select "Slash Commands".
1. Enter a name for your command and click "Add Slash Command Integration".
1. Copy the token string from the integration settings and use it in the next section.
1. After you complete the deployment to AWS, enter the provided API endpoint URL in the URL field.

Follow these steps to encrypt your Slack token for use in this function:

1. Create a KMS key - http://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html.
1. Encrypt the token using the AWS CLI: `$ aws kms encrypt --key-id alias/<KMS key name> --plaintext "<COMMAND_TOKEN>"`
1. Copy the base-64 encoded, encrypted key (CiphertextBlob) to the kmsEncyptedToken variable in `index.js`.
1. Give your function's role permission for the kms:Decrypt action.

Example role permission:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt"
      ],
      "Resource": [
        "<your KMS key ARN>"
      ]
    }
  ]
}
```

Follow these steps to deploy the AWS Lambda function:

1. `aws configure`
1. `serverless deploy`
1. Update the URL for your Slack slash command with the invocation URL for the created API resource in the prod stage.
1. `serverless invoke --function slack --path event.json`

## Todo

* icon for morbotron
* better subtitle line wrapping
* perhaps constraining the included subtitles to just 1 or 2 timecodes instead of all lines
* perhaps include a link to episode wiki
* convert to Slack app for all Slack teams
* publish to Slack marketplace
* enable preview of result before sharing
* support `/morbotron meme /s\d{1,2}e\d{1,2}/ /\d+/$` # exact episode id and timestamp
* put IAM KMS policy into git
