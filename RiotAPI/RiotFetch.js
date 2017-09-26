export default function(url) {
	return fetch(url)
      .then((response) => {
          var status = response.status;
          if (status >= 400) {
          	var error = {
          		status: status,
          		url: url
          	};

            console.log('Fetch Error:')
            console.log(error);
          }

          return response.json();
      })
      .catch((err) => {
        console.log(err);
      })
}
