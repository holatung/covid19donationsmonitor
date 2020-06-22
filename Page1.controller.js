sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Popover1", "./Popover2",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Popover1, Popover2, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.covidDonationsMonitor.controller.Page1", {
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
		_onFioriAnalyticalListPageHeaderActionsSelectionChange: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var item = oEvent.getParameters();
			if (item && item.getKey) {
				var key = item.getKey();
				oModel.setProperty('/filterHeaderOption', key);
			}

		},
		_onFioriAnalyticalListPageHeaderActionsPress: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var key = oEvent.getSource().getProperty('key');
			oModel.setProperty('/filterHeaderOption', key);

		},
		_onFioriAnalyticalListPageHeaderActionsPress1: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var key = oEvent.getSource().getProperty('key');
			oModel.setProperty('/filterHeaderOption', key);

		},
		_onFioriAnalyticalListPageVisualFilterItemBarChartPress: function(oEvent) {

			var sPopoverName = "Popover1";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover1(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Auto");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		_onFioriAnalyticalListPageVisualFilterItemDonutChartPress: function(oEvent) {

			var sPopoverName = "Popover2";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover2(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Auto");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		_onFioriAnalyticalListPageContentActionsSelectionChange: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var item = oEvent.getParameters();
			if (item && item.getKey) {
				var key = item.getKey();
				oModel.setProperty('/contentView', key);
			}

		},
		_onFioriAnalyticalListPageContentActionsPress: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var oSource = oEvent.getSource();
			var key = oEvent.getSource().getProperty('key');
			oModel.setProperty('/contentView', key);

		},
		_onFioriAnalyticalListPageContentActionsPress1: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var oSource = oEvent.getSource();
			var key = oEvent.getSource().getProperty('key');
			oModel.setProperty('/contentView', key);

		},
		_onFioriAnalyticalListPageContentActionsPress2: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var oSource = oEvent.getSource();
			var key = oEvent.getSource().getProperty('key');
			oModel.setProperty('/contentView', key);

		},
		_onFioriAnalyticalListPageChartContainerPress: function(oEvent) {
			var oSource = oEvent.getSource();
			var oModel = this.getView().getModel('alpModel');
			var oChartContainer = oSource.getParent().getParent();
			var oChart = oChartContainer.getAggregation('items')[1];
			if (oChart) {
				var oVizFrame = oChart.getAggregation('_vizFrame');
				if (oVizFrame) {
					var bFlag = oModel.getProperty('/showLegendAnalyticalChart');
					oVizFrame.setLegendVisible(!bFlag);
					oModel.setProperty('/showLegendAnalyticalChart', !bFlag);
				}
			}

		},
		_onFioriAnalyticalListPageChartContainerPress1: function(oEvent) {
			var oSource = oEvent.getSource();
			var oChartContainer = oSource.getParent().getParent();
			var oChart = oChartContainer.getAggregation('items')[1];
			if (oChart) {
				var oVizFrame = oChart.getAggregation('_vizFrame');
				if (oVizFrame) {
					oVizFrame.zoom({
						direction: 'in'
					});
				}
			}

		},
		_onFioriAnalyticalListPageChartContainerPress2: function(oEvent) {
			var oSource = oEvent.getSource();
			var oChartContainer = oSource.getParent().getParent();
			var oChart = oChartContainer.getAggregation('items')[1];
			if (oChart) {
				var oVizFrame = oChart.getAggregation('_vizFrame');
				if (oVizFrame) {
					oVizFrame.zoom({
						direction: 'out'
					});
				}
			}

		},
		formatFullscreenIconAnalyticalControl: function(bExitFullscreen) {
			if (bExitFullscreen) {
				return 'sap-icon://exit-full-screen';
			}
			return 'sap-icon://full-screen';

		},
		_onFioriAnalyticalListPageChartContainerPress3: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var oSource = oEvent.getSource();
			if (!oModel.getProperty('/exitFullscreenChart')) {
				var oVBox = oSource.getParent().getParent().getParent();
				var oAnalyticalPage = oVBox.getParent().getParent().getParent();
				var oDialog = oAnalyticalPage.getDependents()[0];
				var oChartContainer = oSource.getParent().getParent();
				var index = oVBox.indexOfAggregation('items', oChartContainer);
				oModel.setProperty('/positionInParentAggregation', index);
				oVBox.removeAggregation('items', oChartContainer);
				oDialog.addContent(oChartContainer);
				oModel.setProperty('/exitFullscreenChart', true);
				oDialog.open();
			} else {
				var oAnalyticalPage = oSource.getParent().getParent().getParent().getParent();
				var oDialog = oAnalyticalPage.getDependents()[0];
				var oChartContainer = oDialog.getContent()[0];
				oDialog.removeContent(oChartContainer);
				var oVBox = oAnalyticalPage.getAggregation('content');
				var oVBox1 = oVBox.getAggregation('items')[1];
				var itemsVBox1 = oVBox1.getAggregation('items');
				for (var i = 0; i < itemsVBox1.length; i++) {
					var oVBox2 = itemsVBox1[i];
					if (jQuery(oVBox2.getFocusDomRef()).hasClass('sapSmartTemplatesAnalyticalListPageChartContainer')) {
						var index = oModel.getProperty('/positionInParentAggregation');
						oVBox2.insertAggregation('items', oChartContainer, index);
					}
				}
				oModel.setProperty('/exitFullscreenChart', false);
				oDialog.close();
			}

		},
		_onColumnChartSelectData: function(oEvent) {
			var sControlId = "Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-tablecontent-Fiori_AnalyticalListPage_Table-1";
			var oControl = this.getView().byId(sControlId);

			var aSelectedData = oEvent.getParameter("data");
			var oSourceControl = oEvent.getSource();
			var aDimensions = oSourceControl.getVisibleDimensions();
			var sSourceId = oEvent.getSource().getId();

			return new Promise(function(fnResolve) {
				var aFinalFilters = [];

				var aFilters = [];
				// 1) Filters (with OR)
				if (aSelectedData && aSelectedData.length > 0) {
					aSelectedData.forEach(function(oSelectedData) {
						aDimensions.forEach(function(sDimensionName) {
							aFilters.push(new sap.ui.model.Filter(sDimensionName, sap.ui.model.FilterOperator.EQ, oSelectedData.data[sDimensionName]));
						});
					});
				}

				var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, false)] : [];
				var oBindingOptions = this.updateBindingOptions(sControlId, {
					filters: aFinalFilters
				}, sSourceId);
				var oBindingInfo = oControl.getBindingInfo("items");
				oControl.bindAggregation("items", {
					model: oBindingInfo.model,
					path: oBindingInfo.path,
					parameters: oBindingInfo.parameters,
					template: oBindingInfo.template,
					templateShareable: true,
					sorter: oBindingOptions.sorters,
					filters: oBindingOptions.filters
				});
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
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
		_onFioriAnalyticalListPageTablePress: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var oSource = oEvent.getSource();
			if (!oModel.getProperty('/exitFullscreenTable')) {
				var oVBox = oSource.getParent().getParent().getParent();
				var oAnalyticalPage = oVBox.getParent().getParent().getParent();
				var oDialog = oAnalyticalPage.getDependents()[0];
				var oTable = oSource.getParent().getParent();
				var index = oVBox.indexOfAggregation('items', oTable);
				oModel.setProperty('/positionInParentAggregation', index);
				oVBox.removeAggregation('items', oTable);
				oDialog.addContent(oTable);
				oModel.setProperty('/exitFullscreenTable', true);
				oDialog.open();
			} else {
				var oAnalyticalPage = oSource.getParent().getParent().getParent().getParent();
				var oDialog = oAnalyticalPage.getDependents()[0];
				var oTable = oDialog.getContent()[0];
				oDialog.removeContent(oTable);
				var oVBox = oAnalyticalPage.getAggregation('content');
				var oVBox1 = oVBox.getAggregation('items')[1];
				var itemsVBox1 = oVBox1.getAggregation('items');
				for (var i = 0; i < itemsVBox1.length; i++) {
					var oVBox2 = itemsVBox1[i];
					if (jQuery(oVBox2.getFocusDomRef()).hasClass('sapSmartTemplatesAnalyticalListPageTableContainer')) {
						var index = oModel.getProperty('/positionInParentAggregation');
						oVBox2.insertAggregation('items', oTable, index);
					}
				}
				oModel.setProperty('/exitFullscreenTable', false);
				oDialog.close();
			}

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
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, 'alpModel');
			oModel.setProperty('/filterHeaderOption', 'visual');
			oModel.setProperty('/exitFullscreenTable', false);
			oModel.setProperty('/contentView', 'charttable');
			oModel.setProperty('/exitFullscreenChart', false);
			oModel.setProperty('/showLegendAnalyticalChart', true);

			var oView = this.getView(),
				oData = {},
				self = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			self.oBindingParameters = {};

			oData["Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_ColumnChart-1"] = {};

			oData["Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_ColumnChart-1"]["data"] = [{
				"dim0": "Ogun",
				"mea0": "296",
				"__id": 0
			}, {
				"dim0": "Abia",
				"mea0": "133",
				"__id": 1
			}, {
				"dim0": "Kano",
				"mea0": "489",
				"__id": 2
			}, {
				"dim0": "FCT",
				"mea0": "270",
				"__id": 3
			}, {
				"dim0": "Lagos",
				"mea0": "350",
				"__id": 4
			}, {
				"dim0": "Edo",
				"mea0": "190",
				"__id": 5
			}, {
				"undefined": null,
				"dim0": "Gombe",
				"mea0": "246",
				"__id": 6
			}, {
				"undefined": null,
				"dim0": "Bauchi",
				"mea0": "209",
				"__id": 7
			}, {
				"undefined": null,
				"dim0": "Kebbi",
				"mea0": "230",
				"__id": 8
			}, {
				"undefined": null,
				"dim0": "Enugu",
				"mea0": "160",
				"__id": 9
			}, {
				"dim0": "Rivers",
				"mea0": "320",
				"__id": 10
			}, {
				"undefined": null,
				"dim0": "Kwara",
				"mea0": "212",
				"__id": 11
			}];

			self.oBindingParameters['Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_ColumnChart-1'] = {
				"path": "/Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_ColumnChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_ColumnChart-1"]["vizProperties"] = {
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

			var aDimensions = oView.byId("Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_ColumnChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

		},
		onExit: function() {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-tablecontent-Fiori_AnalyticalListPage_Table-1",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				if (oControl) {
					for (var j = 0; j < aControls[i].groups.length; j++) {
						var sAggregationName = aControls[i].groups[j];
						var oBindingInfo = oControl.getBindingInfo(sAggregationName);
						if (oBindingInfo) {
							var oTemplate = oBindingInfo.template;
							oTemplate.destroy();
						}
					}
				}
			}

		},
		onAfterRendering: function() {

			var oChart,
				self = this,
				oBindingParameters = this.oBindingParameters,
				oView = this.getView();

			oChart = oView.byId("Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_ColumnChart-1");
			oChart.bindData(oBindingParameters['Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_ColumnChart-1']);

		}
	});
}, /* bExport= */ true);
