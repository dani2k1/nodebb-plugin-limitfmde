(function(module) {
	"use strict";

	var async = module.parent.require('async'),
		nconf = module.parent.require('nconf'),
		fs = require('fs'),
		path = require('path'),
		db = module.parent.require('./database'),
		categories = module.parent.require('./categories'),
		user = module.parent.require('./user'),
		plugins = module.parent.require('./plugins'),
		topics = module.parent.require('./topics'),
		posts = module.parent.require('./posts'),
		groups = module.parent.require('./groups'),
		translator = module.parent.require('../public/src/modules/translator'),
		templates = module.parent.require('templates.js'),
		websockets = module.parent.require('./socket.io'),
		app;


	var Widget = {
		templates: {}
	};

	Widget.init = function(params, callback) {
		app = params.app;

		var templatesToLoad = [
			"admin/recentlfmcards.tpl",
			];

		function loadTemplate(template, next) {
			fs.readFile(path.resolve(__dirname, './public/templates/' + template), function (err, data) {
				if (err) {
					console.log(err.message);
					return next(err);
				}
				Widget.templates[template] = data.toString();
				next(null);
			});
		}

		async.each(templatesToLoad, loadTemplate);

		callback();
	};



	Widget.renderLfmCards = function(widget, callback) {
		function done(err, posts) {
			if (err) {
				return callback(err);
			}
			var data = {
				posts: posts,
				numPosts: numPosts,
				cid: cid,
				relative_path: nconf.get('relative_path')
			};
			app.render('widgets/recentlfmcards', data, function(err, html) {
				translator.translate(html, function(translatedHTML) {
					callback(err, translatedHTML);
				});
			});
		}
		var cid = widget.data.cid;
		if (!parseInt(cid, 10)) {
			var match = widget.area.url.match('category/([0-9]+)');
			cid = (match && match.length > 1) ? match[1] : null;
		}
		var numPosts = widget.data.numPosts || 4;
		if (cid) {
			categories.getRecentReplies(cid, widget.uid, numPosts, done);
		} else {
			posts.getRecentPosts(widget.uid, 0, Math.max(0, numPosts - 1), 'alltime', done);
		}
	};
	Widget.defineWidgets = function(widgets, callback) {
		widgets = widgets.concat([
			{
				widget: "recentlfm",
				name: "Limit.FM Cards",
				description: "Show Limit.FM Cards.",
				content: Widget.templates['admin/recentlfmcards.tpl']
			}		]);

		callback(null, widgets);
	};


	module.exports = Widget;
}(module));