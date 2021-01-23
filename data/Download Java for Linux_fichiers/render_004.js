/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.
 */
/* globals define,console */
define([
	"jquery",
	"mustache",
	"marked",
	"text!./layout.html"
], function ($, Mustache, Marked, templateHtml) {
	"use strict";

	// Content Layout constructor function.
	function ContentLayout(params) {
		this.contentItemData = params.contentItemData || {};
		this.scsData = params.scsData;
		this.contentClient = params.contentClient;
	}

	// Helper function to format a date field by locale.
	function dateToMDY(date) {
		if (!date) {
			return "";
		}

		var dateObj = new Date(date);

		var options = {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		};
		var formattedDate = dateObj.toLocaleDateString("en-US", options);

		return formattedDate;
	}

	// Helper function to parse markdown text.
	function parseMarkdown(mdText) {
		if (mdText && /^<!---mde-->\n\r/i.test(mdText)) {
			mdText = mdText.replace("<!---mde-->\n\r", "");
			mdText = Marked(mdText);
		}

		return mdText;
	}


	// Content Layout definition.
	ContentLayout.prototype = {
		// Specify the versions of the Content REST API that are supported by the this Content Layout.
		// The value for contentVersion follows Semantic Versioning syntax.
		// This allows applications that use the content layout to pass the data through in the expected format.
		contentVersion: ">=1.0.0 <2.0.0",

    getDownloadContent: function(name) {
      var contentClient = this.contentClient;
      debug("Searching for Download Content " + name);
      contentClient.queryItems({
        q: '(type eq "JCOM_DownloadContent") AND (name eq "' + name + '")',
        fields: 'ALL'
      }).then(function(data) {
        if(data.items.length > 0) {
          var downloadContent = data.items[0];
          debug("Found Download content" + downloadContent.id + ", rendering");
          contentClient.renderItem({
            data: {
              contentItemData: downloadContent,
              scsData: {
                contentclient: contentClient
              }
            },
            layout: "JCOM-DownloadContent_Detail",
            container: document.getElementById("DownloadContent")
          }).then(function() {
            debug("Adding download content");
          },
          function (error) {
            console.error('error rendering layout onto the page: ' + JSON.stringify(error));
          });
        }
      });
    },

    hydrate: function(parentObj) {
      var $parentObj = $(parentObj),
      hydrateData = $parentObj.find('#DownloadContent').attr('data-hydrate');
      if(hydrateData) {
        var data = JSON.parse(hydrateData);
        var rulesObj = data.json_rules;
        getEnvDetails();
        var result = processRules(rulesObj, window.envData);
        if(result.action === 'redirect') {
          window.location.replace(result.value);
        }
        debug("Environment detection results\n\tRESULT CONTENT:",result.value,"\n\tCOOKIE:",envData.cookie,"\n\tUserAgent String:",navigator.userAgent);
        this.getDownloadContent(result.value.toLowerCase());
      }
    },

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
				content.fields = content.data;
			}

      if(data.json_rules) {
        var rulesObj = data.json_rules;
        getEnvDetails();
        var result = processRules(rulesObj, window.envData);
        if(result.action === 'redirect') {
          window.location.replace(result.value);
        }
        content.result = result.value;
        content.cookie = envData.cookie;
        content.uas = navigator.userAgent;
        debug("Environment detection results\n\tRESULT CONTENT:",result.value,"\n\tCOOKIE:",envData.cookie,"\n\tUserAgent String:",navigator.userAgent);
        try {
  				// Use Mustache to expand the HTML template with the data.
  				template = Mustache.render(templateHtml, content);

  				// Insert the expanded template into the passed in container.
  				if (template) {
  					$(parentObj).append(template);
            debug("Added jRules template to parent");
  				}
  			} catch (e) {
  				console.error(e.stack);
  			}
        this.getDownloadContent(result.value.toLowerCase());
      }
		}
	};

	return ContentLayout;
});
