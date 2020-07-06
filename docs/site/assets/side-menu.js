/**
 * Copyright © 2020 Marc Ed. Raffalli
 * https://marc-ed-raffalli.github.io/
 *
 * See LICENCE file
 */
(function () {

  const
    contentItemsSelector = [2, 3, 4]
      .map(lvl => `.content h${lvl}`)
      .join(','),

    view = {
      get sideMenu() {
        return document.querySelector('.side-menu');
      },
      get contentItems() {
        return document.querySelectorAll(contentItemsSelector);
      }
    };

  document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

  function onDOMContentLoaded() {
    const
      tree = buildHierarchyTree(view.contentItems),
      treeRootElt = createHeaderGroup(0);

    appendTreeItems(tree, treeRootElt);

    view.sideMenu.appendChild(treeRootElt);

    scrollHeaderIntoView();
    window.addEventListener('hashchange', scrollHeaderIntoView);

    $('[data-spy="scroll"]').scrollspy({offset: 60});
  }

  function scrollHeaderIntoView() {
    const hash = window.location.hash;
    if (!hash) {
      return;
    }

    scrollIntoView(document.querySelector(hash));
    scrollIntoView(document.querySelector(`.side-menu a[href="${hash}"]`));
  }

  function scrollIntoView(elt) {
    if (elt) {
      elt.scrollIntoView({behavior: 'auto', block: 'nearest'});
    }
  }

  function buildHierarchyTree(headers) {
    const
      tree = {level: 1, children: []},
      state = [tree];

    headers.forEach(elt => {
      const headerNode = {
        level: getHeaderLevel(elt.tagName),
        title: elt.textContent,
        link: `#${elt.id}`,
        children: []
      };

      let parentNode = last(state);

      if (parentNode.level < headerNode.level) {
        parentNode.children.push(headerNode);
        state.push(headerNode);
        return;
      }

      while (parentNode.level >= headerNode.level) {
        state.pop();
        parentNode = last(state);
      }

      parentNode.children.push(headerNode);
      state.push(headerNode);
    });

    return tree;
  }

  function appendTreeItems(node, parentElt) {
    if (node.title) {
      parentElt.appendChild(createHeaderLink(node.level, node.title, node.link));
    }

    if (node.children.length !== 0) {
      const groupElt = createHeaderGroup(node.level + 1);
      parentElt.appendChild(groupElt);

      node.children
        .forEach(childNode => appendTreeItems(childNode, groupElt));
    }
  }

  function createHeaderGroup(level) {
    const nav = document.createElement('nav');
    nav.classList.add('nav', 'flex-column');

    if (level > 2) {
      nav.classList.add('ml-3');
    }

    return nav;
  }

  function createHeaderLink(level, name, href) {
    const a = document.createElement('a');
    a.classList.add('nav-link');
    a.textContent = name;
    a.title = name;
    a.href = href;
    return a;
  }

  function last(arr) {
    return arr[arr.length - 1];
  }

  function getHeaderLevel(tagName) {
    return parseInt(tagName.slice(1));
  }

}());
