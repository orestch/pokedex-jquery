var options = {
	from: 0,
	limit: 12,
	pokeitems: '.pokeitems',
	pokeitem: '.pokeitem',
	pokemon: '.pokemon',	
	buttonMore: '.btn-more button',
	pokeitemsWrapper: '#pokeitems-wrapper',
	pokeitemWrapper: '.pokeitem-wrapper',
	filterCategoryButton: '.category-item',
	message: '.message',
	loader: '.loader',
	apiGetPokemonUrl: 'https://pokeapi.co/api/v1/pokemon/',
	animationSpeed: 'fast',
	animationTimeout: 300
};

(function(options) {
	// EVENT LISTENERS
	$(document).ready(function() {
		getPokemonItems(options.from, options.limit);

		// On Pokemon item click load Pokemon info
		$(options.pokeitems).on('click', options.pokeitem, function() {
			getPokemon($(this).data('id'));
		});

		// On button more click load more pokemons
		$(options.buttonMore).on('click', function() {
			var incrementValue = 12;
			options.from += incrementValue;
			options.limit += incrementValue;
			getPokemonItems(options.from, options.limit);
		});

		// Filter pokemons
		$(options.pokeitems).on('click', options.filterCategoryButton, function() {
			filterPokeItems($(this).attr('id'));
		});
	});

	// FUNCTIONS
	// Filter Pokemon items
	function filterPokeItems(category) {
		$(options.message).hide();

			if(category == 'all') {
				$(options.pokeitemWrapper).hide();
				setTimeout(function() {
					$(options.pokeitemWrapper).show(options.animationSpeed);
				}, options.animationTimeout);
			} else {
				$(options.pokeitemWrapper).hide();
				setTimeout(function() {
					if($('.types>span.' + category).length == 0) {
						$(options.message).show();
					};

					$('.types>span.' + category).parents(options.pokeitemWrapper).show(options.animationSpeed);
				}, options.animationTimeout);
			}
	}

	// Get info from PokeAPI about particular pokemon
	function getPokemon($id) {
		if ($(options.pokemon).is(':visible')) {
			$(options.pokemon).hide();
		} 
		$(options.loader).show();

		$.ajax({
			type: 'get',
			url: options.apiGetPokemonUrl + $id + '/',
			crossDomain: true,
			cache: false,
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			success: function(data, textStatus, xhr) {
				var pokeTypes = [];

				$.each(data.types, function(key, val) {
					pokeTypes.push(val.name);
				})

				$('.avatar-big img').first().attr('src', 'img/pokemon/' + data.pkdx_id + '.png');
				$('.type').text(pokeTypes.join("  "));
				$('.pokemon-name').text(data.name);
				$('.attack').text(data.attack);
				$('.defense').text(data.defense);
				$('.hp').text(data.hp);
				$('.sp_atk').text(data.sp_atk);
				$('.sp_def').text(data.sp_def);
				$('.speed').text(data.speed);
				$('.weight').text(data.weight);
				$('.moves').text(data.moves.length);
				if ($(options.pokemon).is(':hidden')) {
					$(options.pokemon).show();
				} 
				$(options.loader).hide();
			},

			error: function (xhr, textStatus, errorThrown) {
				console.log(errorThrown);
			}});
	}

	// Get Pokemon items
	function getPokemonItems(from, to) {
		$(options.message).hide();
		$.getJSON( 'js/data.json', function( data ) {
			var items = [];
			$.each( data.objects.slice(from, to), function( key, val ) {
				var types = [];

				$.each(val.types, function( key, val ) {
					types.push('<span class="label label-default ' + val.name + '">' + val.name + '</span>');
				});

				items.push( '<div class="pokeitem-wrapper col-xs-12 col-sm-6 col-md-4 col-lg-4"><div class="pokeitem" data-id="' + val.pkdx_id + '"><p class="avatar"><img src="img/pokemon/' + val.pkdx_id + '.png" /></p><h3 class="name">' + val.name + '</h3><p class="types">' + types.join(" ")  + '</p></div></div>' );
			});

			$( options.pokeitemsWrapper ).append(items.join( '' ));
		});
	}

})(options);

