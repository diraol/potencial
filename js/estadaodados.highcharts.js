$(function () {
    
    // Parse the data from an inline table using the Highcharts Data plugin
    var serra = Highcharts.data({
    	table: 'freq-serra',
    	startRow: 1,
    	endRow: 6,
    	endColumn: 5,
    	
    	complete: function (options) {
    		
    		// Some further processing of the options
    		options.series.reverse(); // to get the stacking right
    			
    		
    		// Create the chart
    		window.chart = new Highcharts.Chart(Highcharts.merge(options, {
		        colors: ["#C2C7D1", "#AD0303", "#4E7ACC", "#0727A6"],
			    chart: {
			        renderTo: 'container-serra',
			        polar: true,
			        type: 'column'
			    },
			    
			    title: {
			        text: 'Serra'
			    },
			    
			    subtitle: {
			    	text: '.'
			    },
			    
			    pane: {
			    	size: '85%'
			    },
			    
			    legend: {
			    	reversed: true,
			    	align: 'center',
			    	verticalAlign: 'top',
			    	y: 100,
			    	layout: 'vertical'
			    },
			    
			    xAxis: {
			    	tickmarkPlacement: 'on'
			    },
			        
			    yAxis: {
			        min: 0,
			        endOnTick: false,
			        showLastLabel: true,
			        title: {
			        	text: 'Frequency (%)'
			        },
			        labels: {
			        	formatter: function () {
			        		return this.value + '%';
			        	}
			        }
			    },
			    
			    tooltip: {
			    	valueSuffix: '%'
			    },
			        
			    plotOptions: {
			        series: {
			        	stacking: 'normal',
			        	shadow: false,
			        	groupPadding: 0,
			        	pointPlacement: 'on'
			        }
			    }
			}));
			
		}
	});
    

    var dilma = Highcharts.data({
    	table: 'freq-dilma',
    	startRow: 1,
    	endRow: 6,
    	endColumn: 5,
    	
    	complete: function (options) {
    		
    		// Some further processing of the options
    		options.series.reverse(); // to get the stacking right
    			
    		
    		// Create the chart
    		window.chart = new Highcharts.Chart(Highcharts.merge(options, {
		        colors: ["#C2C7D1", "#AD0303", "#4E7ACC", "#0727A6"],
			    chart: {
			        renderTo: 'container-dilma',
			        polar: true,
			        type: 'column'
			    },
			    
			    title: {
			        text: 'Dilma'
			    },
			    
			    subtitle: {
			    	text: '.'
			    },
			    
			    pane: {
			    	size: '85%'
			    },
			    
			    legend: {
			    	reversed: true,
			    	align: 'center',
			    	verticalAlign: 'top',
			    	y: 100,
			    	layout: 'vertical'
			    },
			    
			    xAxis: {
			    	tickmarkPlacement: 'on'
			    },
			        
			    yAxis: {
			        min: 0,
			        endOnTick: false,
			        showLastLabel: true,
			        title: {
			        	text: 'Frequency (%)'
			        },
			        labels: {
			        	formatter: function () {
			        		return this.value + '%';
			        	}
			        }
			    },
			    
			    tooltip: {
			    	valueSuffix: '%'
			    },
			        
			    plotOptions: {
			        series: {
			        	stacking: 'normal',
			        	shadow: false,
			        	groupPadding: 0,
			        	pointPlacement: 'on'
			        }
			    }
			}));
			
		}
	});
});
