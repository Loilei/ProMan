export let domManager = {
  addChild(parentIdentifier, childContent) {
      let parent = document.querySelector(parentIdentifier);
      if (parent) {
        parent.insertAdjacentHTML("beforeend", childContent);
      } else {
          console.error("could not find such html element: " + parentIdentifier)
      }
  },
  addEventListener(parentIdentifier, eventType, eventHandler) {
      let parent = document.querySelector(parentIdentifier);
      if (parent) {
          parent.addEventListener(eventType, eventHandler);
      } else {
          console.error("could not find such html element: " + parentIdentifier)
      }
  },
  removeAllChildren(parentIdentifier){
      let parent = document.querySelector(parentIdentifier);
      if (parent) {
        parent.replaceChildren();
      } else {
          console.error("could not find such html element: " + parentIdentifier)
      }

  },
  checkParentsExistence(parentIdentifier) { return !!document.querySelector(parentIdentifier) },
  removeChild(childIdentifier) { document.querySelector(childIdentifier).innerHTML = ""},
};
