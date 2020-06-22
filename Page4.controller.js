sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.covidDonationsMonitor.controller.Page4", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App5c75e0f3b8a53d010d50c1bd";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onFioriObjectPageHeaderPress: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("default", true);
			}

		},
		getQueryParameters: function(oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		_onDonutChartSelectData: function(oEvent) {
			var oSource = oEvent.getSource();

			return new Promise(function(fnResolve) {
				var aSelectedDataPoints = oSource.getSelectedDataPoints().dataPoints;
				var oBindingContext;
				if (aSelectedDataPoints) {
					oBindingContext = aSelectedDataPoints[aSelectedDataPoints.length - 1].context;
				}

				this.doNavigate("Page1", oBindingContext, fnResolve);
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		formatFractionDigitFromValue: function(sValue) {
			var sNumber;
			if (isNaN(sValue)) {
				sNumber = sValue;
			} else {
				sNumber = Number(sValue).toFixed(2);
			}
			return sNumber;

		},
		_onFioriObjectPageContactListPress: function(oEvent) {

			var oPopover;
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			this.getOwnerComponent().runAsOwner(function() {
				oPopover = oSource.getDependents()[0];
				oPopover.setPlacement("Auto");
			});

			return new Promise(function(fnResolve) {
				oPopover.attachEventOnce("afterOpen", null, fnResolve);
				oPopover.openBy(oSource);
				if (sPath) {
					oPopover.bindElement(sPath);
				}
			}).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		applyFiltersAndSorters: function(sControlId, sAggregationName, chartBindingInfo) {
			if (chartBindingInfo) {
				var oBindingInfo = chartBindingInfo;
			} else {
				var oBindingInfo = this.getView().byId(sControlId).getBindingInfo(sAggregationName);
			}
			var oBindingOptions = this.updateBindingOptions(sControlId);
			this.getView().byId(sControlId).bindAggregation(sAggregationName, {
				model: oBindingInfo.model,
				path: oBindingInfo.path,
				parameters: oBindingInfo.parameters,
				template: oBindingInfo.template,
				templateShareable: true,
				sorter: oBindingOptions.sorters,
				filters: oBindingOptions.filters
			});

		},
		updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var aGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby || oBindingData.groupby === null) {
					aGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = aGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (aGroupby) {
				aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page4").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			var oView = this.getView(),
				oData = {},
				self = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			self.oBindingParameters = {};

			oData["Fiori_ObjectPage_ObjectPage_0-headers-Fiori_ObjectPage_Header-1-kPIs-sap_chart_DonutChart-1592698918813"] = {};

			oData["Fiori_ObjectPage_ObjectPage_0-headers-Fiori_ObjectPage_Header-1-kPIs-sap_chart_DonutChart-1592698918813"]["data"] = [{
				"dim0": "FEDERAL GOVT",
				"mea0": "100000000000",
				"__id": 0
			}, {
				"dim0": "OYO STATE",
				"mea0": "2000000000",
				"__id": 1
			}, {
				"dim0": "KADUNA STATE",
				"mea0": "5000000000",
				"__id": 2
			}, {
				"dim0": "LAGOS STATE",
				"mea0": "20000000000",
				"__id": 3
			}, {
				"dim0": "EKITI STATE",
				"mea0": "1000000000",
				"__id": 4
			}, {
				"dim0": "KANO STATE",
				"mea0": "8000000000",
				"__id": 5
			}];

			self.oBindingParameters['Fiori_ObjectPage_ObjectPage_0-headers-Fiori_ObjectPage_Header-1-kPIs-sap_chart_DonutChart-1592698918813'] = {
				"path": "/Fiori_ObjectPage_ObjectPage_0-headers-Fiori_ObjectPage_Header-1-kPIs-sap_chart_DonutChart-1592698918813/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["Fiori_ObjectPage_ObjectPage_0-headers-Fiori_ObjectPage_Header-1-kPIs-sap_chart_DonutChart-1592698918813"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1-sectionContent-sap_chart_StackedBarChart-1592694567792"] = {};

			oData["Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1-sectionContent-sap_chart_StackedBarChart-1592694567792"]["data"] = [{
				"dim0": "ABIA",
				"mea0": "152605",
				"mea1": "41246",
				"__id": 0
			}, {
				"dim0": "ADAMAWA",
				"mea0": "196401",
				"mea1": "52471",
				"__id": 1
			}, {
				"dim0": "AKWA IBOM",
				"mea0": "405822",
				"mea1": "95867",
				"__id": 2
			}, {
				"dim0": "ANAMBRA",
				"mea0": "121539",
				"mea1": "43146",
				"__id": 3
			}, {
				"dim0": "NIGER",
				"mea0": "329593",
				"mea1": "63957",
				"__id": 4
			}, {
				"dim0": "BAYELSA",
				"mea0": "184876",
				"mea1": "51727",
				"__id": 5
			}, {
				"dim0": "BENUE",
				"mea0": "628463",
				"mea1": "141983",
				"__id": 6
			}, {
				"dim0": "KANO",
				"mea0": "763919",
				"mea1": "151315",
				"__id": 7
			}, {
				"dim0": "CROSS RIVER",
				"mea0": "148482",
				"mea1": "27604",
				"__id": 8
			}, {
				"dim0": "DELTA",
				"mea0": "80644",
				"mea1": "30338",
				"__id": 9
			}, {
				"dim0": "KADUNA",
				"mea0": "358586",
				"mea1": "90794",
				"__id": 10
			}, {
				"dim0": "RIVERS",
				"mea0": "267812",
				"mea1": "73601",
				"__id": 11
			}, {
				"dim0": "OSUN",
				"mea1": "64931",
				"mea0": "218872",
				"__id": 12
			}, {
				"undefined": null,
				"dim0": "KEBBI",
				"mea1": "219102",
				"mea0": "932460",
				"__id": 13
			}, {
				"undefined": null,
				"dim0": "FCT",
				"mea1": "41485",
				"mea0": "156260",
				"__id": 14
			}];

			self.oBindingParameters['Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1-sectionContent-sap_chart_StackedBarChart-1592694567792'] = {
				"path": "/Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1-sectionContent-sap_chart_StackedBarChart-1592694567792/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1-sectionContent-sap_chart_StackedBarChart-1592694567792"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oView.getModel("staticDataModel").setData(oData, true);

			function dateDimensionFormatter(oDimensionValue, sTextValue) {
				var oValueToFormat = sTextValue !== undefined ? sTextValue : oDimensionValue;
				if (oValueToFormat instanceof Date) {
					var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
						style: "short"
					});
					return oFormat.format(oValueToFormat);
				}
				return oValueToFormat;
			}

			var aDimensions = oView.byId("Fiori_ObjectPage_ObjectPage_0-headers-Fiori_ObjectPage_Header-1-kPIs-sap_chart_DonutChart-1592698918813").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1-sectionContent-sap_chart_StackedBarChart-1592694567792").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

		},
		onAfterRendering: function() {

			var oChart,
				self = this,
				oBindingParameters = this.oBindingParameters,
				oView = this.getView();

			oChart = oView.byId("Fiori_ObjectPage_ObjectPage_0-headers-Fiori_ObjectPage_Header-1-kPIs-sap_chart_DonutChart-1592698918813");
			oChart.bindData(oBindingParameters['Fiori_ObjectPage_ObjectPage_0-headers-Fiori_ObjectPage_Header-1-kPIs-sap_chart_DonutChart-1592698918813']);

			oChart = oView.byId("Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1-sectionContent-sap_chart_StackedBarChart-1592694567792");
			oChart.bindData(oBindingParameters['Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-1-sectionContent-sap_chart_StackedBarChart-1592694567792']);

		}
	});
}, /* bExport= */ true);
