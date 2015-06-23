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
					$scope.title = 'All feeds';

					// Popover of Date Filter
					$ionicPopover.fromTemplateUrl(
							'templates/popoverDateFilter.html', {
								scope : $scope
							}).then(function(popover) {
						$scope.popoverDate = popover;
					});

					$scope.openPopoverDateFilter = function($event) {
						$scope.popoverDate.show($event);
					};

					// Popover of Feeds Filter
					$ionicPopover.fromTemplateUrl(
							'templates/popoverFeedsFilter.html', {
								scope : $scope
							}).then(function(popover) {
						$scope.popoverFeeds = popover;
					});

					$scope.openPopoverFeedsFilter = function($event) {
						$scope.popoverFeeds.show($event);
					};

					// Function to call filter feeds
					getFilterFeeds = function() {
						if ($scope.title == 'All feeds') {
							$scope.allFeeds();
						} else if ($scope.title == 'Google Feeds') {
							$scope.googlefeeds();
						} else if ($scope.title == 'Yahoo Feeds') {
							$scope.yahooFeeds();
						}
					}

					// Function to show All Time feeds
					$scope.showAll = function() {
						$scope.filterName = 'All Time';
						$scope.popoverDate.hide();
						$scope.date = '';
						getFilterFeeds();
						$ionicScrollDelegate.scrollTop(true);

					};

					// Function to show Today's feeds
					$scope.showTodays = function() {
						$scope.filterName = 'Todays';
						$scope.popoverDate.hide()
						var currentDate = new Date();
						var previousDate = new Date(currentDate);
						previousDate.setDate(currentDate.getDate() - 1);
						$scope.date = $filter("date")(currentDate,
								'EEEE dd MMM yyyy');
						getFilterFeeds();
						$ionicScrollDelegate.scrollTop(true);
					};

					// Function to show Yesterday feeds
					$scope.showYesterDay = function() {
						$scope.filterName = 'YesterDay';
						$scope.popoverDate.hide();
						var currentDate = new Date();
						var previousDate = new Date(currentDate);
						previousDate.setDate(currentDate.getDate() - 1);
						$scope.date = $filter("date")(previousDate,
								'EEEE dd MMM yyyy');
						getFilterFeeds();
						$ionicScrollDelegate.scrollTop(true);
					};

					// Function to get Google and Yahoo feeds both
					$scope.allFeeds = function() {
						$scope.title = 'All feeds';
						$scope.itemsGoogle = [];
						$scope.itemsYahoo = [];
						$scope.responseGoogle = [];
						$scope.responseYahoo = [];
						$http
								.get(
										"http://ajax.googleapis.com/ajax/services/feed/load",
										{
											params : {
												"v" : "1.0",
												"q" : "https://news.google.com/?output=rss",
												"num" : "25"
											}
										})
								.success(
										function(data) {
											for ( var i = 0; i < data.responseData.feed.entries.length; i++) {
												$scope.imgGoogle = 'https://ssl.gstatic.com/news-static/img/logo/en_us/news.gif';
												$scope.itemsGoogle
														.push({
															'publishedDate' : $filter(
																	'date')
																	(
																			new Date(
																					data.responseData.feed.entries[i].publishedDate),
																			"EEEE dd MMM yyyy hh:mm:ss a"),
															'title' : data.responseData.feed.entries[i].title,
															'contentSnippet' : data.responseData.feed.entries[i].contentSnippet,
															'link' : data.responseData.feed.entries[i].link,
															'img' : $scope.imgGoogle
														});
											}
											$http
													.get(
															"http://ajax.googleapis.com/ajax/services/feed/load",
															{
																params : {
																	"v" : "1.0",
																	"q" : "http://news.yahoo.com/rss/entertainment",
																	"num" : "25"
																}
															})
													.success(
															function(data) {
																for ( var i = 0; i < data.responseData.feed.entries.length; i++) {
																	$scope.imgYahoo = 'http://l.yimg.com/rz/d/yahoo_news_en-US_s_f_p_168x21_news.png';
																	if (angular
																			.isObject(data.responseData.feed.entries[i].mediaGroups)) {
																		$scope.mediaGroups = data.responseData.feed.entries[i].mediaGroups;
																		for ( var j = 0; j < $scope.mediaGroups.length; j++) {
																			$scope.contents = $scope.mediaGroups[j].contents;
																		}
																		for ( var k = 0; k < $scope.contents.length; k++) {
																			$scope.imgYahoo = $scope.contents[k].url;
																		}
																	}
																	$scope.itemsYahoo
																			.push({
																				'publishedDate' : $filter(
																						'date')
																						(
																								new Date(
																										data.responseData.feed.entries[i].publishedDate),
																								"EEEE dd MMM yyyy hh:mm:ss a"),
																				'title' : data.responseData.feed.entries[i].title,
																				'contentSnippet' : data.responseData.feed.entries[i].contentSnippet,
																				'link' : data.responseData.feed.entries[i].link,
																				'img' : $scope.imgYahoo
																			});
																}

																// Filter both
																// Google Yahoo
																// feeds
																if ($scope.filterName == 'YesterDay'
																		|| $scope.filterName == 'Todays') {
																	var todayGoogleFeeds = $filter(
																			'filter')
																			(
																					$scope.itemsGoogle,
																					$scope.date);
																	var todayYahooFeeds = $filter(
																			'filter')
																			(
																					$scope.itemsYahoo,
																					$scope.date);
																	if (todayGoogleFeeds.length > 0
																			|| todayYahooFeeds.length > 0) {

																		if (todayGoogleFeeds.length > 0) {
																			$scope.responseGoogle = todayGoogleFeeds;
																		} else {
																			$scope.itemsGoogle = [];
																		}
																		if (todayYahooFeeds.length > 0) {
																			$scope.responseYahoo = todayYahooFeeds;
																		} else {
																			$scope.itemsYahoo = [];
																		}
																	} else {
																		$scope.responseGoogle = [];
																		$scope.responseYahoo = [];
																		var nodata = 'No '
																				+ $scope.filterName
																				+ ' Feeds Available';
																		$scope.responseGoogle
																				.push({
																					"publishedDate" : '',
																					"title" : nodata,
																					"contentSnippet" : '',
																					"link" : ''
																				});
																	}
																} else {
																	$scope.responseYahoo = $scope.itemsYahoo;
																	$scope.responseGoogle = $scope.itemsGoogle;
																}

															})
													.error(
															function(data) {
																console
																		.log("ERROR: "
																				+ data);
															});
										}).error(function(data) {
									alert('Error to load feeds');
									console.log("ERROR: " + data);
								});
					}

					// Function to get Google Feeds
					$scope.googlefeeds = function() {
						$scope.itemsGoogle = [];
						$scope.itemsYahoo = [];
						$scope.responseGoogle = [];
						$scope.responseYahoo = [];
						$http
								.get(
										"http://ajax.googleapis.com/ajax/services/feed/load",
										{
											params : {
												"v" : "1.0",
												"q" : "https://news.google.com/?output=rss",
												"num" : "25"
											}
										})
								.success(
										function(data) {
											$scope.title = 'Google Feeds';
											for ( var i = 0; i < data.responseData.feed.entries.length; i++) {
												$scope.imgGoogle = 'https://ssl.gstatic.com/news-static/img/logo/en_us/news.gif';
												$scope.itemsGoogle
														.push({
															"publishedDate" : $filter(
																	'date')
																	(
																			new Date(
																					data.responseData.feed.entries[i].publishedDate),
																			"EEEE dd MMM yyyy hh:mm:ss a"),
															"title" : data.responseData.feed.entries[i].title,
															"contentSnippet" : data.responseData.feed.entries[i].contentSnippet,
															"link" : data.responseData.feed.entries[i].link,
															'img' : $scope.imgGoogle
														});
											}

											// Filter Google feeds
											if ($scope.filterName == 'YesterDay'
													|| $scope.filterName == 'Todays') {
												var todayGoogleFeeds = $filter(
														'filter')(
														$scope.itemsGoogle,
														$scope.date);
												if (todayGoogleFeeds.length > 0) {
													$scope.responseGoogle = todayGoogleFeeds;
												} else {
													$scope.responseGoogle = [];
													var nodata = 'No '
															+ $scope.filterName
															+ ' Feeds Available';
													$scope.responseGoogle
															.push({
																"publishedDate" : '',
																"title" : nodata,
																"contentSnippet" : '',
																"link" : ''
															});
												}
											} else {
												$scope.responseGoogle = $scope.itemsGoogle;
											}
										}).error(function(data) {
									console.log("ERROR: " + data);
								});

					}

					// Function to get Yahoo feeds
					$scope.yahooFeeds = function() {
						$scope.itemsGoogle = [];
						$scope.itemsYahoo = [];
						$scope.responseGoogle = [];
						$scope.responseYahoo = [];
						$http
								.get(
										"http://ajax.googleapis.com/ajax/services/feed/load",
										{
											params : {
												"v" : "1.0",
												"q" : "http://news.yahoo.com/rss/entertainment",
												"num" : "25"
											}
										})
								.success(
										function(data) {
											$scope.title = 'Yahoo Feeds';
											for ( var i = 0; i < data.responseData.feed.entries.length; i++) {
												$scope.imgYahoo = 'http://l.yimg.com/rz/d/yahoo_news_en-US_s_f_p_168x21_news.png';
												if (angular
														.isObject(data.responseData.feed.entries[i].mediaGroups)) {
													$scope.mediaGroups = data.responseData.feed.entries[i].mediaGroups;
													for ( var j = 0; j < $scope.mediaGroups.length; j++) {
														$scope.contents = $scope.mediaGroups[j].contents;
													}
													for ( var k = 0; k < $scope.contents.length; k++) {
														$scope.imgYahoo = $scope.contents[k].url;
													}
												}
												$scope.itemsYahoo
														.push({
															'publishedDate' : $filter(
																	'date')
																	(
																			new Date(
																					data.responseData.feed.entries[i].publishedDate),
																			"EEEE dd MMM yyyy hh:mm:ss a"),
															'title' : data.responseData.feed.entries[i].title,
															'contentSnippet' : data.responseData.feed.entries[i].contentSnippet,
															'link' : data.responseData.feed.entries[i].link,
															'img' : $scope.imgYahoo
														});
											}

											// Filter Yahoo feeds
											if ($scope.filterName == 'YesterDay'
													|| $scope.filterName == 'Todays') {
												var todayYahooFeeds = $filter(
														'filter')(
														$scope.itemsYahoo,
														$scope.date);
												if (todayYahooFeeds.length > 0) {
													$scope.responseYahoo = todayYahooFeeds;
												} else {
													$scope.responseYahoo = [];
													var nodata = 'No '
															+ $scope.filterName
															+ ' Feeds Available';
													$scope.responseYahoo.push({
														"publishedDate" : '',
														"title" : nodata,
														"contentSnippet" : '',
														"link" : ''
													});
												}
											} else {
												$scope.responseYahoo = $scope.itemsYahoo;
											}

										}).error(function(data) {
									console.log("ERROR: " + data);
								});
					}

					// Function to show Yahoo feeds
					$scope.yahoo = function() {
						$scope.popoverFeeds.hide();
						$scope.yahooFeeds();
						$ionicScrollDelegate.scrollTop(true);
					}

					// Function to show Google feeds
					$scope.google = function() {
						$scope.popoverFeeds.hide();
						$scope.googlefeeds();
						$ionicScrollDelegate.scrollTop(true);
					}

					// Function to show both Google and Yahoo feeds
					$scope.all = function() {
						$scope.popoverFeeds.hide();
						$scope.allFeeds();
						$ionicScrollDelegate.scrollTop(true);
					}

					// Functon to open feeds in web
					$scope.browse = function(link) {
						window.open(link, "_system", "location=yes");
					}

					// Function of pull to refresh
					$scope.doRefresh = function() {
						if ($scope.title == 'Google Feeds') {
							$scope.googlefeeds();
						} else if ($scope.title == 'Yahoo Feeds') {
							$scope.yahooFeeds();
						} else {
							$scope.allFeeds();
						}
						$timeout(function() {
							// Stop the ion-refresher from spinning
							$scope.$broadcast('scroll.refreshComplete');
						}, 1500);
					}

				});