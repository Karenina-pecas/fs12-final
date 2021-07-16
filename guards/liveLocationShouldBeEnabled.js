function liveLocationShouldBeEnabled(req, res, next) {
  const { latitude, longitude } = req.user;
  console.log('i am in the second guard');
  console.log(latitude, longitude);

  if (latitude && longitude) {
    req.liveLocation = { lat: +latitude, lng: +longitude };

    next();
  } else {
    res.status(401).send({ message: 'We need you to authorize us to access your location' });
  }
}

module.exports = liveLocationShouldBeEnabled;

//When the user creates her account, should allow location
//if user gives permission, then generate locationToken (locationTokenShouldExist) in post/liveLocation

//if user DOES NOT  gives permisson, send message asking for her permisson
