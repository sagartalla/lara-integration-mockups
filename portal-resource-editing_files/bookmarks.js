(function() {
  var Bookmark, BookmarksManager, CollectionSelector, CollectionsDomID, EditUrl, InstanceCounter, ItemSelector, SortHandle, SortUrl, bookmark_identify,
    __hasProp = {}.hasOwnProperty;

  InstanceCounter = 0;

  CollectionsDomID = "bookmarks_box";

  CollectionSelector = "#" + CollectionsDomID;

  ItemSelector = "" + CollectionSelector + " .bookmark_item";

  SortHandle = "slide";

  SortUrl = "/portal/bookmarks/sort";

  EditUrl = "/portal/bookmarks/edit";

  bookmark_identify = function(div) {
    return div.readAttribute('data-bookmark-id');
  };

  Bookmark = (function() {

    function Bookmark(div, manager) {
      var _this = this;
      this.div = div;
      this.manager = manager;
      this.id = bookmark_identify(this.div);
      this.editor = this.div.select('div.editor')[0];
      this.edit_button = this.div.select('a.edit')[0];
      this.link_div = this.div.select('a.link_text')[0];
      this.save_button = this.div.select('button.save')[0];
      this.name_field = this.div.select('input[name="name"]')[0];
      this.url_field = this.div.select('input[name="url"]')[0];
      this.is_visible_field = this.div.select('input[name="is_visible"]')[0];
      this.editor_active = false;
      this.is_visible_field.observe('change', function(evt) {
        return _this.saveVisibility();
      });
      this.save_button.observe('click', function(evt) {
        return _this.saveForm();
      });
      this.edit_button.observe('click', function(evt) {
        if (_this.editor_active) {
          return _this.edit(false);
        } else {
          return _this.manager.editBookmark(_this.id);
        }
      });
    }

    Bookmark.prototype.edit = function(v) {
      if (v) {
        this.editor.show();
        this.link_div.hide();
        this.name_field.focus();
      } else {
        this.editor.hide();
        this.link_div.show();
      }
      return this.editor_active = v;
    };

    Bookmark.prototype.update = function(new_name, new_url, new_visibility) {
      this.link_div.update(new_name);
      this.link_div.writeAttribute('href', new_url);
      this.name_field.setValue(new_name);
      this.url_field.setValue(new_url);
      return this.is_visible_field.setValue(new_visibility);
    };

    Bookmark.prototype.saveForm = function() {
      var new_name, new_url;
      this.edit(false);
      new_name = this.name_field.getValue();
      new_url = this.url_field && this.url_field.getValue();
      return this.sendEditReq({
        id: this.id,
        name: new_name,
        url: new_url
      });
    };

    Bookmark.prototype.saveVisibility = function() {
      var new_visibility;
      new_visibility = this.is_visible_field.getValue() === 'true';
      return this.sendEditReq({
        id: this.id,
        is_visible: new_visibility
      });
    };

    Bookmark.prototype.sendEditReq = function(params) {
      var _this = this;
      return new Ajax.Request(EditUrl, {
        method: 'post',
        parameters: params,
        requestHeaders: {
          Accept: 'application/json'
        },
        onSuccess: function(transport) {
          var json;
          json = transport.responseText.evalJSON(true);
          return _this.update(json.name, json.url, json.is_visible);
        },
        onFailure: function(transport) {
          alert("Bookmark update failed. Please reload the page and try again.");
          return _this.div.highlight({
            startcolor: '#ff0000'
          });
        }
      });
    };

    return Bookmark;

  })();

  BookmarksManager = (function() {

    function BookmarksManager() {
      this.bookmarks = {};
      this.addBookmarks();
    }

    BookmarksManager.prototype.addBookmarks = function() {
      var _this = this;
      $$(ItemSelector).each(function(item) {
        return _this.bookmarkForDiv(item);
      });
      return Sortable.create(CollectionsDomID, {
        'tag': 'div',
        'handle': SortHandle,
        'onUpdate': function(divs) {
          return _this.orderChanged(divs);
        }
      });
    };

    BookmarksManager.prototype.bookmarkForDiv = function(div) {
      var id, _base;
      id = bookmark_identify(div);
      return (_base = this.bookmarks)[id] || (_base[id] = new Bookmark(div, this));
    };

    BookmarksManager.prototype.editBookmark = function(id) {
      var idx, mark, _ref;
      this.bookmarks[id].edit(true);
      _ref = this.bookmarks;
      for (idx in _ref) {
        if (!__hasProp.call(_ref, idx)) continue;
        mark = _ref[idx];
        if (Number(idx) !== Number(id)) {
          mark.edit(false);
        }
      }
    };

    BookmarksManager.prototype.orderChanged = function(divs) {
      var results,
        _this = this;
      results = $$(ItemSelector).map(function(div) {
        return _this.bookmarkForDiv(div).id;
      });
      return this.changeOrder(results);
    };

    BookmarksManager.prototype.changeOrder = function(array_of_ids) {
      return new Ajax.Request(SortUrl, {
        method: 'post',
        parameters: {
          ids: Object.toJSON(array_of_ids)
        },
        requestHeaders: {
          Accept: 'application/json'
        },
        onSuccess: function(transport) {},
        onFailure: function(transport) {
          var _this = this;
          alert("Bookmark reorder failed. Please reload the page and try again.");
          return $$(ItemSelector).each(function(item) {
            return item.highlight({
              startcolor: '#ff0000'
            });
          });
        }
      });
    };

    BookmarksManager.prototype.bookmarkRequestStarted = function(button_id, msg) {
      this.setElemEnabled(button_id, false);
      return startWaiting(msg);
    };

    BookmarksManager.prototype.bookmarkRequestFinished = function(button_id) {
      this.setElemEnabled(button_id, true);
      return stopWaiting();
    };

    BookmarksManager.prototype.bookmarkRequestFailed = function() {
      return alert('Bookmark creation failed. Please reload the page and try again.');
    };

    BookmarksManager.prototype.setElemEnabled = function(element_id, val) {
      var elem;
      elem = $(element_id);
      if (val) {
        elem.style.opacity = 1;
        return elem.enable();
      } else {
        elem.style.opacity = 0.2;
        return elem.disable();
      }
    };

    return BookmarksManager;

  })();

  document.observe("dom:loaded", function() {
    return window.bookmarksManager = new BookmarksManager();
  });

}).call(this);
