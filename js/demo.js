var Movie = Backbone.Model.extend({
	validate: function (attrs) {
		if (!_.isString(attrs.title) || attrs.title.length === 0 ) {
			return "Don't be silly, a movie without a title!?";
		}
	}
});

var Movies = Backbone.Collection.extend({
	model: Movie,
	url: 'api/movies',
});

var movie = new Movie();

movie.on("error", function(model, error) {
  console.log(error);
});

var movies = new Movies();

var MovieView = Backbone.View.extend({
		tagName: "li",
		template: _.template($('#item-template').html()),
		initialize: function() {
			/*
			this.model.bind('change', this.render, this);
			*/			
			this.model.bind('destroy', this.remove, this);
		},
		render: function() {
			console.log('Rendering MovieView.');
			$(this.el).html(this.template(this.model.toJSON()));
      return this;
		},
		events: {
			"click": "deleteMovie",
		},
		deleteMovie: function() {
			console.log('Destroying ' + this.model.get('title'));
			this.model.destroy();
		},
		remove: function() {
			$(this.el).remove();
		}
});

var AppView = Backbone.View.extend({
		el: $('#app'), // not really neccessary
		initialize: function() {
			console.log('Initializing AppView.');
			movies.bind('add', this.addOne, this);		
			movies.bind('reset', this.addAll, this);
			movies.bind('all', this.render, this);
			movies.fetch();
		},
		addOne: function(movie) {
			console.log('Adding a MovieView.');
			var movieView = new MovieView({model: movie});
			$("#movie-list").append(movieView.render().el);
		},
		addAll: function() {
			console.log('Adding all MovieViews.');
			movies.each(this.addOne);
		},
		render: function() {
			console.log('Rendering AppView.');
		},
		events: {
			"click #add-movie": "addMovie",
		},
		addMovie: function() {
			movies.create({id: guid(), "title": $('#movie-title').val(), "year": $('#movie-year').val()});
		},
});

var app = new AppView();