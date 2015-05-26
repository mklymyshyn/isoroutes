require("babel/register")({
  blacklist: [
    //'es6.forOf',
    'regenerator',
    //'es6.arrowFunctions',
    //'es6.constants',
    //'es6.blockScoping'
  ]
});
