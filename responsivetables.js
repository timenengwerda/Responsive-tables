
$(document).ready(function () {
	$('.content').createResponsiveTables();
});

$.fn.createResponsiveTables = function () {
	var parentElement = $(this);
	if (parentElement.length) {
		parentElement.find('table').each(function () {
			new ResponsiveTable(parentElement, $(this));
		});
	}
};

function ResponsiveTable (container, table) {
	this.previousButton = false;
	this.nextButton = false;
	this.currentTableSlide = 1;
	this.tableSlideAmount = 0;
	this.topContainer = container;
	//Wrap everything in the topContainer in a overflow div
	//this will function as the table container
	var container = $('<div />').addClass('table-wrapper');
	container.css({
		overflow: 'hidden',
		width: '100%'
	});
	table.wrapAll(container);
	this.container = table.parent('.table-wrapper');
	//Get the table and make it absolute
	this.table = table;
	this.table.css('position', 'absolute');

	var that = this;

	this.checkTable = function () {
		var tableWidth = this.table.width();
		this.table.width(tableWidth);
		var tableHeight = this.table.outerHeight();
		this.container.height(tableHeight);
		this.container.css('max-width', this.topContainer.width());
		this.container.css('position', 'relative');
		var amountOfColumns = this.table.find('thead > tr > td').length;
		var a = 1;

		if (tableWidth > this.container.width()) {
			this.createSlidingTable(table, this.container);
		}
	}

	
	this.createSlidingTable = function () {
		if (!this.previousButton && !this.nextButton) {
			this.previousButton = $('<button/>').html('vorige').addClass('previous').addClass('tableSlideButton');
			this.nextButton = $('<button/>').html('volgende').addClass('next').addClass('tableSlideButton');

			this.container.prepend(this.previousButton);
			this.container.append(this.nextButton);

			this.previousButton.click(function () {
				var goToSlide = that.tableSlideAmount-1;
				if (goToSlide < 1) {
					goToSlide = 1;
				}
				that.animateTable(goToSlide);
			});

			this.nextButton.click(function () {
				var goToSlide = (that.currentTableSlide < that.tableSlideAmount) ? that.currentTableSlide+1 : 1;
				that.animateTable(goToSlide);
			});

		}
		
		this.tableSlideAmount = Math.ceil(this.table.width() / this.container.width());
		//this.currentTableSlide = 1;

		this.checkButtonStatus();

	}

	this.animateTable = function (slideNum) {
		var pos = this.container.width() * (slideNum-1);
		pos = pos *-1;

		this.table.animate({
			left: pos
		}, 500, function () {
			that.currentTableSlide = slideNum;
			that.checkButtonStatus();
		});
	}

	this.checkButtonStatus = function () {
		if (this.tableSlideAmount >= this.currentTableSlide) {
			this.previousButton.show();
		}

		if (this.currentTableSlide < this.tableSlideAmount) {
			this.nextButton.show();
		}

		if (this.currentTableSlide == this.tableSlideAmount) {
			this.nextButton.hide();
		}

		if (this.currentTableSlide == 1 ) {
			this.previousButton.hide();
		}
	}


	this.checkTable();
	$(window).resize(function () {
		that.checkTable();
	});

}