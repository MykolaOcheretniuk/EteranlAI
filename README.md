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

## Get account details

Response body:
{
"name": null | Jane Doe,
"email": "email@mail.com",
"phoneNumber": null | +380999999999,
"subscriptionInfo": null | {"nextPaymentDate": "May 19, 2023"}
}

curl --request GET \
 --url https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/user \
 --header 'Authorization: JWT-access-token'

## Update account details

Required JSON body:
{
"name": "Jane Doe",
"email": "testMail@mail.com",
"phoneNumber": "+38088888888",
"password": "Passw0rd!!!"
}

curl --request PUT \
 --url https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/user \
 --header 'Authorization: JWT-access-token' \
 --header 'Content-Type: application/json' \
 --data '{
"name": "Jane Doe",
"email": "testMail@mail.com",
"phoneNumber": "+38088888888",
"password": "Passw0rd!!!"
}'

## Subscribe

https://stripe.com/docs/testing?testing-method=card-numbers#visa

Required JSON body:
{
"number":"3566002020360505",
"exp_month": "11",
"exp_year": "2055",
"cvc": "111"
}

curl --request POST \
 --url https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/user/payments/subscribe \
 --header 'Authorization: JWT-access-token' \
 --header 'Content-Type: application/json' \
 --data '{
"number":"3566002020360505",
"exp_month": "11",
"exp_year": "2055",
"cvc": "111"
}'

## Cancel subscription

curl --request POST \
 --url https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/user/payments/cancelSubscription \
 --header 'Authorization: JWT-access-token'

## Update payment method

Required JSON body:
{
"number":"3566002020360505",
"exp_month": "11",
"exp_year": "2055",
"cvc": "111"
}'

curl --request POST \
 --url https://a13nttwcx5.execute-api.us-east-1.amazonaws.com/user/updatePaymentMethod \
 --header 'Authorization: JWT-access-token' \
 --header 'Content-Type: application/json' \
 --data '{
"number":"3566002020360505",
"exp_month": "11",
"exp_year": "2055",
"cvc": "111"
}'
