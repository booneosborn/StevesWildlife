(function(){
	var model = function(data)
	{
		this.src = "Images/"+data.src;
		this.desc = data.desc;
		this.price = data.price;
		this.category = data.category;
	};

	var ViewModel = function(){
		var vm = this;
		vm.images = ko.observable();
		vm.filteredImages = ko.observable();
		vm.categories = [{value: "All"}, 
						{value: "Deer"}, 
						{value: "Horses"}, 
						{value: "Elk"}, 
						{value: "Birds"}, 
						{value: "Scenery"}, 
						{value: "Misc Animals"}, 
						{value: "Knives"}, 
						{value: "Lamps"}, 
						{value: "Mounts"}];
		vm._selectedCategory = ko.observable('All');

		vm.GetImages = function(){
			vm.getImages();
		};

		vm.SelectCategory = function(cat)
		{
			vm._selectedCategory(cat.value);
			vm.filteredImages(_.filter(vm.images(), function(it){return it.category === vm._selectedCategory() || vm._selectedCategory() === 'All';	}));
		};

		vm.getImages = function(){
			if(vm.images)
			{
				$.get('Scripts/images.xml', function(xml){ 
					var json = $.xml2json(xml);
					var mapped = $.map(json['Image'], function(it){
						return new model(it);
					});
					vm.images(mapped);
					vm.filteredImages(mapped);

				    $('section#gallery ul li').click(function(){
				        $('section#gallery ul li').removeClass('active');
				        $(this).addClass('active');
				    });
				});
			}
		};
	};

	function DropDown(el) {
		this.dd = el;
		this.placeholder = this.dd.children('span');
		this.opts = this.dd.find('ul.dropdown > li');
		this.val = '';
		this.index = -1;
		this.initEvents();
	}
	DropDown.prototype = {
		initEvents : function() {
			var obj = this;

			obj.dd.on('click', function(event){
				$(this).toggleClass('active');
				return false;
			});

			obj.opts.on('click',function(){
				var opt = $(this);
				obj.val = opt.text();
				obj.index = opt.index();
				obj.placeholder.text(obj.val);
			});
		},
		getValue : function() {
			return this.val;
		},
		getIndex : function() {
			return this.index;
		}
	}
	
	$(function() {
		var myVM = new ViewModel();
		ko.applyBindings(myVM);
		myVM.GetImages();

		$("#navigation a").click(function(){
			$("#bizCard").fadeToggle();
		});

		var dd = new DropDown( $('#dd') );
		$(document).click(function() {
			$('.wrapper-dropdown').removeClass('active');
		});
	});
})();