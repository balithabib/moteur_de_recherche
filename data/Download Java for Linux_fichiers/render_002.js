/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.
 */
/* globals define,console */
define([
	"jquery",
	"mustache",
	"marked"
], function ($, Mustache, Marked) {
	"use strict";

	// Content Layout constructor function.
	function ContentLayout(params) {
		this.contentItemData = params.contentItemData || {};
		this.scsData = params.scsData;
		this.contentClient = params.contentClient;
	}


	// Content Layout definition.
	ContentLayout.prototype = {
		// Specify the versions of the Content REST API that are supported by the this Content Layout.
		// The value for contentVersion follows Semantic Versioning syntax.
		// This allows applications that use the content layout to pass the data through in the expected format.
		contentVersion: ">=1.0.0 <2.0.0",

		// Main rendering function:
		// - Updates the data to handle any required additional requests and support both v1.0 and v1.1 Content REST APIs
		// - Expand the Mustache template with the updated data
		// - Appends the expanded template HTML to the parentObj DOM element
		render: function (parentObj) {
			var template,
				content = $.extend({}, this.contentItemData),
				contentClient = this.contentClient,
				contentType,
				secureContent = false;

			// If used with CECS Sites, Sites will pass in context information via the scsData property.
			if (this.scsData) {
				content = $.extend(content, {
					"scsData": this.scsData
				});
				contentType = content.scsData.showPublishedContent === true ? "published" : "draft";
				secureContent = content.scsData.secureContent;
			}

			// Support both v1.0 and v1.1 Content REST API response formats.
			// User-defined fields are passed through the 'data' property in v1.0 and 'fields' property in v1.1.
			var data = !contentClient.getInfo().contentVersion || contentClient.getInfo().contentVersion === "v1" ? content.data : content.fields;

			// Massage the data so that the 'fields' property is always there.
			// The corresponding layout.html template only checks for the ‘fields’ property.
			if (!contentClient.getInfo().contentVersion || contentClient.getInfo().contentVersion === "v1") {
				content["fields"] = content.data;
			}

			//
			// Handle fields specific to this content type.
			//
      window.s_channel = data.channel;
      window.s_pageName = "javac:" + data.channel + ":" + data.pagename;
      var seoLocale = SCS.pageLanguageCode;
      if(seoLocale == 'zh-TW') seoLocale = "zt";
      else if(seoLocale == 'zh-CN') seoLocale = "zh";
      else if(seoLocale == 'pt-BR') seoLocale = "pt";
      window.s_prop19= seoLocale + "_javac:" + data.channel + ":" + data.pagename;
      window.s_prop20 = data.prop20; // static
			window.s_prop21 = data.prop21; // static
      var s_prop17 = data.s_prop17?data.s_prop17:data.s_prop17_rules?processRules(data.s_prop17_rules, window.envData).value:"";
      if(s_prop17)
        window.s_prop17 = s_prop17;
      require(['omniture']);

		}
	};

	return ContentLayout;
});
