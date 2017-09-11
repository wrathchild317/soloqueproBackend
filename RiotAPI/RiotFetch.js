export default function(url, res) {
	fetch(url)
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
          res.json(data);
      });
}
