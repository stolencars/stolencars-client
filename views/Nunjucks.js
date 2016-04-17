const Nunjucks = require('nunjucks');
const DateFilter = require('nunjucks-date-filter');

const engine = {};

engine.compile = function (src, options) {
    var template = Nunjucks.compile(src, options.environment);
    return function (context) {
        return template.render(context);
    };
};

engine.prepare = function (options, next) {
    options.compileOptions.environment = Nunjucks.configure(options.path, { watch : false });
    DateFilter.install(options.compileOptions.environment);
    Object.keys(engine.customHelpers).forEach(function(name){
        options.compileOptions.environment.addGlobal(name, engine.customHelpers[name]);
    });
    return next();
};

engine.registerHelper = function(name, helper) {
  engine.customHelpers = engine.customHelpers || [];
  engine.customHelpers[name] = helper;
};

module.exports = engine;
