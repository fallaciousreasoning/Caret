define(function() {
  
  var cache = {};
  
  return {
    load: async function(name, parentRequire, onLoad, config) {
      if (name in cache)
        return onLoad(cache[name]);
      
      const resolvedUrl = new URL(name, location.origin);
      const response = await fetch(resolvedUrl);
      const text = await response.text();

      cache[name] = text;

      return onLoad(text);
    }
  };
  
});