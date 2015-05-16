# Isoroutes

.. image:: 
![alt tag](https://api.travis-ci.org/joymax/isoroutes.svg)


Library to everyday needs related to isomorphic development with React.js and
any server-ready JavaScript framework.


##  FAQ

1. **Why another router?**

	I believe that it’s possible to make router functionality pure and simple.
	Without promises and bunch of callback-style code. Right now it’s completely pure:
	for same input (*state*) router generate same output (*rendered markup*).


1. **Why CSP channels?**

	With CSP channels really easy organize asynchronous workflow which required for
	retreiving multiple components state. Code looks clean, testable and easy-to-understand.


1. **It's only for React.js?**

	No, it's possible to use with **any server-ready** framework (even vanilla JS!).
	Just write correspond renderer and move on.