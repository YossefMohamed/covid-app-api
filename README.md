# covid-app-api
## system architecture diagram:
![image](https://user-images.githubusercontent.com/47724276/174472337-b74bc05d-8c69-41c6-a511-c6c1429f30c4.png)

## sequance diagram

![image](https://user-images.githubusercontent.com/47724276/174472370-436275d7-9889-480c-b09f-01d34e02c441.png)

## Endpoints:
### Users end point
In this end point, we used POST, PATCH and DELETE.
   #### POST is used for 5 processes:
    • Register a new user and take the following parameters (first name, last name,
    email, phone number, gender, password and confirm password) as a body of
    the request and make a new user document in the database.
    • Login a new user takes the following parameters (phone number and
    password) as a body to be checked in the database.
    • Send a verification message to the user using “Voyage” API. The application
    sends a verification code on a message to the user’s phone, this code is also
    saved to the user’s document then the user gives this code to the frontend
    screen. The required parameters here are user id as a query.
    • Confirm a user with a code when the user enters the verification code to the
    app, it will check the code and allow the confirmation if the code is correct.
    • Reset password is used to reset user password. The parameters of the request
    are user’s ID as a query and new password & password confirmation as a
    request body. After finding the required user, the system checksthe password
    and password confirmation if equal, update the password else return an error.
    The response code will be 200 if the sample is found and updated, 401 if the
    user is not authorized and 404 if the sample is not found.
  #### PATCH is used for one process:
    • Update user is used to update user’s data in our system. The parameters of
    the request are user’s ID as a query and new user’s data. After finding the
    user, it will replace his old data with the new one. The response code will be
    200 if the sample is found and updated, 401 if the user is not authorized and
    404 if the sample is not found.
  #### DELETE is used for one process:
    • Delete user is used to delete a user from the system. The parameter of the
    request is user’s ID as a query. After finding the required user, it will delete
    it. The response code will be 200 if the sample is found, 401 if the user is not
    authorized and 404 if the sample is not found.
  ## Samples end point
  In this end point, we used POST, GET and DELETE.
  ### POST is used for two processes:
    • Adding new sample, each sample has some variables such as link, user, covid
    and ID. It will be uploaded to cloudinary to store them. The required
    parameters which the user should enter them (sample file, fever problem and
    breath problem), then the system will send them to the deployed server, and
    server response will be saved to the database and sent to the user.
    • Adding sample to the system database to increase dataset in order to improve
    the training efficiency in the future. The user will upload his cough record
    and his PCR test which should be within the previous 48 hours only. That
    data will be uploaded to cloudinary using cloudinary API to store them, the
    95
    required parameters which the user should enter them user’s ID as a query
    and (sample file, fever problem and breath problem).
  ### GET is used for three processes:
    • Get all samples; the response code will be 200 if all samples are found, 401
    if the user is not authorized and 404 if all samples are not found.
    • Get all samples in the custom dataset; the response code will be 200 if all
    samples are found, 401 if the user is not authorized and 404 if all samples are
    not found.
    • Get a sample; it takes ID as a query and searches for his sample and returns
    it if it is found. The response code will be 200 if the sample is found, 401 if
    the user is not authorized and 404 if the sample is not found.
  ### DELETE is used for one process:
    • DELETE is used to delete a sample. It is similarly to “Get a sample” but after
    finding the required sample it will delete it. The response code will be 200 if
    the sample is found, 401 if the user is not authorized and 404 if the sample is
    not found.
## Authorization and Authentication
  To handle authorization and authentication, we will use JSON web tokens
  "JWT," which we will send to the front end when the user logs in and will be in headers
  whenever a user tries to access a path that needs authentication. JWT uses the RSA
  algorithm to encrypt and decrypt data with the secret key provided to handle security
  in our app.
## Swagger UI
  A swagger is a tool for developing and describing RESTful APIs. We used this
  package to document our RESTApi in order to make it easy to understand and integrate
  with the frontend developers. After adding information in each route required to make
  swagger documentation, the output will be ready.
  
  https://cough-api.herokuapp.com/api-docs/

## dotenv example

CLOUDINARY_NAME.cloudinary_api_name
CLOUDINARY_KEY=cloudinary_api_key 
CLOUDINARY_SECRET=cloudinary_api_secret
MONGODBURI=mongoDB_URI 
JWT_SECRET=jwt_secret 
VOYAGE_API_SECRET=voyage_api_secret
DEPLOYED_LINK=deployed_model_link_server
 





