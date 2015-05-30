/**
 * Checks for updates and shows a notification
 *
 * @ngdoc factory
 * @name updateChecker
 */
angular.module('tc').factory('updateChecker', function($http, $mdToast, gui) {

	var semverDiff = require('semver-diff');
	var version = gui.App.manifest.version;
	var latest;
	var url = 'https://api.github.com/repos/mccxiv/tc/releases?callback=JSON_CALLBACK';

	$http.jsonp(url).success(function(response) {
		latest = response.data[0].tag_name;
		//latest = "1.0.0-beta.6"; // For testing;
		setTimeout(notify, 5000);
	});

	function notify() {
		if (semverDiff(version, latest)) {
			var toast = $mdToast.show(
				$mdToast.simple()
					.content('New version available!')
					.position('bottom right')
					.hideDelay(5000)
					.action('DOWNLOAD')
			);
			toast.then(function() {
				gui.Shell.openExternal('http://mccxiv.github.io/tc/');
			});
		}
	}

	return {show : notify};
});