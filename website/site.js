var searchForm = document.querySelector(".people-search");
var searchInput = document.querySelector(".people-search input");
var people = document.querySelectorAll(".people li");
var peopleEmpty = document.querySelector(".people-empty");

function normalized(text) {
  return text.toLowerCase().replace(/\s+/g, " ");
}

function clearHighlights(person) {
  var marks = person.querySelectorAll("mark");
  marks.forEach(function (mark) {
    var parent = mark.parentNode;
    if (!parent) {
      return;
    }
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}

function highlightNode(node, word) {
  if (node.nodeType === 3) {
    var text = node.nodeValue;
    if (!text) {
      return;
    }
    var index = text.toLowerCase().indexOf(word);
    if (index === -1) {
      return;
    }
    var mark = document.createElement("mark");
    var rest = document.createTextNode(text.slice(index + word.length));
    mark.textContent = text.slice(index, index + word.length);
    node.nodeValue = text.slice(0, index);
    if (node.parentNode) {
      node.parentNode.insertBefore(mark, node.nextSibling);
      node.parentNode.insertBefore(rest, mark.nextSibling);
    }
    highlightNode(rest, word);
    return;
  }
  if (node.nodeType === 1 && node.tagName !== "MARK") {
    var children = [];
    node.childNodes.forEach(function (child) {
      children.push(child);
    });
    children.forEach(function (child) {
      highlightNode(child, word);
    });
  }
}

function highlightPerson(person, query) {
  var words = query.split(" ");
  words.forEach(function (word) {
    if (word) {
      highlightNode(person, word);
    }
  });
}

function filterPeople() {
  var query = "";
  if (searchInput) {
    query = normalized(searchInput.value.trim());
  }
  var shown = 0;
  people.forEach(function (person) {
    clearHighlights(person);
    var text = normalized(person.textContent);
    var match = query === "" || text.indexOf(query) !== -1;
    person.hidden = !match;
    if (match && query !== "") {
      highlightPerson(person, query);
      shown = shown + 1;
    }
    if (match && query === "") {
      shown = shown + 1;
    }
  });
  if (peopleEmpty) {
    peopleEmpty.hidden = shown !== 0;
  }
}

if (searchForm) {
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", filterPeople);
  searchInput.addEventListener("search", filterPeople);
}
