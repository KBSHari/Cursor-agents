(function () {
  var ITEMS = ["Alpha", "Alpine", "Beta", "Gamma"];

  function requiredEl(id) {
    var el = document.getElementById(id);
    if (!el) {
      throw new Error("Search demo is missing #" + id);
    }
    return el;
  }

  function matches(query, item) {
    if (query === "") {
      return true;
    }
    return item.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  }

  function render(resultsEl, query) {
    resultsEl.textContent = "";
    for (var i = 0; i < ITEMS.length; i++) {
      var item = ITEMS[i];
      if (!matches(query, item)) {
        continue;
      }
      var li = document.createElement("li");
      li.textContent = item;
      resultsEl.appendChild(li);
    }
  }

  function init() {
    var input = requiredEl("search-input");
    var clear = requiredEl("search-clear");
    var results = requiredEl("search-results");

    function applyFilter() {
      render(results, input.value);
    }

    input.addEventListener("input", applyFilter);
    clear.addEventListener("click", function () {
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    });

    applyFilter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
