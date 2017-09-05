export default function() {
	process.on('uncaughtException', function (err) {
  	console.log('Caught exception: ' + err);
});
}