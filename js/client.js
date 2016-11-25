// Event listeners
$(document).ready(function() {
	var $from = 0, $limit = 12;
	getPokemonItems($from, $limit);

	// On Pokemon item click load Pokemon info
	$('.pokeitems').on('click', '.pokeitem', function() {
		if ($('.pokemon').is(':visible')) {
			$('.pokemon').hide();
		} 
		$('.loader').css('display', 'block');
		getPokemon($(this).data('id'));
	});

	// On button more click load more pokemons
	$('.btn-more button').on('click', function() {
		$from += 12;
		$limit += 12;
		getPokemonItems($from, $limit);
	});

	// Filter pokemons
	$('.pokeitems').on('click', '.category-item', function() {
		var category = $(this).attr('id');
		console.log('obj');
		if(category == 'all') {
			$('.pokeitem-wrapper').hide();
			setTimeout(function() {
				$('.pokeitem-wrapper').show('fast');
			}, 300);
		} else {
			$('.pokeitem-wrapper').hide();
			setTimeout(function() {
				$('.types>span.' + category).parents('.pokeitem-wrapper').show('fast');
			}, 300);
		}
	});
});

// Get info from PokeAPI about particular pokemon
function getPokemon($id) {
	$.getJSON( 'https://pokeapi.co/api/v1/pokemon/' + $id, function( data ) {
		var pokeTypes = [];

		$.each(data.types, function(key, val) {
			pokeTypes.push(val.name);
		})
		console.log(pokeTypes);

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
		if ($('.pokemon').is(':hidden')) {
			$('.pokemon').show();
		} 
		$('.loader').hide();
	});
}

// Get Pokemon items
function getPokemonItems($from, $to) {
	$.getJSON( 'js/data.json', function( data ) {
		var items = [];
		$.each( data.objects.slice($from, $to), function( key, val ) {
			var types = [];

			$.each(val.types, function( key, val ) {
				types.push('<span class="label label-default ' + val.name + '">' + val.name + '</span>');
			});

			items.push( '<div class="pokeitem-wrapper col-xs-12 col-sm-6 col-md-4 col-lg-4"><div class="pokeitem" data-id="' + val.pkdx_id + '"><p class="avatar"><img src="img/pokemon/' + val.pkdx_id + '.png" /></p><h3 class="name">' + val.name + '</h3><p class="types">' + types.join(" ")  + '</p></div></div>' );
		});

		$( '#pokeitems-wrapper' ).append(items.join( '' ));
	});
}