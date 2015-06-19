// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular
		.module('starter', [ 'ionic' ])

		.run(function($ionicPlatform) {
			$ionicPlatform.ready(function() {
				// Hide the accessory bar by default (remove this to show the
				// accessory
				// bar above the keyboard
				// for form inputs)
				if (window.cordova && window.cordova.plugins.Keyboard) {
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				}
				if (window.StatusBar) {
					StatusBar.styleDefault();
				}
			});
		})
		.controller(
				"FeedController",
				function($http, $scope, $timeout, $ionicScrollDelegate,
						$ionicPopover, $filter) {
					$scope.filterName = 'All Time';
					$ionicPopover.fromTemplateUrl(
							'templates/popoverDateFilter.html', {
								scope : $scope
							}).then(function(popover) {
						$scope.popoverDate = popover;
					});

					$scope.openPopoverDateFilter = function($event) {

						$scope.popoverDate.show($event);
					};

					$ionicPopover.fromTemplateUrl(
							'templates/popoverFeedsFilter.html', {
								scope : $scope
							}).then(function(popover) {
						$scope.popoverFeeds = popover;
					});

					$scope.openPopoverFeedsFilter = function($event) {

						$scope.popoverFeeds.show($event);
					};

					$scope.allFeeds = function() {
						$http
								.get(
										"http://ajax.googleapis.com/ajax/services/feed/load",
										{
											params : {
												"v" : "1.0",
												"q" : "https://news.google.com/?output=rss",
												"num" : "100"
											}
										})
								.success(
										function(data) {
											$scope.title = 'All feeds';
											$scope.entriesGoogle = data.responseData.feed.entries;
											window.localStorage["entriesGoogle"] = JSON
													.stringify(data.responseData.feed.entries);
											window.localStorage["titleGoogle"] = JSON
													.stringify(data.responseData.feed.title);
										})
								.error(
										function(data) {
											console.log("ERROR: " + data);
											if (window.localStorage["entriesGoogle"] !== undefined
													&& window.localStorage["titleGoogle"] !== undefined) {
												$scope.entriesGoogle = JSON
														.parse(window.localStorage["entriesGoogle"]);

											}
										});

						$http
								.get(
										"http://ajax.googleapis.com/ajax/services/feed/load",
										{
											params : {
												"v" : "1.0",
												"q" : "http://news.yahoo.com/rss/entertainment",
												"num" : "100"
											}
										})
								.success(
										function(data) {
											$scope.entriesYahoo = data.responseData.feed.entries;
											window.localStorage["entriesYahoo"] = JSON
													.stringify(data.responseData.feed.entries);
											window.localStorage["titleYahoo"] = JSON
													.stringify(data.responseData.feed.title);
										})
								.error(
										function(data) {
											console.log("ERROR: " + data);
											if (window.localStorage["entriesYahoo"] !== undefined
													&& window.localStorage["titleYahoo"] !== undefined) {
												$scope.entriesYahoo = JSON
														.parse(window.localStorage["entriesYahoo"]);
											}
										});
					}

					$scope.showAll = function() {
						$scope.filterName = 'All Time';
						$scope.popoverDate.hide();
						$scope.datePrev = '';
						$ionicScrollDelegate.scrollTop(true);
					};
					$scope.showTodays = function() {
						$scope.filterName = 'Todays';
						$scope.popoverDate.hide();
						var currentDate = new Date();
						var previousDate = new Date(currentDate);
						previousDate.setDate(currentDate.getDate() - 1);
						$scope.datePrev = $filter("date")(currentDate,
								'dd MMM yyyy');
						$ionicScrollDelegate.scrollTop(true);
					};
					$scope.showYesterDay = function() {
						$scope.filterName = 'YesterDay';
						$scope.popoverDate.hide();
						var currentDate = new Date();
						var previousDate = new Date(currentDate);
						previousDate.setDate(currentDate.getDate() - 1);
						$scope.datePrev = $filter("date")(previousDate,
								'dd MMM yyyy');
						$ionicScrollDelegate.scrollTop(true);
					};

					$scope.googlefeeds = function() {
						$http
								.get(
										"http://ajax.googleapis.com/ajax/services/feed/load",
										{
											params : {
												"v" : "1.0",
												"q" : "https://news.google.com/?output=rss",
												"num" : "100"
											}
										})
								.success(
										function(data) {
											$scope.title = 'Google Feeds';
											$scope.entriesGoogle = data.responseData.feed.entries;
											window.localStorage["entriesGoogle"] = JSON
													.stringify(data.responseData.feed.entries);
											window.localStorage["titleGoogle"] = JSON
													.stringify(data.responseData.feed.title);
										})
								.error(
										function(data) {
											console.log("ERROR: " + data);
											if (window.localStorage["entriesGoogle"] !== undefined
													&& window.localStorage["titleGoogle"] !== undefined) {
												$scope.entriesGoogle = JSON
														.parse(window.localStorage["entriesGoogle"]);
												$scope.title = JSON
														.parse(window.localStorage["titleGoogle"]);

											}
										});

					}
					$scope.browse = function(link) {
						window.open(link, "_system", "location=yes");
					}

					$scope.yahooFeeds = function() {
						$http
								.get(
										"http://ajax.googleapis.com/ajax/services/feed/load",
										{
											params : {
												"v" : "1.0",
												"q" : "http://news.yahoo.com/rss/entertainment",
												"num" : "100"
											}
										})
								.success(
										function(data) {
											$scope.title = 'Yahoo Feeds';
											$scope.entriesYahoo = data.responseData.feed.entries;
											window.localStorage["entriesYahoo"] = JSON
													.stringify(data.responseData.feed.entries);
											window.localStorage["titleYahoo"] = JSON
													.stringify(data.responseData.feed.title);
										})
								.error(
										function(data) {
											console.log("ERROR: " + data);
											if (window.localStorage["entriesYahoo"] !== undefined
													&& window.localStorage["titleYahoo"] !== undefined) {
												$scope.entriesYahoo = JSON
														.parse(window.localStorage["entriesYahoo"]);
												$scope.title = JSON
														.parse(window.localStorage["titleYahoo"]);

											}
										});
					}

					$scope.doRefresh = function() {
						if ($scope.entriesYahoo == '') {
							$scope.googlefeeds();
						} else if ($scope.entriesGoogle == '') {
							$scope.yahooFeeds();
						} else {
							$scope.allFeeds();
						}
						$timeout(function() {
							// Stop the ion-refresher from spinning
							$scope.$broadcast('scroll.refreshComplete');
						}, 1500);
					}
					$scope.yahoo = function() {
						// $scope.datePrev = '';
						$scope.popoverFeeds.hide();
						$scope.entriesGoogle = '';
						$scope.yahooFeeds();
						$ionicScrollDelegate.scrollTop(true);
					}
					$scope.google = function() {
						// $scope.datePrev = '';
						$scope.popoverFeeds.hide();
						$scope.entriesYahoo = '';
						$scope.googlefeeds();
						$ionicScrollDelegate.scrollTop(true);
					}
					$scope.all = function() {
						// $scope.datePrev = '';
						$scope.popoverFeeds.hide();
						$scope.allFeeds();
						$ionicScrollDelegate.scrollTop(true);
					}
				});