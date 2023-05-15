## Sign-Up

https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/user/signUp

Required JSON Body:
{
"email":"yourEmail@mail.com",
"password":"yourPassword"
}'

Response body:
{
"accessToken": "JWT-Access-token"
}

curl --request POST \

--url https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/user/signUp \
--header 'Content-Type: application/json' \
--data '{
"email":"yourEmail@mail.com",
"password":"yourPassword"
}'

## Login

https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/user/login

Required JSON Body:
{
"email":"yourEmail@mail.com",
"password":"yourPassword"
}'

Response body:
{
"accessToken": "JWT-Access-token"
}

Response body:
{
"accessToken": "JWT-Access-token"
}

Errors:
-400 "Error: Incorrect password"
-404 "Error: User not found"

curl --request POST \
 --url https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/user/login \
 --header 'Content-Type: application/json' \
 --data '{
"email":"yourEmail@mail.com",
"password":"yourPassword"
}'

## Attach individual to user

https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/user/choseIndividual

Required JSON Body:
{
"individual":"Steve Jobs"
}

Required Authorization header:
--header 'Authorization: JWT-Access-token'

curl --request POST \
 --url https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/user/choseIndividual \
 --header 'Authorization: JWT-Access-token' \
 --header 'Content-Type: application/json' \
 --data '{
"individual":"Steve Jobs"
}'

## Ask Question

https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/getAnswer

Required JSON Body:
{
"question":"What is your name?"
}

Response body:
{
"answer": "My name is ..."
}

Errors:
-400 "Error: Individual to chat with user was not set"
-403 Forbidden(Access token expired or invalid)
-403 "Error: your 5 free question is over"

Required Authorization header:
--header 'Authorization: JWT-Access-token'

curl --request POST \
 --url https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/getAnswer \
 --header 'Authorization:JWT-Access-token ' \
 --header 'Content-Type: application/json' \
 --data '{
"question":"Your Name?"
}'
