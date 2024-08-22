diff bw http server and express server


Pending tasks -

1. update comment api query logic
2. handle duplicate title in response message - add article api
3.

Authentication and Authorization Flow-
1. User signs up or signs in, back-end sends accessToken (1h expiry time) and refreshToken(7d expiry time) in http-only cookie and user data in response body. Both tokens have userId and email encoded.
2. Front-end stores user data in zustand session management to prevent api call for user information on every page reload.
3. If user logs out or website tab is closed, session is destroyed so user data is gone from memory.
4. When user comes again on website after 12 hours or 2 days or in less than 7 days, in app/page.tsx, useEffect calls async function at page mount and this function calls validateUser API without sending anything in request body.
5. For network error or server error, user gets message, "server is down, please try again or after some time". 
6. In this validateUser API, back-end has applied auth middleware for token validation. (read starting token handling for understanding this flow)
7. If any token is valid, validateUser function is called in controller which decode token and takes userId. Then this controller function fetches user from db and returns user data in response body.
8. Front-end developer stores user data in session management and allow user to all pages.

Token Expiry Handling Middleware - 
Some API's don't need token, and API's where authorization is mandatory, back-end has auth middleware. 
1. This middleware takes accessToken and refreshToken from req.cookies.
2. It checks accessToken validity. If accessToken is valid, then it decodes userId from token and calls await userExist function, then calls next function.
3. If accessToken is invalid, then it checks refreshToken. 
4. If refreshToken is not valid, back-end sends result as false with message "Invalid token" and user is navigated to login page with the information why they were logged out (e.g., "Your session has expired. Please log in again.").
5. If refreshToken is valid, then it decodes userId from token and calls await userExist function, then calls next function.


userExist function in the same file - 
1. It takes userId and check user entry in db. 
2. If entry not found, it returns result false and message "User not found". 
3. If entry found in db, it generates new accessToken and new refreshToken, puts both token in res.cookie and update req.cookie tokens.

search articles api