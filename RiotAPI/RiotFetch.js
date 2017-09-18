export default function(url, done) {
	return fetch(url)
      .then((response) => {
          var status = response.status;
          if (status >= 400) {
          	var error = {
          		status: status,
          		url: url
          	};

            console.log('Error - Riot API:')
            console.log(error);
          }

          return response.json();
      })
      .then((data) => {
          done(data);
      });
}
