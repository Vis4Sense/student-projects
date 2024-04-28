/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@mozilla/readability/Readability-readerable.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@mozilla/readability/Readability-readerable.js ***!
  \*********************************************************************/
/***/ ((module) => {

/*
 * Copyright (c) 2010 Arc90 Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * This code is heavily based on Arc90's readability.js (1.7.1) script
 * available at: http://code.google.com/p/arc90labs-readability
 */

var REGEXPS = {
  // NOTE: These two regular expressions are duplicated in
  // Readability.js. Please keep both copies in sync.
  unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,
  okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i,
};

function isNodeVisible(node) {
  // Have to null-check node.style and node.className.indexOf to deal with SVG and MathML nodes.
  return (!node.style || node.style.display != "none")
    && !node.hasAttribute("hidden")
    //check for "fallback-image" so that wikimedia math images are displayed
    && (!node.hasAttribute("aria-hidden") || node.getAttribute("aria-hidden") != "true" || (node.className && node.className.indexOf && node.className.indexOf("fallback-image") !== -1));
}

/**
 * Decides whether or not the document is reader-able without parsing the whole thing.
 * @param {Object} options Configuration object.
 * @param {number} [options.minContentLength=140] The minimum node content length used to decide if the document is readerable.
 * @param {number} [options.minScore=20] The minumum cumulated 'score' used to determine if the document is readerable.
 * @param {Function} [options.visibilityChecker=isNodeVisible] The function used to determine if a node is visible.
 * @return {boolean} Whether or not we suspect Readability.parse() will suceeed at returning an article object.
 */
function isProbablyReaderable(doc, options = {}) {
  // For backward compatibility reasons 'options' can either be a configuration object or the function used
  // to determine if a node is visible.
  if (typeof options == "function") {
    options = { visibilityChecker: options };
  }

  var defaultOptions = { minScore: 20, minContentLength: 140, visibilityChecker: isNodeVisible };
  options = Object.assign(defaultOptions, options);

  var nodes = doc.querySelectorAll("p, pre, article");

  // Get <div> nodes which have <br> node(s) and append them into the `nodes` variable.
  // Some articles' DOM structures might look like
  // <div>
  //   Sentences<br>
  //   <br>
  //   Sentences<br>
  // </div>
  var brNodes = doc.querySelectorAll("div > br");
  if (brNodes.length) {
    var set = new Set(nodes);
    [].forEach.call(brNodes, function (node) {
      set.add(node.parentNode);
    });
    nodes = Array.from(set);
  }

  var score = 0;
  // This is a little cheeky, we use the accumulator 'score' to decide what to return from
  // this callback:
  return [].some.call(nodes, function (node) {
    if (!options.visibilityChecker(node)) {
      return false;
    }

    var matchString = node.className + " " + node.id;
    if (REGEXPS.unlikelyCandidates.test(matchString) &&
        !REGEXPS.okMaybeItsACandidate.test(matchString)) {
      return false;
    }

    if (node.matches("li p")) {
      return false;
    }

    var textContentLength = node.textContent.trim().length;
    if (textContentLength < options.minContentLength) {
      return false;
    }

    score += Math.sqrt(textContentLength - options.minContentLength);

    if (score > options.minScore) {
      return true;
    }
    return false;
  });
}

if (true) {
  /* global module */
  module.exports = isProbablyReaderable;
}


/***/ }),

/***/ "./node_modules/@mozilla/readability/Readability.js":
/*!**********************************************************!*\
  !*** ./node_modules/@mozilla/readability/Readability.js ***!
  \**********************************************************/
/***/ ((module) => {

/*
 * Copyright (c) 2010 Arc90 Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * This code is heavily based on Arc90's readability.js (1.7.1) script
 * available at: http://code.google.com/p/arc90labs-readability
 */

/**
 * Public constructor.
 * @param {HTMLDocument} doc     The document to parse.
 * @param {Object}       options The options object.
 */
function Readability(doc, options) {
  // In some older versions, people passed a URI as the first argument. Cope:
  if (options && options.documentElement) {
    doc = options;
    options = arguments[2];
  } else if (!doc || !doc.documentElement) {
    throw new Error("First argument to Readability constructor should be a document object.");
  }
  options = options || {};

  this._doc = doc;
  this._docJSDOMParser = this._doc.firstChild.__JSDOMParser__;
  this._articleTitle = null;
  this._articleByline = null;
  this._articleDir = null;
  this._articleSiteName = null;
  this._attempts = [];

  // Configurable options
  this._debug = !!options.debug;
  this._maxElemsToParse = options.maxElemsToParse || this.DEFAULT_MAX_ELEMS_TO_PARSE;
  this._nbTopCandidates = options.nbTopCandidates || this.DEFAULT_N_TOP_CANDIDATES;
  this._charThreshold = options.charThreshold || this.DEFAULT_CHAR_THRESHOLD;
  this._classesToPreserve = this.CLASSES_TO_PRESERVE.concat(options.classesToPreserve || []);
  this._keepClasses = !!options.keepClasses;
  this._serializer = options.serializer || function(el) {
    return el.innerHTML;
  };
  this._disableJSONLD = !!options.disableJSONLD;
  this._allowedVideoRegex = options.allowedVideoRegex || this.REGEXPS.videos;

  // Start with all flags set
  this._flags = this.FLAG_STRIP_UNLIKELYS |
                this.FLAG_WEIGHT_CLASSES |
                this.FLAG_CLEAN_CONDITIONALLY;


  // Control whether log messages are sent to the console
  if (this._debug) {
    let logNode = function(node) {
      if (node.nodeType == node.TEXT_NODE) {
        return `${node.nodeName} ("${node.textContent}")`;
      }
      let attrPairs = Array.from(node.attributes || [], function(attr) {
        return `${attr.name}="${attr.value}"`;
      }).join(" ");
      return `<${node.localName} ${attrPairs}>`;
    };
    this.log = function () {
      if (typeof console !== "undefined") {
        let args = Array.from(arguments, arg => {
          if (arg && arg.nodeType == this.ELEMENT_NODE) {
            return logNode(arg);
          }
          return arg;
        });
        args.unshift("Reader: (Readability)");
        console.log.apply(console, args);
      } else if (typeof dump !== "undefined") {
        /* global dump */
        var msg = Array.prototype.map.call(arguments, function(x) {
          return (x && x.nodeName) ? logNode(x) : x;
        }).join(" ");
        dump("Reader: (Readability) " + msg + "\n");
      }
    };
  } else {
    this.log = function () {};
  }
}

Readability.prototype = {
  FLAG_STRIP_UNLIKELYS: 0x1,
  FLAG_WEIGHT_CLASSES: 0x2,
  FLAG_CLEAN_CONDITIONALLY: 0x4,

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,

  // Max number of nodes supported by this parser. Default: 0 (no limit)
  DEFAULT_MAX_ELEMS_TO_PARSE: 0,

  // The number of top candidates to consider when analysing how
  // tight the competition is among candidates.
  DEFAULT_N_TOP_CANDIDATES: 5,

  // Element tags to score by default.
  DEFAULT_TAGS_TO_SCORE: "section,h2,h3,h4,h5,h6,p,td,pre".toUpperCase().split(","),

  // The default number of chars an article must have in order to return a result
  DEFAULT_CHAR_THRESHOLD: 500,

  // All of the regular expressions in use within readability.
  // Defined up here so we don't instantiate them repeatedly in loops.
  REGEXPS: {
    // NOTE: These two regular expressions are duplicated in
    // Readability-readerable.js. Please keep both copies in sync.
    unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,
    okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i,

    positive: /article|body|content|entry|hentry|h-entry|main|page|pagination|post|text|blog|story/i,
    negative: /-ad-|hidden|^hid$| hid$| hid |^hid |banner|combx|comment|com-|contact|foot|footer|footnote|gdpr|masthead|media|meta|outbrain|promo|related|scroll|share|shoutbox|sidebar|skyscraper|sponsor|shopping|tags|tool|widget/i,
    extraneous: /print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single|utility/i,
    byline: /byline|author|dateline|writtenby|p-author/i,
    replaceFonts: /<(\/?)font[^>]*>/gi,
    normalize: /\s{2,}/g,
    videos: /\/\/(www\.)?((dailymotion|youtube|youtube-nocookie|player\.vimeo|v\.qq)\.com|(archive|upload\.wikimedia)\.org|player\.twitch\.tv)/i,
    shareElements: /(\b|_)(share|sharedaddy)(\b|_)/i,
    nextLink: /(next|weiter|continue|>([^\|]|$)|»([^\|]|$))/i,
    prevLink: /(prev|earl|old|new|<|«)/i,
    tokenize: /\W+/g,
    whitespace: /^\s*$/,
    hasContent: /\S$/,
    hashUrl: /^#.+/,
    srcsetUrl: /(\S+)(\s+[\d.]+[xw])?(\s*(?:,|$))/g,
    b64DataUrl: /^data:\s*([^\s;,]+)\s*;\s*base64\s*,/i,
    // Commas as used in Latin, Sindhi, Chinese and various other scripts.
    // see: https://en.wikipedia.org/wiki/Comma#Comma_variants
    commas: /\u002C|\u060C|\uFE50|\uFE10|\uFE11|\u2E41|\u2E34|\u2E32|\uFF0C/g,
    // See: https://schema.org/Article
    jsonLdArticleTypes: /^Article|AdvertiserContentArticle|NewsArticle|AnalysisNewsArticle|AskPublicNewsArticle|BackgroundNewsArticle|OpinionNewsArticle|ReportageNewsArticle|ReviewNewsArticle|Report|SatiricalArticle|ScholarlyArticle|MedicalScholarlyArticle|SocialMediaPosting|BlogPosting|LiveBlogPosting|DiscussionForumPosting|TechArticle|APIReference$/
  },

  UNLIKELY_ROLES: [ "menu", "menubar", "complementary", "navigation", "alert", "alertdialog", "dialog" ],

  DIV_TO_P_ELEMS: new Set([ "BLOCKQUOTE", "DL", "DIV", "IMG", "OL", "P", "PRE", "TABLE", "UL" ]),

  ALTER_TO_DIV_EXCEPTIONS: ["DIV", "ARTICLE", "SECTION", "P"],

  PRESENTATIONAL_ATTRIBUTES: [ "align", "background", "bgcolor", "border", "cellpadding", "cellspacing", "frame", "hspace", "rules", "style", "valign", "vspace" ],

  DEPRECATED_SIZE_ATTRIBUTE_ELEMS: [ "TABLE", "TH", "TD", "HR", "PRE" ],

  // The commented out elements qualify as phrasing content but tend to be
  // removed by readability when put into paragraphs, so we ignore them here.
  PHRASING_ELEMS: [
    // "CANVAS", "IFRAME", "SVG", "VIDEO",
    "ABBR", "AUDIO", "B", "BDO", "BR", "BUTTON", "CITE", "CODE", "DATA",
    "DATALIST", "DFN", "EM", "EMBED", "I", "IMG", "INPUT", "KBD", "LABEL",
    "MARK", "MATH", "METER", "NOSCRIPT", "OBJECT", "OUTPUT", "PROGRESS", "Q",
    "RUBY", "SAMP", "SCRIPT", "SELECT", "SMALL", "SPAN", "STRONG", "SUB",
    "SUP", "TEXTAREA", "TIME", "VAR", "WBR"
  ],

  // These are the classes that readability sets itself.
  CLASSES_TO_PRESERVE: [ "page" ],

  // These are the list of HTML entities that need to be escaped.
  HTML_ESCAPE_MAP: {
    "lt": "<",
    "gt": ">",
    "amp": "&",
    "quot": '"',
    "apos": "'",
  },

  /**
   * Run any post-process modifications to article content as necessary.
   *
   * @param Element
   * @return void
  **/
  _postProcessContent: function(articleContent) {
    // Readability cannot open relative uris so we convert them to absolute uris.
    this._fixRelativeUris(articleContent);

    this._simplifyNestedElements(articleContent);

    if (!this._keepClasses) {
      // Remove classes.
      this._cleanClasses(articleContent);
    }
  },

  /**
   * Iterates over a NodeList, calls `filterFn` for each node and removes node
   * if function returned `true`.
   *
   * If function is not passed, removes all the nodes in node list.
   *
   * @param NodeList nodeList The nodes to operate on
   * @param Function filterFn the function to use as a filter
   * @return void
   */
  _removeNodes: function(nodeList, filterFn) {
    // Avoid ever operating on live node lists.
    if (this._docJSDOMParser && nodeList._isLiveNodeList) {
      throw new Error("Do not pass live node lists to _removeNodes");
    }
    for (var i = nodeList.length - 1; i >= 0; i--) {
      var node = nodeList[i];
      var parentNode = node.parentNode;
      if (parentNode) {
        if (!filterFn || filterFn.call(this, node, i, nodeList)) {
          parentNode.removeChild(node);
        }
      }
    }
  },

  /**
   * Iterates over a NodeList, and calls _setNodeTag for each node.
   *
   * @param NodeList nodeList The nodes to operate on
   * @param String newTagName the new tag name to use
   * @return void
   */
  _replaceNodeTags: function(nodeList, newTagName) {
    // Avoid ever operating on live node lists.
    if (this._docJSDOMParser && nodeList._isLiveNodeList) {
      throw new Error("Do not pass live node lists to _replaceNodeTags");
    }
    for (const node of nodeList) {
      this._setNodeTag(node, newTagName);
    }
  },

  /**
   * Iterate over a NodeList, which doesn't natively fully implement the Array
   * interface.
   *
   * For convenience, the current object context is applied to the provided
   * iterate function.
   *
   * @param  NodeList nodeList The NodeList.
   * @param  Function fn       The iterate function.
   * @return void
   */
  _forEachNode: function(nodeList, fn) {
    Array.prototype.forEach.call(nodeList, fn, this);
  },

  /**
   * Iterate over a NodeList, and return the first node that passes
   * the supplied test function
   *
   * For convenience, the current object context is applied to the provided
   * test function.
   *
   * @param  NodeList nodeList The NodeList.
   * @param  Function fn       The test function.
   * @return void
   */
  _findNode: function(nodeList, fn) {
    return Array.prototype.find.call(nodeList, fn, this);
  },

  /**
   * Iterate over a NodeList, return true if any of the provided iterate
   * function calls returns true, false otherwise.
   *
   * For convenience, the current object context is applied to the
   * provided iterate function.
   *
   * @param  NodeList nodeList The NodeList.
   * @param  Function fn       The iterate function.
   * @return Boolean
   */
  _someNode: function(nodeList, fn) {
    return Array.prototype.some.call(nodeList, fn, this);
  },

  /**
   * Iterate over a NodeList, return true if all of the provided iterate
   * function calls return true, false otherwise.
   *
   * For convenience, the current object context is applied to the
   * provided iterate function.
   *
   * @param  NodeList nodeList The NodeList.
   * @param  Function fn       The iterate function.
   * @return Boolean
   */
  _everyNode: function(nodeList, fn) {
    return Array.prototype.every.call(nodeList, fn, this);
  },

  /**
   * Concat all nodelists passed as arguments.
   *
   * @return ...NodeList
   * @return Array
   */
  _concatNodeLists: function() {
    var slice = Array.prototype.slice;
    var args = slice.call(arguments);
    var nodeLists = args.map(function(list) {
      return slice.call(list);
    });
    return Array.prototype.concat.apply([], nodeLists);
  },

  _getAllNodesWithTag: function(node, tagNames) {
    if (node.querySelectorAll) {
      return node.querySelectorAll(tagNames.join(","));
    }
    return [].concat.apply([], tagNames.map(function(tag) {
      var collection = node.getElementsByTagName(tag);
      return Array.isArray(collection) ? collection : Array.from(collection);
    }));
  },

  /**
   * Removes the class="" attribute from every element in the given
   * subtree, except those that match CLASSES_TO_PRESERVE and
   * the classesToPreserve array from the options object.
   *
   * @param Element
   * @return void
   */
  _cleanClasses: function(node) {
    var classesToPreserve = this._classesToPreserve;
    var className = (node.getAttribute("class") || "")
      .split(/\s+/)
      .filter(function(cls) {
        return classesToPreserve.indexOf(cls) != -1;
      })
      .join(" ");

    if (className) {
      node.setAttribute("class", className);
    } else {
      node.removeAttribute("class");
    }

    for (node = node.firstElementChild; node; node = node.nextElementSibling) {
      this._cleanClasses(node);
    }
  },

  /**
   * Converts each <a> and <img> uri in the given element to an absolute URI,
   * ignoring #ref URIs.
   *
   * @param Element
   * @return void
   */
  _fixRelativeUris: function(articleContent) {
    var baseURI = this._doc.baseURI;
    var documentURI = this._doc.documentURI;
    function toAbsoluteURI(uri) {
      // Leave hash links alone if the base URI matches the document URI:
      if (baseURI == documentURI && uri.charAt(0) == "#") {
        return uri;
      }

      // Otherwise, resolve against base URI:
      try {
        return new URL(uri, baseURI).href;
      } catch (ex) {
        // Something went wrong, just return the original:
      }
      return uri;
    }

    var links = this._getAllNodesWithTag(articleContent, ["a"]);
    this._forEachNode(links, function(link) {
      var href = link.getAttribute("href");
      if (href) {
        // Remove links with javascript: URIs, since
        // they won't work after scripts have been removed from the page.
        if (href.indexOf("javascript:") === 0) {
          // if the link only contains simple text content, it can be converted to a text node
          if (link.childNodes.length === 1 && link.childNodes[0].nodeType === this.TEXT_NODE) {
            var text = this._doc.createTextNode(link.textContent);
            link.parentNode.replaceChild(text, link);
          } else {
            // if the link has multiple children, they should all be preserved
            var container = this._doc.createElement("span");
            while (link.firstChild) {
              container.appendChild(link.firstChild);
            }
            link.parentNode.replaceChild(container, link);
          }
        } else {
          link.setAttribute("href", toAbsoluteURI(href));
        }
      }
    });

    var medias = this._getAllNodesWithTag(articleContent, [
      "img", "picture", "figure", "video", "audio", "source"
    ]);

    this._forEachNode(medias, function(media) {
      var src = media.getAttribute("src");
      var poster = media.getAttribute("poster");
      var srcset = media.getAttribute("srcset");

      if (src) {
        media.setAttribute("src", toAbsoluteURI(src));
      }

      if (poster) {
        media.setAttribute("poster", toAbsoluteURI(poster));
      }

      if (srcset) {
        var newSrcset = srcset.replace(this.REGEXPS.srcsetUrl, function(_, p1, p2, p3) {
          return toAbsoluteURI(p1) + (p2 || "") + p3;
        });

        media.setAttribute("srcset", newSrcset);
      }
    });
  },

  _simplifyNestedElements: function(articleContent) {
    var node = articleContent;

    while (node) {
      if (node.parentNode && ["DIV", "SECTION"].includes(node.tagName) && !(node.id && node.id.startsWith("readability"))) {
        if (this._isElementWithoutContent(node)) {
          node = this._removeAndGetNext(node);
          continue;
        } else if (this._hasSingleTagInsideElement(node, "DIV") || this._hasSingleTagInsideElement(node, "SECTION")) {
          var child = node.children[0];
          for (var i = 0; i < node.attributes.length; i++) {
            child.setAttribute(node.attributes[i].name, node.attributes[i].value);
          }
          node.parentNode.replaceChild(child, node);
          node = child;
          continue;
        }
      }

      node = this._getNextNode(node);
    }
  },

  /**
   * Get the article title as an H1.
   *
   * @return string
   **/
  _getArticleTitle: function() {
    var doc = this._doc;
    var curTitle = "";
    var origTitle = "";

    try {
      curTitle = origTitle = doc.title.trim();

      // If they had an element with id "title" in their HTML
      if (typeof curTitle !== "string")
        curTitle = origTitle = this._getInnerText(doc.getElementsByTagName("title")[0]);
    } catch (e) {/* ignore exceptions setting the title. */}

    var titleHadHierarchicalSeparators = false;
    function wordCount(str) {
      return str.split(/\s+/).length;
    }

    // If there's a separator in the title, first remove the final part
    if ((/ [\|\-\\\/>»] /).test(curTitle)) {
      titleHadHierarchicalSeparators = / [\\\/>»] /.test(curTitle);
      curTitle = origTitle.replace(/(.*)[\|\-\\\/>»] .*/gi, "$1");

      // If the resulting title is too short (3 words or fewer), remove
      // the first part instead:
      if (wordCount(curTitle) < 3)
        curTitle = origTitle.replace(/[^\|\-\\\/>»]*[\|\-\\\/>»](.*)/gi, "$1");
    } else if (curTitle.indexOf(": ") !== -1) {
      // Check if we have an heading containing this exact string, so we
      // could assume it's the full title.
      var headings = this._concatNodeLists(
        doc.getElementsByTagName("h1"),
        doc.getElementsByTagName("h2")
      );
      var trimmedTitle = curTitle.trim();
      var match = this._someNode(headings, function(heading) {
        return heading.textContent.trim() === trimmedTitle;
      });

      // If we don't, let's extract the title out of the original title string.
      if (!match) {
        curTitle = origTitle.substring(origTitle.lastIndexOf(":") + 1);

        // If the title is now too short, try the first colon instead:
        if (wordCount(curTitle) < 3) {
          curTitle = origTitle.substring(origTitle.indexOf(":") + 1);
          // But if we have too many words before the colon there's something weird
          // with the titles and the H tags so let's just use the original title instead
        } else if (wordCount(origTitle.substr(0, origTitle.indexOf(":"))) > 5) {
          curTitle = origTitle;
        }
      }
    } else if (curTitle.length > 150 || curTitle.length < 15) {
      var hOnes = doc.getElementsByTagName("h1");

      if (hOnes.length === 1)
        curTitle = this._getInnerText(hOnes[0]);
    }

    curTitle = curTitle.trim().replace(this.REGEXPS.normalize, " ");
    // If we now have 4 words or fewer as our title, and either no
    // 'hierarchical' separators (\, /, > or ») were found in the original
    // title or we decreased the number of words by more than 1 word, use
    // the original title.
    var curTitleWordCount = wordCount(curTitle);
    if (curTitleWordCount <= 4 &&
        (!titleHadHierarchicalSeparators ||
         curTitleWordCount != wordCount(origTitle.replace(/[\|\-\\\/>»]+/g, "")) - 1)) {
      curTitle = origTitle;
    }

    return curTitle;
  },

  /**
   * Prepare the HTML document for readability to scrape it.
   * This includes things like stripping javascript, CSS, and handling terrible markup.
   *
   * @return void
   **/
  _prepDocument: function() {
    var doc = this._doc;

    // Remove all style tags in head
    this._removeNodes(this._getAllNodesWithTag(doc, ["style"]));

    if (doc.body) {
      this._replaceBrs(doc.body);
    }

    this._replaceNodeTags(this._getAllNodesWithTag(doc, ["font"]), "SPAN");
  },

  /**
   * Finds the next node, starting from the given node, and ignoring
   * whitespace in between. If the given node is an element, the same node is
   * returned.
   */
  _nextNode: function (node) {
    var next = node;
    while (next
        && (next.nodeType != this.ELEMENT_NODE)
        && this.REGEXPS.whitespace.test(next.textContent)) {
      next = next.nextSibling;
    }
    return next;
  },

  /**
   * Replaces 2 or more successive <br> elements with a single <p>.
   * Whitespace between <br> elements are ignored. For example:
   *   <div>foo<br>bar<br> <br><br>abc</div>
   * will become:
   *   <div>foo<br>bar<p>abc</p></div>
   */
  _replaceBrs: function (elem) {
    this._forEachNode(this._getAllNodesWithTag(elem, ["br"]), function(br) {
      var next = br.nextSibling;

      // Whether 2 or more <br> elements have been found and replaced with a
      // <p> block.
      var replaced = false;

      // If we find a <br> chain, remove the <br>s until we hit another node
      // or non-whitespace. This leaves behind the first <br> in the chain
      // (which will be replaced with a <p> later).
      while ((next = this._nextNode(next)) && (next.tagName == "BR")) {
        replaced = true;
        var brSibling = next.nextSibling;
        next.parentNode.removeChild(next);
        next = brSibling;
      }

      // If we removed a <br> chain, replace the remaining <br> with a <p>. Add
      // all sibling nodes as children of the <p> until we hit another <br>
      // chain.
      if (replaced) {
        var p = this._doc.createElement("p");
        br.parentNode.replaceChild(p, br);

        next = p.nextSibling;
        while (next) {
          // If we've hit another <br><br>, we're done adding children to this <p>.
          if (next.tagName == "BR") {
            var nextElem = this._nextNode(next.nextSibling);
            if (nextElem && nextElem.tagName == "BR")
              break;
          }

          if (!this._isPhrasingContent(next))
            break;

          // Otherwise, make this node a child of the new <p>.
          var sibling = next.nextSibling;
          p.appendChild(next);
          next = sibling;
        }

        while (p.lastChild && this._isWhitespace(p.lastChild)) {
          p.removeChild(p.lastChild);
        }

        if (p.parentNode.tagName === "P")
          this._setNodeTag(p.parentNode, "DIV");
      }
    });
  },

  _setNodeTag: function (node, tag) {
    this.log("_setNodeTag", node, tag);
    if (this._docJSDOMParser) {
      node.localName = tag.toLowerCase();
      node.tagName = tag.toUpperCase();
      return node;
    }

    var replacement = node.ownerDocument.createElement(tag);
    while (node.firstChild) {
      replacement.appendChild(node.firstChild);
    }
    node.parentNode.replaceChild(replacement, node);
    if (node.readability)
      replacement.readability = node.readability;

    for (var i = 0; i < node.attributes.length; i++) {
      try {
        replacement.setAttribute(node.attributes[i].name, node.attributes[i].value);
      } catch (ex) {
        /* it's possible for setAttribute() to throw if the attribute name
         * isn't a valid XML Name. Such attributes can however be parsed from
         * source in HTML docs, see https://github.com/whatwg/html/issues/4275,
         * so we can hit them here and then throw. We don't care about such
         * attributes so we ignore them.
         */
      }
    }
    return replacement;
  },

  /**
   * Prepare the article node for display. Clean out any inline styles,
   * iframes, forms, strip extraneous <p> tags, etc.
   *
   * @param Element
   * @return void
   **/
  _prepArticle: function(articleContent) {
    this._cleanStyles(articleContent);

    // Check for data tables before we continue, to avoid removing items in
    // those tables, which will often be isolated even though they're
    // visually linked to other content-ful elements (text, images, etc.).
    this._markDataTables(articleContent);

    this._fixLazyImages(articleContent);

    // Clean out junk from the article content
    this._cleanConditionally(articleContent, "form");
    this._cleanConditionally(articleContent, "fieldset");
    this._clean(articleContent, "object");
    this._clean(articleContent, "embed");
    this._clean(articleContent, "footer");
    this._clean(articleContent, "link");
    this._clean(articleContent, "aside");

    // Clean out elements with little content that have "share" in their id/class combinations from final top candidates,
    // which means we don't remove the top candidates even they have "share".

    var shareElementThreshold = this.DEFAULT_CHAR_THRESHOLD;

    this._forEachNode(articleContent.children, function (topCandidate) {
      this._cleanMatchedNodes(topCandidate, function (node, matchString) {
        return this.REGEXPS.shareElements.test(matchString) && node.textContent.length < shareElementThreshold;
      });
    });

    this._clean(articleContent, "iframe");
    this._clean(articleContent, "input");
    this._clean(articleContent, "textarea");
    this._clean(articleContent, "select");
    this._clean(articleContent, "button");
    this._cleanHeaders(articleContent);

    // Do these last as the previous stuff may have removed junk
    // that will affect these
    this._cleanConditionally(articleContent, "table");
    this._cleanConditionally(articleContent, "ul");
    this._cleanConditionally(articleContent, "div");

    // replace H1 with H2 as H1 should be only title that is displayed separately
    this._replaceNodeTags(this._getAllNodesWithTag(articleContent, ["h1"]), "h2");

    // Remove extra paragraphs
    this._removeNodes(this._getAllNodesWithTag(articleContent, ["p"]), function (paragraph) {
      var imgCount = paragraph.getElementsByTagName("img").length;
      var embedCount = paragraph.getElementsByTagName("embed").length;
      var objectCount = paragraph.getElementsByTagName("object").length;
      // At this point, nasty iframes have been removed, only remain embedded video ones.
      var iframeCount = paragraph.getElementsByTagName("iframe").length;
      var totalCount = imgCount + embedCount + objectCount + iframeCount;

      return totalCount === 0 && !this._getInnerText(paragraph, false);
    });

    this._forEachNode(this._getAllNodesWithTag(articleContent, ["br"]), function(br) {
      var next = this._nextNode(br.nextSibling);
      if (next && next.tagName == "P")
        br.parentNode.removeChild(br);
    });

    // Remove single-cell tables
    this._forEachNode(this._getAllNodesWithTag(articleContent, ["table"]), function(table) {
      var tbody = this._hasSingleTagInsideElement(table, "TBODY") ? table.firstElementChild : table;
      if (this._hasSingleTagInsideElement(tbody, "TR")) {
        var row = tbody.firstElementChild;
        if (this._hasSingleTagInsideElement(row, "TD")) {
          var cell = row.firstElementChild;
          cell = this._setNodeTag(cell, this._everyNode(cell.childNodes, this._isPhrasingContent) ? "P" : "DIV");
          table.parentNode.replaceChild(cell, table);
        }
      }
    });
  },

  /**
   * Initialize a node with the readability object. Also checks the
   * className/id for special names to add to its score.
   *
   * @param Element
   * @return void
  **/
  _initializeNode: function(node) {
    node.readability = {"contentScore": 0};

    switch (node.tagName) {
      case "DIV":
        node.readability.contentScore += 5;
        break;

      case "PRE":
      case "TD":
      case "BLOCKQUOTE":
        node.readability.contentScore += 3;
        break;

      case "ADDRESS":
      case "OL":
      case "UL":
      case "DL":
      case "DD":
      case "DT":
      case "LI":
      case "FORM":
        node.readability.contentScore -= 3;
        break;

      case "H1":
      case "H2":
      case "H3":
      case "H4":
      case "H5":
      case "H6":
      case "TH":
        node.readability.contentScore -= 5;
        break;
    }

    node.readability.contentScore += this._getClassWeight(node);
  },

  _removeAndGetNext: function(node) {
    var nextNode = this._getNextNode(node, true);
    node.parentNode.removeChild(node);
    return nextNode;
  },

  /**
   * Traverse the DOM from node to node, starting at the node passed in.
   * Pass true for the second parameter to indicate this node itself
   * (and its kids) are going away, and we want the next node over.
   *
   * Calling this in a loop will traverse the DOM depth-first.
   */
  _getNextNode: function(node, ignoreSelfAndKids) {
    // First check for kids if those aren't being ignored
    if (!ignoreSelfAndKids && node.firstElementChild) {
      return node.firstElementChild;
    }
    // Then for siblings...
    if (node.nextElementSibling) {
      return node.nextElementSibling;
    }
    // And finally, move up the parent chain *and* find a sibling
    // (because this is depth-first traversal, we will have already
    // seen the parent nodes themselves).
    do {
      node = node.parentNode;
    } while (node && !node.nextElementSibling);
    return node && node.nextElementSibling;
  },

  // compares second text to first one
  // 1 = same text, 0 = completely different text
  // works the way that it splits both texts into words and then finds words that are unique in second text
  // the result is given by the lower length of unique parts
  _textSimilarity: function(textA, textB) {
    var tokensA = textA.toLowerCase().split(this.REGEXPS.tokenize).filter(Boolean);
    var tokensB = textB.toLowerCase().split(this.REGEXPS.tokenize).filter(Boolean);
    if (!tokensA.length || !tokensB.length) {
      return 0;
    }
    var uniqTokensB = tokensB.filter(token => !tokensA.includes(token));
    var distanceB = uniqTokensB.join(" ").length / tokensB.join(" ").length;
    return 1 - distanceB;
  },

  _checkByline: function(node, matchString) {
    if (this._articleByline) {
      return false;
    }

    if (node.getAttribute !== undefined) {
      var rel = node.getAttribute("rel");
      var itemprop = node.getAttribute("itemprop");
    }

    if ((rel === "author" || (itemprop && itemprop.indexOf("author") !== -1) || this.REGEXPS.byline.test(matchString)) && this._isValidByline(node.textContent)) {
      this._articleByline = node.textContent.trim();
      return true;
    }

    return false;
  },

  _getNodeAncestors: function(node, maxDepth) {
    maxDepth = maxDepth || 0;
    var i = 0, ancestors = [];
    while (node.parentNode) {
      ancestors.push(node.parentNode);
      if (maxDepth && ++i === maxDepth)
        break;
      node = node.parentNode;
    }
    return ancestors;
  },

  /***
   * grabArticle - Using a variety of metrics (content score, classname, element types), find the content that is
   *         most likely to be the stuff a user wants to read. Then return it wrapped up in a div.
   *
   * @param page a document to run upon. Needs to be a full document, complete with body.
   * @return Element
  **/
  _grabArticle: function (page) {
    this.log("**** grabArticle ****");
    var doc = this._doc;
    var isPaging = page !== null;
    page = page ? page : this._doc.body;

    // We can't grab an article if we don't have a page!
    if (!page) {
      this.log("No body found in document. Abort.");
      return null;
    }

    var pageCacheHtml = page.innerHTML;

    while (true) {
      this.log("Starting grabArticle loop");
      var stripUnlikelyCandidates = this._flagIsActive(this.FLAG_STRIP_UNLIKELYS);

      // First, node prepping. Trash nodes that look cruddy (like ones with the
      // class name "comment", etc), and turn divs into P tags where they have been
      // used inappropriately (as in, where they contain no other block level elements.)
      var elementsToScore = [];
      var node = this._doc.documentElement;

      let shouldRemoveTitleHeader = true;

      while (node) {

        if (node.tagName === "HTML") {
          this._articleLang = node.getAttribute("lang");
        }

        var matchString = node.className + " " + node.id;

        if (!this._isProbablyVisible(node)) {
          this.log("Removing hidden node - " + matchString);
          node = this._removeAndGetNext(node);
          continue;
        }

        // User is not able to see elements applied with both "aria-modal = true" and "role = dialog"
        if (node.getAttribute("aria-modal") == "true" && node.getAttribute("role") == "dialog") {
          node = this._removeAndGetNext(node);
          continue;
        }

        // Check to see if this node is a byline, and remove it if it is.
        if (this._checkByline(node, matchString)) {
          node = this._removeAndGetNext(node);
          continue;
        }

        if (shouldRemoveTitleHeader && this._headerDuplicatesTitle(node)) {
          this.log("Removing header: ", node.textContent.trim(), this._articleTitle.trim());
          shouldRemoveTitleHeader = false;
          node = this._removeAndGetNext(node);
          continue;
        }

        // Remove unlikely candidates
        if (stripUnlikelyCandidates) {
          if (this.REGEXPS.unlikelyCandidates.test(matchString) &&
              !this.REGEXPS.okMaybeItsACandidate.test(matchString) &&
              !this._hasAncestorTag(node, "table") &&
              !this._hasAncestorTag(node, "code") &&
              node.tagName !== "BODY" &&
              node.tagName !== "A") {
            this.log("Removing unlikely candidate - " + matchString);
            node = this._removeAndGetNext(node);
            continue;
          }

          if (this.UNLIKELY_ROLES.includes(node.getAttribute("role"))) {
            this.log("Removing content with role " + node.getAttribute("role") + " - " + matchString);
            node = this._removeAndGetNext(node);
            continue;
          }
        }

        // Remove DIV, SECTION, and HEADER nodes without any content(e.g. text, image, video, or iframe).
        if ((node.tagName === "DIV" || node.tagName === "SECTION" || node.tagName === "HEADER" ||
             node.tagName === "H1" || node.tagName === "H2" || node.tagName === "H3" ||
             node.tagName === "H4" || node.tagName === "H5" || node.tagName === "H6") &&
            this._isElementWithoutContent(node)) {
          node = this._removeAndGetNext(node);
          continue;
        }

        if (this.DEFAULT_TAGS_TO_SCORE.indexOf(node.tagName) !== -1) {
          elementsToScore.push(node);
        }

        // Turn all divs that don't have children block level elements into p's
        if (node.tagName === "DIV") {
          // Put phrasing content into paragraphs.
          var p = null;
          var childNode = node.firstChild;
          while (childNode) {
            var nextSibling = childNode.nextSibling;
            if (this._isPhrasingContent(childNode)) {
              if (p !== null) {
                p.appendChild(childNode);
              } else if (!this._isWhitespace(childNode)) {
                p = doc.createElement("p");
                node.replaceChild(p, childNode);
                p.appendChild(childNode);
              }
            } else if (p !== null) {
              while (p.lastChild && this._isWhitespace(p.lastChild)) {
                p.removeChild(p.lastChild);
              }
              p = null;
            }
            childNode = nextSibling;
          }

          // Sites like http://mobile.slate.com encloses each paragraph with a DIV
          // element. DIVs with only a P element inside and no text content can be
          // safely converted into plain P elements to avoid confusing the scoring
          // algorithm with DIVs with are, in practice, paragraphs.
          if (this._hasSingleTagInsideElement(node, "P") && this._getLinkDensity(node) < 0.25) {
            var newNode = node.children[0];
            node.parentNode.replaceChild(newNode, node);
            node = newNode;
            elementsToScore.push(node);
          } else if (!this._hasChildBlockElement(node)) {
            node = this._setNodeTag(node, "P");
            elementsToScore.push(node);
          }
        }
        node = this._getNextNode(node);
      }

      /**
       * Loop through all paragraphs, and assign a score to them based on how content-y they look.
       * Then add their score to their parent node.
       *
       * A score is determined by things like number of commas, class names, etc. Maybe eventually link density.
      **/
      var candidates = [];
      this._forEachNode(elementsToScore, function(elementToScore) {
        if (!elementToScore.parentNode || typeof(elementToScore.parentNode.tagName) === "undefined")
          return;

        // If this paragraph is less than 25 characters, don't even count it.
        var innerText = this._getInnerText(elementToScore);
        if (innerText.length < 25)
          return;

        // Exclude nodes with no ancestor.
        var ancestors = this._getNodeAncestors(elementToScore, 5);
        if (ancestors.length === 0)
          return;

        var contentScore = 0;

        // Add a point for the paragraph itself as a base.
        contentScore += 1;

        // Add points for any commas within this paragraph.
        contentScore += innerText.split(this.REGEXPS.commas).length;

        // For every 100 characters in this paragraph, add another point. Up to 3 points.
        contentScore += Math.min(Math.floor(innerText.length / 100), 3);

        // Initialize and score ancestors.
        this._forEachNode(ancestors, function(ancestor, level) {
          if (!ancestor.tagName || !ancestor.parentNode || typeof(ancestor.parentNode.tagName) === "undefined")
            return;

          if (typeof(ancestor.readability) === "undefined") {
            this._initializeNode(ancestor);
            candidates.push(ancestor);
          }

          // Node score divider:
          // - parent:             1 (no division)
          // - grandparent:        2
          // - great grandparent+: ancestor level * 3
          if (level === 0)
            var scoreDivider = 1;
          else if (level === 1)
            scoreDivider = 2;
          else
            scoreDivider = level * 3;
          ancestor.readability.contentScore += contentScore / scoreDivider;
        });
      });

      // After we've calculated scores, loop through all of the possible
      // candidate nodes we found and find the one with the highest score.
      var topCandidates = [];
      for (var c = 0, cl = candidates.length; c < cl; c += 1) {
        var candidate = candidates[c];

        // Scale the final candidates score based on link density. Good content
        // should have a relatively small link density (5% or less) and be mostly
        // unaffected by this operation.
        var candidateScore = candidate.readability.contentScore * (1 - this._getLinkDensity(candidate));
        candidate.readability.contentScore = candidateScore;

        this.log("Candidate:", candidate, "with score " + candidateScore);

        for (var t = 0; t < this._nbTopCandidates; t++) {
          var aTopCandidate = topCandidates[t];

          if (!aTopCandidate || candidateScore > aTopCandidate.readability.contentScore) {
            topCandidates.splice(t, 0, candidate);
            if (topCandidates.length > this._nbTopCandidates)
              topCandidates.pop();
            break;
          }
        }
      }

      var topCandidate = topCandidates[0] || null;
      var neededToCreateTopCandidate = false;
      var parentOfTopCandidate;

      // If we still have no top candidate, just use the body as a last resort.
      // We also have to copy the body node so it is something we can modify.
      if (topCandidate === null || topCandidate.tagName === "BODY") {
        // Move all of the page's children into topCandidate
        topCandidate = doc.createElement("DIV");
        neededToCreateTopCandidate = true;
        // Move everything (not just elements, also text nodes etc.) into the container
        // so we even include text directly in the body:
        while (page.firstChild) {
          this.log("Moving child out:", page.firstChild);
          topCandidate.appendChild(page.firstChild);
        }

        page.appendChild(topCandidate);

        this._initializeNode(topCandidate);
      } else if (topCandidate) {
        // Find a better top candidate node if it contains (at least three) nodes which belong to `topCandidates` array
        // and whose scores are quite closed with current `topCandidate` node.
        var alternativeCandidateAncestors = [];
        for (var i = 1; i < topCandidates.length; i++) {
          if (topCandidates[i].readability.contentScore / topCandidate.readability.contentScore >= 0.75) {
            alternativeCandidateAncestors.push(this._getNodeAncestors(topCandidates[i]));
          }
        }
        var MINIMUM_TOPCANDIDATES = 3;
        if (alternativeCandidateAncestors.length >= MINIMUM_TOPCANDIDATES) {
          parentOfTopCandidate = topCandidate.parentNode;
          while (parentOfTopCandidate.tagName !== "BODY") {
            var listsContainingThisAncestor = 0;
            for (var ancestorIndex = 0; ancestorIndex < alternativeCandidateAncestors.length && listsContainingThisAncestor < MINIMUM_TOPCANDIDATES; ancestorIndex++) {
              listsContainingThisAncestor += Number(alternativeCandidateAncestors[ancestorIndex].includes(parentOfTopCandidate));
            }
            if (listsContainingThisAncestor >= MINIMUM_TOPCANDIDATES) {
              topCandidate = parentOfTopCandidate;
              break;
            }
            parentOfTopCandidate = parentOfTopCandidate.parentNode;
          }
        }
        if (!topCandidate.readability) {
          this._initializeNode(topCandidate);
        }

        // Because of our bonus system, parents of candidates might have scores
        // themselves. They get half of the node. There won't be nodes with higher
        // scores than our topCandidate, but if we see the score going *up* in the first
        // few steps up the tree, that's a decent sign that there might be more content
        // lurking in other places that we want to unify in. The sibling stuff
        // below does some of that - but only if we've looked high enough up the DOM
        // tree.
        parentOfTopCandidate = topCandidate.parentNode;
        var lastScore = topCandidate.readability.contentScore;
        // The scores shouldn't get too low.
        var scoreThreshold = lastScore / 3;
        while (parentOfTopCandidate.tagName !== "BODY") {
          if (!parentOfTopCandidate.readability) {
            parentOfTopCandidate = parentOfTopCandidate.parentNode;
            continue;
          }
          var parentScore = parentOfTopCandidate.readability.contentScore;
          if (parentScore < scoreThreshold)
            break;
          if (parentScore > lastScore) {
            // Alright! We found a better parent to use.
            topCandidate = parentOfTopCandidate;
            break;
          }
          lastScore = parentOfTopCandidate.readability.contentScore;
          parentOfTopCandidate = parentOfTopCandidate.parentNode;
        }

        // If the top candidate is the only child, use parent instead. This will help sibling
        // joining logic when adjacent content is actually located in parent's sibling node.
        parentOfTopCandidate = topCandidate.parentNode;
        while (parentOfTopCandidate.tagName != "BODY" && parentOfTopCandidate.children.length == 1) {
          topCandidate = parentOfTopCandidate;
          parentOfTopCandidate = topCandidate.parentNode;
        }
        if (!topCandidate.readability) {
          this._initializeNode(topCandidate);
        }
      }

      // Now that we have the top candidate, look through its siblings for content
      // that might also be related. Things like preambles, content split by ads
      // that we removed, etc.
      var articleContent = doc.createElement("DIV");
      if (isPaging)
        articleContent.id = "readability-content";

      var siblingScoreThreshold = Math.max(10, topCandidate.readability.contentScore * 0.2);
      // Keep potential top candidate's parent node to try to get text direction of it later.
      parentOfTopCandidate = topCandidate.parentNode;
      var siblings = parentOfTopCandidate.children;

      for (var s = 0, sl = siblings.length; s < sl; s++) {
        var sibling = siblings[s];
        var append = false;

        this.log("Looking at sibling node:", sibling, sibling.readability ? ("with score " + sibling.readability.contentScore) : "");
        this.log("Sibling has score", sibling.readability ? sibling.readability.contentScore : "Unknown");

        if (sibling === topCandidate) {
          append = true;
        } else {
          var contentBonus = 0;

          // Give a bonus if sibling nodes and top candidates have the example same classname
          if (sibling.className === topCandidate.className && topCandidate.className !== "")
            contentBonus += topCandidate.readability.contentScore * 0.2;

          if (sibling.readability &&
              ((sibling.readability.contentScore + contentBonus) >= siblingScoreThreshold)) {
            append = true;
          } else if (sibling.nodeName === "P") {
            var linkDensity = this._getLinkDensity(sibling);
            var nodeContent = this._getInnerText(sibling);
            var nodeLength = nodeContent.length;

            if (nodeLength > 80 && linkDensity < 0.25) {
              append = true;
            } else if (nodeLength < 80 && nodeLength > 0 && linkDensity === 0 &&
                       nodeContent.search(/\.( |$)/) !== -1) {
              append = true;
            }
          }
        }

        if (append) {
          this.log("Appending node:", sibling);

          if (this.ALTER_TO_DIV_EXCEPTIONS.indexOf(sibling.nodeName) === -1) {
            // We have a node that isn't a common block level element, like a form or td tag.
            // Turn it into a div so it doesn't get filtered out later by accident.
            this.log("Altering sibling:", sibling, "to div.");

            sibling = this._setNodeTag(sibling, "DIV");
          }

          articleContent.appendChild(sibling);
          // Fetch children again to make it compatible
          // with DOM parsers without live collection support.
          siblings = parentOfTopCandidate.children;
          // siblings is a reference to the children array, and
          // sibling is removed from the array when we call appendChild().
          // As a result, we must revisit this index since the nodes
          // have been shifted.
          s -= 1;
          sl -= 1;
        }
      }

      if (this._debug)
        this.log("Article content pre-prep: " + articleContent.innerHTML);
      // So we have all of the content that we need. Now we clean it up for presentation.
      this._prepArticle(articleContent);
      if (this._debug)
        this.log("Article content post-prep: " + articleContent.innerHTML);

      if (neededToCreateTopCandidate) {
        // We already created a fake div thing, and there wouldn't have been any siblings left
        // for the previous loop, so there's no point trying to create a new div, and then
        // move all the children over. Just assign IDs and class names here. No need to append
        // because that already happened anyway.
        topCandidate.id = "readability-page-1";
        topCandidate.className = "page";
      } else {
        var div = doc.createElement("DIV");
        div.id = "readability-page-1";
        div.className = "page";
        while (articleContent.firstChild) {
          div.appendChild(articleContent.firstChild);
        }
        articleContent.appendChild(div);
      }

      if (this._debug)
        this.log("Article content after paging: " + articleContent.innerHTML);

      var parseSuccessful = true;

      // Now that we've gone through the full algorithm, check to see if
      // we got any meaningful content. If we didn't, we may need to re-run
      // grabArticle with different flags set. This gives us a higher likelihood of
      // finding the content, and the sieve approach gives us a higher likelihood of
      // finding the -right- content.
      var textLength = this._getInnerText(articleContent, true).length;
      if (textLength < this._charThreshold) {
        parseSuccessful = false;
        page.innerHTML = pageCacheHtml;

        if (this._flagIsActive(this.FLAG_STRIP_UNLIKELYS)) {
          this._removeFlag(this.FLAG_STRIP_UNLIKELYS);
          this._attempts.push({articleContent: articleContent, textLength: textLength});
        } else if (this._flagIsActive(this.FLAG_WEIGHT_CLASSES)) {
          this._removeFlag(this.FLAG_WEIGHT_CLASSES);
          this._attempts.push({articleContent: articleContent, textLength: textLength});
        } else if (this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY)) {
          this._removeFlag(this.FLAG_CLEAN_CONDITIONALLY);
          this._attempts.push({articleContent: articleContent, textLength: textLength});
        } else {
          this._attempts.push({articleContent: articleContent, textLength: textLength});
          // No luck after removing flags, just return the longest text we found during the different loops
          this._attempts.sort(function (a, b) {
            return b.textLength - a.textLength;
          });

          // But first check if we actually have something
          if (!this._attempts[0].textLength) {
            return null;
          }

          articleContent = this._attempts[0].articleContent;
          parseSuccessful = true;
        }
      }

      if (parseSuccessful) {
        // Find out text direction from ancestors of final top candidate.
        var ancestors = [parentOfTopCandidate, topCandidate].concat(this._getNodeAncestors(parentOfTopCandidate));
        this._someNode(ancestors, function(ancestor) {
          if (!ancestor.tagName)
            return false;
          var articleDir = ancestor.getAttribute("dir");
          if (articleDir) {
            this._articleDir = articleDir;
            return true;
          }
          return false;
        });
        return articleContent;
      }
    }
  },

  /**
   * Check whether the input string could be a byline.
   * This verifies that the input is a string, and that the length
   * is less than 100 chars.
   *
   * @param possibleByline {string} - a string to check whether its a byline.
   * @return Boolean - whether the input string is a byline.
   */
  _isValidByline: function(byline) {
    if (typeof byline == "string" || byline instanceof String) {
      byline = byline.trim();
      return (byline.length > 0) && (byline.length < 100);
    }
    return false;
  },

  /**
   * Converts some of the common HTML entities in string to their corresponding characters.
   *
   * @param str {string} - a string to unescape.
   * @return string without HTML entity.
   */
  _unescapeHtmlEntities: function(str) {
    if (!str) {
      return str;
    }

    var htmlEscapeMap = this.HTML_ESCAPE_MAP;
    return str.replace(/&(quot|amp|apos|lt|gt);/g, function(_, tag) {
      return htmlEscapeMap[tag];
    }).replace(/&#(?:x([0-9a-z]{1,4})|([0-9]{1,4}));/gi, function(_, hex, numStr) {
      var num = parseInt(hex || numStr, hex ? 16 : 10);
      return String.fromCharCode(num);
    });
  },

  /**
   * Try to extract metadata from JSON-LD object.
   * For now, only Schema.org objects of type Article or its subtypes are supported.
   * @return Object with any metadata that could be extracted (possibly none)
   */
  _getJSONLD: function (doc) {
    var scripts = this._getAllNodesWithTag(doc, ["script"]);

    var metadata;

    this._forEachNode(scripts, function(jsonLdElement) {
      if (!metadata && jsonLdElement.getAttribute("type") === "application/ld+json") {
        try {
          // Strip CDATA markers if present
          var content = jsonLdElement.textContent.replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, "");
          var parsed = JSON.parse(content);
          if (
            !parsed["@context"] ||
            !parsed["@context"].match(/^https?\:\/\/schema\.org$/)
          ) {
            return;
          }

          if (!parsed["@type"] && Array.isArray(parsed["@graph"])) {
            parsed = parsed["@graph"].find(function(it) {
              return (it["@type"] || "").match(
                this.REGEXPS.jsonLdArticleTypes
              );
            });
          }

          if (
            !parsed ||
            !parsed["@type"] ||
            !parsed["@type"].match(this.REGEXPS.jsonLdArticleTypes)
          ) {
            return;
          }

          metadata = {};

          if (typeof parsed.name === "string" && typeof parsed.headline === "string" && parsed.name !== parsed.headline) {
            // we have both name and headline element in the JSON-LD. They should both be the same but some websites like aktualne.cz
            // put their own name into "name" and the article title to "headline" which confuses Readability. So we try to check if either
            // "name" or "headline" closely matches the html title, and if so, use that one. If not, then we use "name" by default.

            var title = this._getArticleTitle();
            var nameMatches = this._textSimilarity(parsed.name, title) > 0.75;
            var headlineMatches = this._textSimilarity(parsed.headline, title) > 0.75;

            if (headlineMatches && !nameMatches) {
              metadata.title = parsed.headline;
            } else {
              metadata.title = parsed.name;
            }
          } else if (typeof parsed.name === "string") {
            metadata.title = parsed.name.trim();
          } else if (typeof parsed.headline === "string") {
            metadata.title = parsed.headline.trim();
          }
          if (parsed.author) {
            if (typeof parsed.author.name === "string") {
              metadata.byline = parsed.author.name.trim();
            } else if (Array.isArray(parsed.author) && parsed.author[0] && typeof parsed.author[0].name === "string") {
              metadata.byline = parsed.author
                .filter(function(author) {
                  return author && typeof author.name === "string";
                })
                .map(function(author) {
                  return author.name.trim();
                })
                .join(", ");
            }
          }
          if (typeof parsed.description === "string") {
            metadata.excerpt = parsed.description.trim();
          }
          if (
            parsed.publisher &&
            typeof parsed.publisher.name === "string"
          ) {
            metadata.siteName = parsed.publisher.name.trim();
          }
          if (typeof parsed.datePublished === "string") {
            metadata.datePublished = parsed.datePublished.trim();
          }
          return;
        } catch (err) {
          this.log(err.message);
        }
      }
    });
    return metadata ? metadata : {};
  },

  /**
   * Attempts to get excerpt and byline metadata for the article.
   *
   * @param {Object} jsonld — object containing any metadata that
   * could be extracted from JSON-LD object.
   *
   * @return Object with optional "excerpt" and "byline" properties
   */
  _getArticleMetadata: function(jsonld) {
    var metadata = {};
    var values = {};
    var metaElements = this._doc.getElementsByTagName("meta");

    // property is a space-separated list of values
    var propertyPattern = /\s*(article|dc|dcterm|og|twitter)\s*:\s*(author|creator|description|published_time|title|site_name)\s*/gi;

    // name is a single value
    var namePattern = /^\s*(?:(dc|dcterm|og|twitter|weibo:(article|webpage))\s*[\.:]\s*)?(author|creator|description|title|site_name)\s*$/i;

    // Find description tags.
    this._forEachNode(metaElements, function(element) {
      var elementName = element.getAttribute("name");
      var elementProperty = element.getAttribute("property");
      var content = element.getAttribute("content");
      if (!content) {
        return;
      }
      var matches = null;
      var name = null;

      if (elementProperty) {
        matches = elementProperty.match(propertyPattern);
        if (matches) {
          // Convert to lowercase, and remove any whitespace
          // so we can match below.
          name = matches[0].toLowerCase().replace(/\s/g, "");
          // multiple authors
          values[name] = content.trim();
        }
      }
      if (!matches && elementName && namePattern.test(elementName)) {
        name = elementName;
        if (content) {
          // Convert to lowercase, remove any whitespace, and convert dots
          // to colons so we can match below.
          name = name.toLowerCase().replace(/\s/g, "").replace(/\./g, ":");
          values[name] = content.trim();
        }
      }
    });

    // get title
    metadata.title = jsonld.title ||
                     values["dc:title"] ||
                     values["dcterm:title"] ||
                     values["og:title"] ||
                     values["weibo:article:title"] ||
                     values["weibo:webpage:title"] ||
                     values["title"] ||
                     values["twitter:title"];

    if (!metadata.title) {
      metadata.title = this._getArticleTitle();
    }

    // get author
    metadata.byline = jsonld.byline ||
                      values["dc:creator"] ||
                      values["dcterm:creator"] ||
                      values["author"];

    // get description
    metadata.excerpt = jsonld.excerpt ||
                       values["dc:description"] ||
                       values["dcterm:description"] ||
                       values["og:description"] ||
                       values["weibo:article:description"] ||
                       values["weibo:webpage:description"] ||
                       values["description"] ||
                       values["twitter:description"];

    // get site name
    metadata.siteName = jsonld.siteName ||
                        values["og:site_name"];

    // get article published time
    metadata.publishedTime = jsonld.datePublished ||
      values["article:published_time"] || null;

    // in many sites the meta value is escaped with HTML entities,
    // so here we need to unescape it
    metadata.title = this._unescapeHtmlEntities(metadata.title);
    metadata.byline = this._unescapeHtmlEntities(metadata.byline);
    metadata.excerpt = this._unescapeHtmlEntities(metadata.excerpt);
    metadata.siteName = this._unescapeHtmlEntities(metadata.siteName);
    metadata.publishedTime = this._unescapeHtmlEntities(metadata.publishedTime);

    return metadata;
  },

  /**
   * Check if node is image, or if node contains exactly only one image
   * whether as a direct child or as its descendants.
   *
   * @param Element
  **/
  _isSingleImage: function(node) {
    if (node.tagName === "IMG") {
      return true;
    }

    if (node.children.length !== 1 || node.textContent.trim() !== "") {
      return false;
    }

    return this._isSingleImage(node.children[0]);
  },

  /**
   * Find all <noscript> that are located after <img> nodes, and which contain only one
   * <img> element. Replace the first image with the image from inside the <noscript> tag,
   * and remove the <noscript> tag. This improves the quality of the images we use on
   * some sites (e.g. Medium).
   *
   * @param Element
  **/
  _unwrapNoscriptImages: function(doc) {
    // Find img without source or attributes that might contains image, and remove it.
    // This is done to prevent a placeholder img is replaced by img from noscript in next step.
    var imgs = Array.from(doc.getElementsByTagName("img"));
    this._forEachNode(imgs, function(img) {
      for (var i = 0; i < img.attributes.length; i++) {
        var attr = img.attributes[i];
        switch (attr.name) {
          case "src":
          case "srcset":
          case "data-src":
          case "data-srcset":
            return;
        }

        if (/\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
          return;
        }
      }

      img.parentNode.removeChild(img);
    });

    // Next find noscript and try to extract its image
    var noscripts = Array.from(doc.getElementsByTagName("noscript"));
    this._forEachNode(noscripts, function(noscript) {
      // Parse content of noscript and make sure it only contains image
      var tmp = doc.createElement("div");
      tmp.innerHTML = noscript.innerHTML;
      if (!this._isSingleImage(tmp)) {
        return;
      }

      // If noscript has previous sibling and it only contains image,
      // replace it with noscript content. However we also keep old
      // attributes that might contains image.
      var prevElement = noscript.previousElementSibling;
      if (prevElement && this._isSingleImage(prevElement)) {
        var prevImg = prevElement;
        if (prevImg.tagName !== "IMG") {
          prevImg = prevElement.getElementsByTagName("img")[0];
        }

        var newImg = tmp.getElementsByTagName("img")[0];
        for (var i = 0; i < prevImg.attributes.length; i++) {
          var attr = prevImg.attributes[i];
          if (attr.value === "") {
            continue;
          }

          if (attr.name === "src" || attr.name === "srcset" || /\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
            if (newImg.getAttribute(attr.name) === attr.value) {
              continue;
            }

            var attrName = attr.name;
            if (newImg.hasAttribute(attrName)) {
              attrName = "data-old-" + attrName;
            }

            newImg.setAttribute(attrName, attr.value);
          }
        }

        noscript.parentNode.replaceChild(tmp.firstElementChild, prevElement);
      }
    });
  },

  /**
   * Removes script tags from the document.
   *
   * @param Element
  **/
  _removeScripts: function(doc) {
    this._removeNodes(this._getAllNodesWithTag(doc, ["script", "noscript"]));
  },

  /**
   * Check if this node has only whitespace and a single element with given tag
   * Returns false if the DIV node contains non-empty text nodes
   * or if it contains no element with given tag or more than 1 element.
   *
   * @param Element
   * @param string tag of child element
  **/
  _hasSingleTagInsideElement: function(element, tag) {
    // There should be exactly 1 element child with given tag
    if (element.children.length != 1 || element.children[0].tagName !== tag) {
      return false;
    }

    // And there should be no text nodes with real content
    return !this._someNode(element.childNodes, function(node) {
      return node.nodeType === this.TEXT_NODE &&
             this.REGEXPS.hasContent.test(node.textContent);
    });
  },

  _isElementWithoutContent: function(node) {
    return node.nodeType === this.ELEMENT_NODE &&
      node.textContent.trim().length == 0 &&
      (node.children.length == 0 ||
       node.children.length == node.getElementsByTagName("br").length + node.getElementsByTagName("hr").length);
  },

  /**
   * Determine whether element has any children block level elements.
   *
   * @param Element
   */
  _hasChildBlockElement: function (element) {
    return this._someNode(element.childNodes, function(node) {
      return this.DIV_TO_P_ELEMS.has(node.tagName) ||
             this._hasChildBlockElement(node);
    });
  },

  /***
   * Determine if a node qualifies as phrasing content.
   * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content
  **/
  _isPhrasingContent: function(node) {
    return node.nodeType === this.TEXT_NODE || this.PHRASING_ELEMS.indexOf(node.tagName) !== -1 ||
      ((node.tagName === "A" || node.tagName === "DEL" || node.tagName === "INS") &&
        this._everyNode(node.childNodes, this._isPhrasingContent));
  },

  _isWhitespace: function(node) {
    return (node.nodeType === this.TEXT_NODE && node.textContent.trim().length === 0) ||
           (node.nodeType === this.ELEMENT_NODE && node.tagName === "BR");
  },

  /**
   * Get the inner text of a node - cross browser compatibly.
   * This also strips out any excess whitespace to be found.
   *
   * @param Element
   * @param Boolean normalizeSpaces (default: true)
   * @return string
  **/
  _getInnerText: function(e, normalizeSpaces) {
    normalizeSpaces = (typeof normalizeSpaces === "undefined") ? true : normalizeSpaces;
    var textContent = e.textContent.trim();

    if (normalizeSpaces) {
      return textContent.replace(this.REGEXPS.normalize, " ");
    }
    return textContent;
  },

  /**
   * Get the number of times a string s appears in the node e.
   *
   * @param Element
   * @param string - what to split on. Default is ","
   * @return number (integer)
  **/
  _getCharCount: function(e, s) {
    s = s || ",";
    return this._getInnerText(e).split(s).length - 1;
  },

  /**
   * Remove the style attribute on every e and under.
   * TODO: Test if getElementsByTagName(*) is faster.
   *
   * @param Element
   * @return void
  **/
  _cleanStyles: function(e) {
    if (!e || e.tagName.toLowerCase() === "svg")
      return;

    // Remove `style` and deprecated presentational attributes
    for (var i = 0; i < this.PRESENTATIONAL_ATTRIBUTES.length; i++) {
      e.removeAttribute(this.PRESENTATIONAL_ATTRIBUTES[i]);
    }

    if (this.DEPRECATED_SIZE_ATTRIBUTE_ELEMS.indexOf(e.tagName) !== -1) {
      e.removeAttribute("width");
      e.removeAttribute("height");
    }

    var cur = e.firstElementChild;
    while (cur !== null) {
      this._cleanStyles(cur);
      cur = cur.nextElementSibling;
    }
  },

  /**
   * Get the density of links as a percentage of the content
   * This is the amount of text that is inside a link divided by the total text in the node.
   *
   * @param Element
   * @return number (float)
  **/
  _getLinkDensity: function(element) {
    var textLength = this._getInnerText(element).length;
    if (textLength === 0)
      return 0;

    var linkLength = 0;

    // XXX implement _reduceNodeList?
    this._forEachNode(element.getElementsByTagName("a"), function(linkNode) {
      var href = linkNode.getAttribute("href");
      var coefficient = href && this.REGEXPS.hashUrl.test(href) ? 0.3 : 1;
      linkLength += this._getInnerText(linkNode).length * coefficient;
    });

    return linkLength / textLength;
  },

  /**
   * Get an elements class/id weight. Uses regular expressions to tell if this
   * element looks good or bad.
   *
   * @param Element
   * @return number (Integer)
  **/
  _getClassWeight: function(e) {
    if (!this._flagIsActive(this.FLAG_WEIGHT_CLASSES))
      return 0;

    var weight = 0;

    // Look for a special classname
    if (typeof(e.className) === "string" && e.className !== "") {
      if (this.REGEXPS.negative.test(e.className))
        weight -= 25;

      if (this.REGEXPS.positive.test(e.className))
        weight += 25;
    }

    // Look for a special ID
    if (typeof(e.id) === "string" && e.id !== "") {
      if (this.REGEXPS.negative.test(e.id))
        weight -= 25;

      if (this.REGEXPS.positive.test(e.id))
        weight += 25;
    }

    return weight;
  },

  /**
   * Clean a node of all elements of type "tag".
   * (Unless it's a youtube/vimeo video. People love movies.)
   *
   * @param Element
   * @param string tag to clean
   * @return void
   **/
  _clean: function(e, tag) {
    var isEmbed = ["object", "embed", "iframe"].indexOf(tag) !== -1;

    this._removeNodes(this._getAllNodesWithTag(e, [tag]), function(element) {
      // Allow youtube and vimeo videos through as people usually want to see those.
      if (isEmbed) {
        // First, check the elements attributes to see if any of them contain youtube or vimeo
        for (var i = 0; i < element.attributes.length; i++) {
          if (this._allowedVideoRegex.test(element.attributes[i].value)) {
            return false;
          }
        }

        // For embed with <object> tag, check inner HTML as well.
        if (element.tagName === "object" && this._allowedVideoRegex.test(element.innerHTML)) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Check if a given node has one of its ancestor tag name matching the
   * provided one.
   * @param  HTMLElement node
   * @param  String      tagName
   * @param  Number      maxDepth
   * @param  Function    filterFn a filter to invoke to determine whether this node 'counts'
   * @return Boolean
   */
  _hasAncestorTag: function(node, tagName, maxDepth, filterFn) {
    maxDepth = maxDepth || 3;
    tagName = tagName.toUpperCase();
    var depth = 0;
    while (node.parentNode) {
      if (maxDepth > 0 && depth > maxDepth)
        return false;
      if (node.parentNode.tagName === tagName && (!filterFn || filterFn(node.parentNode)))
        return true;
      node = node.parentNode;
      depth++;
    }
    return false;
  },

  /**
   * Return an object indicating how many rows and columns this table has.
   */
  _getRowAndColumnCount: function(table) {
    var rows = 0;
    var columns = 0;
    var trs = table.getElementsByTagName("tr");
    for (var i = 0; i < trs.length; i++) {
      var rowspan = trs[i].getAttribute("rowspan") || 0;
      if (rowspan) {
        rowspan = parseInt(rowspan, 10);
      }
      rows += (rowspan || 1);

      // Now look for column-related info
      var columnsInThisRow = 0;
      var cells = trs[i].getElementsByTagName("td");
      for (var j = 0; j < cells.length; j++) {
        var colspan = cells[j].getAttribute("colspan") || 0;
        if (colspan) {
          colspan = parseInt(colspan, 10);
        }
        columnsInThisRow += (colspan || 1);
      }
      columns = Math.max(columns, columnsInThisRow);
    }
    return {rows: rows, columns: columns};
  },

  /**
   * Look for 'data' (as opposed to 'layout') tables, for which we use
   * similar checks as
   * https://searchfox.org/mozilla-central/rev/f82d5c549f046cb64ce5602bfd894b7ae807c8f8/accessible/generic/TableAccessible.cpp#19
   */
  _markDataTables: function(root) {
    var tables = root.getElementsByTagName("table");
    for (var i = 0; i < tables.length; i++) {
      var table = tables[i];
      var role = table.getAttribute("role");
      if (role == "presentation") {
        table._readabilityDataTable = false;
        continue;
      }
      var datatable = table.getAttribute("datatable");
      if (datatable == "0") {
        table._readabilityDataTable = false;
        continue;
      }
      var summary = table.getAttribute("summary");
      if (summary) {
        table._readabilityDataTable = true;
        continue;
      }

      var caption = table.getElementsByTagName("caption")[0];
      if (caption && caption.childNodes.length > 0) {
        table._readabilityDataTable = true;
        continue;
      }

      // If the table has a descendant with any of these tags, consider a data table:
      var dataTableDescendants = ["col", "colgroup", "tfoot", "thead", "th"];
      var descendantExists = function(tag) {
        return !!table.getElementsByTagName(tag)[0];
      };
      if (dataTableDescendants.some(descendantExists)) {
        this.log("Data table because found data-y descendant");
        table._readabilityDataTable = true;
        continue;
      }

      // Nested tables indicate a layout table:
      if (table.getElementsByTagName("table")[0]) {
        table._readabilityDataTable = false;
        continue;
      }

      var sizeInfo = this._getRowAndColumnCount(table);
      if (sizeInfo.rows >= 10 || sizeInfo.columns > 4) {
        table._readabilityDataTable = true;
        continue;
      }
      // Now just go by size entirely:
      table._readabilityDataTable = sizeInfo.rows * sizeInfo.columns > 10;
    }
  },

  /* convert images and figures that have properties like data-src into images that can be loaded without JS */
  _fixLazyImages: function (root) {
    this._forEachNode(this._getAllNodesWithTag(root, ["img", "picture", "figure"]), function (elem) {
      // In some sites (e.g. Kotaku), they put 1px square image as base64 data uri in the src attribute.
      // So, here we check if the data uri is too short, just might as well remove it.
      if (elem.src && this.REGEXPS.b64DataUrl.test(elem.src)) {
        // Make sure it's not SVG, because SVG can have a meaningful image in under 133 bytes.
        var parts = this.REGEXPS.b64DataUrl.exec(elem.src);
        if (parts[1] === "image/svg+xml") {
          return;
        }

        // Make sure this element has other attributes which contains image.
        // If it doesn't, then this src is important and shouldn't be removed.
        var srcCouldBeRemoved = false;
        for (var i = 0; i < elem.attributes.length; i++) {
          var attr = elem.attributes[i];
          if (attr.name === "src") {
            continue;
          }

          if (/\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
            srcCouldBeRemoved = true;
            break;
          }
        }

        // Here we assume if image is less than 100 bytes (or 133B after encoded to base64)
        // it will be too small, therefore it might be placeholder image.
        if (srcCouldBeRemoved) {
          var b64starts = elem.src.search(/base64\s*/i) + 7;
          var b64length = elem.src.length - b64starts;
          if (b64length < 133) {
            elem.removeAttribute("src");
          }
        }
      }

      // also check for "null" to work around https://github.com/jsdom/jsdom/issues/2580
      if ((elem.src || (elem.srcset && elem.srcset != "null")) && elem.className.toLowerCase().indexOf("lazy") === -1) {
        return;
      }

      for (var j = 0; j < elem.attributes.length; j++) {
        attr = elem.attributes[j];
        if (attr.name === "src" || attr.name === "srcset" || attr.name === "alt") {
          continue;
        }
        var copyTo = null;
        if (/\.(jpg|jpeg|png|webp)\s+\d/.test(attr.value)) {
          copyTo = "srcset";
        } else if (/^\s*\S+\.(jpg|jpeg|png|webp)\S*\s*$/.test(attr.value)) {
          copyTo = "src";
        }
        if (copyTo) {
          //if this is an img or picture, set the attribute directly
          if (elem.tagName === "IMG" || elem.tagName === "PICTURE") {
            elem.setAttribute(copyTo, attr.value);
          } else if (elem.tagName === "FIGURE" && !this._getAllNodesWithTag(elem, ["img", "picture"]).length) {
            //if the item is a <figure> that does not contain an image or picture, create one and place it inside the figure
            //see the nytimes-3 testcase for an example
            var img = this._doc.createElement("img");
            img.setAttribute(copyTo, attr.value);
            elem.appendChild(img);
          }
        }
      }
    });
  },

  _getTextDensity: function(e, tags) {
    var textLength = this._getInnerText(e, true).length;
    if (textLength === 0) {
      return 0;
    }
    var childrenLength = 0;
    var children = this._getAllNodesWithTag(e, tags);
    this._forEachNode(children, (child) => childrenLength += this._getInnerText(child, true).length);
    return childrenLength / textLength;
  },

  /**
   * Clean an element of all tags of type "tag" if they look fishy.
   * "Fishy" is an algorithm based on content length, classnames, link density, number of images & embeds, etc.
   *
   * @return void
   **/
  _cleanConditionally: function(e, tag) {
    if (!this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY))
      return;

    // Gather counts for other typical elements embedded within.
    // Traverse backwards so we can remove nodes at the same time
    // without effecting the traversal.
    //
    // TODO: Consider taking into account original contentScore here.
    this._removeNodes(this._getAllNodesWithTag(e, [tag]), function(node) {
      // First check if this node IS data table, in which case don't remove it.
      var isDataTable = function(t) {
        return t._readabilityDataTable;
      };

      var isList = tag === "ul" || tag === "ol";
      if (!isList) {
        var listLength = 0;
        var listNodes = this._getAllNodesWithTag(node, ["ul", "ol"]);
        this._forEachNode(listNodes, (list) => listLength += this._getInnerText(list).length);
        isList = listLength / this._getInnerText(node).length > 0.9;
      }

      if (tag === "table" && isDataTable(node)) {
        return false;
      }

      // Next check if we're inside a data table, in which case don't remove it as well.
      if (this._hasAncestorTag(node, "table", -1, isDataTable)) {
        return false;
      }

      if (this._hasAncestorTag(node, "code")) {
        return false;
      }

      var weight = this._getClassWeight(node);

      this.log("Cleaning Conditionally", node);

      var contentScore = 0;

      if (weight + contentScore < 0) {
        return true;
      }

      if (this._getCharCount(node, ",") < 10) {
        // If there are not very many commas, and the number of
        // non-paragraph elements is more than paragraphs or other
        // ominous signs, remove the element.
        var p = node.getElementsByTagName("p").length;
        var img = node.getElementsByTagName("img").length;
        var li = node.getElementsByTagName("li").length - 100;
        var input = node.getElementsByTagName("input").length;
        var headingDensity = this._getTextDensity(node, ["h1", "h2", "h3", "h4", "h5", "h6"]);

        var embedCount = 0;
        var embeds = this._getAllNodesWithTag(node, ["object", "embed", "iframe"]);

        for (var i = 0; i < embeds.length; i++) {
          // If this embed has attribute that matches video regex, don't delete it.
          for (var j = 0; j < embeds[i].attributes.length; j++) {
            if (this._allowedVideoRegex.test(embeds[i].attributes[j].value)) {
              return false;
            }
          }

          // For embed with <object> tag, check inner HTML as well.
          if (embeds[i].tagName === "object" && this._allowedVideoRegex.test(embeds[i].innerHTML)) {
            return false;
          }

          embedCount++;
        }

        var linkDensity = this._getLinkDensity(node);
        var contentLength = this._getInnerText(node).length;

        var haveToRemove =
          (img > 1 && p / img < 0.5 && !this._hasAncestorTag(node, "figure")) ||
          (!isList && li > p) ||
          (input > Math.floor(p/3)) ||
          (!isList && headingDensity < 0.9 && contentLength < 25 && (img === 0 || img > 2) && !this._hasAncestorTag(node, "figure")) ||
          (!isList && weight < 25 && linkDensity > 0.2) ||
          (weight >= 25 && linkDensity > 0.5) ||
          ((embedCount === 1 && contentLength < 75) || embedCount > 1);
        // Allow simple lists of images to remain in pages
        if (isList && haveToRemove) {
          for (var x = 0; x < node.children.length; x++) {
            let child = node.children[x];
            // Don't filter in lists with li's that contain more than one child
            if (child.children.length > 1) {
              return haveToRemove;
            }
          }
          let li_count = node.getElementsByTagName("li").length;
          // Only allow the list to remain if every li contains an image
          if (img == li_count) {
            return false;
          }
        }
        return haveToRemove;
      }
      return false;
    });
  },

  /**
   * Clean out elements that match the specified conditions
   *
   * @param Element
   * @param Function determines whether a node should be removed
   * @return void
   **/
  _cleanMatchedNodes: function(e, filter) {
    var endOfSearchMarkerNode = this._getNextNode(e, true);
    var next = this._getNextNode(e);
    while (next && next != endOfSearchMarkerNode) {
      if (filter.call(this, next, next.className + " " + next.id)) {
        next = this._removeAndGetNext(next);
      } else {
        next = this._getNextNode(next);
      }
    }
  },

  /**
   * Clean out spurious headers from an Element.
   *
   * @param Element
   * @return void
  **/
  _cleanHeaders: function(e) {
    let headingNodes = this._getAllNodesWithTag(e, ["h1", "h2"]);
    this._removeNodes(headingNodes, function(node) {
      let shouldRemove = this._getClassWeight(node) < 0;
      if (shouldRemove) {
        this.log("Removing header with low class weight:", node);
      }
      return shouldRemove;
    });
  },

  /**
   * Check if this node is an H1 or H2 element whose content is mostly
   * the same as the article title.
   *
   * @param Element  the node to check.
   * @return boolean indicating whether this is a title-like header.
   */
  _headerDuplicatesTitle: function(node) {
    if (node.tagName != "H1" && node.tagName != "H2") {
      return false;
    }
    var heading = this._getInnerText(node, false);
    this.log("Evaluating similarity of header:", heading, this._articleTitle);
    return this._textSimilarity(this._articleTitle, heading) > 0.75;
  },

  _flagIsActive: function(flag) {
    return (this._flags & flag) > 0;
  },

  _removeFlag: function(flag) {
    this._flags = this._flags & ~flag;
  },

  _isProbablyVisible: function(node) {
    // Have to null-check node.style and node.className.indexOf to deal with SVG and MathML nodes.
    return (!node.style || node.style.display != "none")
      && (!node.style || node.style.visibility != "hidden")
      && !node.hasAttribute("hidden")
      //check for "fallback-image" so that wikimedia math images are displayed
      && (!node.hasAttribute("aria-hidden") || node.getAttribute("aria-hidden") != "true" || (node.className && node.className.indexOf && node.className.indexOf("fallback-image") !== -1));
  },

  /**
   * Runs readability.
   *
   * Workflow:
   *  1. Prep the document by removing script tags, css, etc.
   *  2. Build readability's DOM tree.
   *  3. Grab the article content from the current dom tree.
   *  4. Replace the current DOM tree with the new one.
   *  5. Read peacefully.
   *
   * @return void
   **/
  parse: function () {
    // Avoid parsing too large documents, as per configuration option
    if (this._maxElemsToParse > 0) {
      var numTags = this._doc.getElementsByTagName("*").length;
      if (numTags > this._maxElemsToParse) {
        throw new Error("Aborting parsing document; " + numTags + " elements found");
      }
    }

    // Unwrap image from noscript
    this._unwrapNoscriptImages(this._doc);

    // Extract JSON-LD metadata before removing scripts
    var jsonLd = this._disableJSONLD ? {} : this._getJSONLD(this._doc);

    // Remove script tags from the document.
    this._removeScripts(this._doc);

    this._prepDocument();

    var metadata = this._getArticleMetadata(jsonLd);
    this._articleTitle = metadata.title;

    var articleContent = this._grabArticle();
    if (!articleContent)
      return null;

    this.log("Grabbed: " + articleContent.innerHTML);

    this._postProcessContent(articleContent);

    // If we haven't found an excerpt in the article's metadata, use the article's
    // first paragraph as the excerpt. This is used for displaying a preview of
    // the article's content.
    if (!metadata.excerpt) {
      var paragraphs = articleContent.getElementsByTagName("p");
      if (paragraphs.length > 0) {
        metadata.excerpt = paragraphs[0].textContent.trim();
      }
    }

    var textContent = articleContent.textContent;
    return {
      title: this._articleTitle,
      byline: metadata.byline || this._articleByline,
      dir: this._articleDir,
      lang: this._articleLang,
      content: this._serializer(articleContent),
      textContent: textContent,
      length: textContent.length,
      excerpt: metadata.excerpt,
      siteName: metadata.siteName || this._articleSiteName,
      publishedTime: metadata.publishedTime
    };
  }
};

if (true) {
  /* global module */
  module.exports = Readability;
}


/***/ }),

/***/ "./node_modules/@mozilla/readability/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@mozilla/readability/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-env node */
var Readability = __webpack_require__(/*! ./Readability */ "./node_modules/@mozilla/readability/Readability.js");
var isProbablyReaderable = __webpack_require__(/*! ./Readability-readerable */ "./node_modules/@mozilla/readability/Readability-readerable.js");

module.exports = {
  Readability: Readability,
  isProbablyReaderable: isProbablyReaderable
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/test.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mozilla_readability__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @mozilla/readability */ "./node_modules/@mozilla/readability/index.js");






// Use Readability
var documentClone = document.cloneNode(true);
var reader = new _mozilla_readability__WEBPACK_IMPORTED_MODULE_0__.Readability(documentClone);
var article = reader.parse();
console.log(article.title);
})();








/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckIsWUFBWSxTQUFTO0FBQ3JCO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQSx5QkFBeUI7QUFDekI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUEsSUFBSSxJQUEwQjtBQUM5QjtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsY0FBYztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsZUFBZSxJQUFJLGlCQUFpQjtBQUN0RDtBQUNBO0FBQ0Esa0JBQWtCLFVBQVUsSUFBSSxXQUFXO0FBQzNDLE9BQU87QUFDUCxpQkFBaUIsZ0JBQWdCLEVBQUUsVUFBVTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLEdBQUc7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLFFBQVE7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsUUFBUTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBLHdDQUF3QyxNQUFNO0FBQzlDO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLDBCQUEwQiw0QkFBNEI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTSxXQUFXOztBQUVqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsNEJBQTRCO0FBQ2hEO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCOztBQUV4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSx3QkFBd0IsMkJBQTJCO0FBQ25EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMEJBQTBCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3Qyw2R0FBNkc7QUFDcko7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0Q0FBNEMsUUFBUTtBQUNwRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCLHVEQUF1RDtBQUN0RixVQUFVO0FBQ1Y7QUFDQSwrQkFBK0IsdURBQXVEO0FBQ3RGLFVBQVU7QUFDVjtBQUNBLCtCQUErQix1REFBdUQ7QUFDdEYsVUFBVTtBQUNWLCtCQUErQix1REFBdUQ7QUFDdEY7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFFBQVE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFFBQVE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0EsS0FBSywyQkFBMkIsSUFBSSxTQUFTLElBQUksR0FBRztBQUNwRDtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsMkJBQTJCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsK0JBQStCO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsMkNBQTJDO0FBQy9EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsK0JBQStCO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGtCQUFrQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsbUJBQW1CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0IsNEJBQTRCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsd0JBQXdCLG1CQUFtQjtBQUMzQztBQUNBLDBCQUEwQixpQ0FBaUM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLDBCQUEwQjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwwQ0FBMEM7O0FBRTFDO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLElBQTBCO0FBQzlCO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN6d0VBO0FBQ0Esa0JBQWtCLG1CQUFPLENBQUMseUVBQWU7QUFDekMsMkJBQTJCLG1CQUFPLENBQUMsK0ZBQTBCOztBQUU3RDtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ1BBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05tRDs7QUFFbkQ7QUFDQSxJQUFNQyxhQUFhLEdBQUdDLFFBQVEsQ0FBQ0MsU0FBUyxDQUFDLElBQUksQ0FBQztBQUM5QyxJQUFNQyxNQUFNLEdBQUcsSUFBSUosNkRBQVcsQ0FBQ0MsYUFBYSxDQUFDO0FBQzdDLElBQU1JLE9BQU8sR0FBR0QsTUFBTSxDQUFDRSxLQUFLLENBQUMsQ0FBQztBQUM5QkMsT0FBTyxDQUFDQyxHQUFHLENBQUNILE9BQU8sQ0FBQ0ksS0FBSyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQG1vemlsbGEvcmVhZGFiaWxpdHkvUmVhZGFiaWxpdHktcmVhZGVyYWJsZS5qcyIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQG1vemlsbGEvcmVhZGFiaWxpdHkvUmVhZGFiaWxpdHkuanMiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0Btb3ppbGxhL3JlYWRhYmlsaXR5L2luZGV4LmpzIiwid2VicGFjazovL2V4dGVuc2lvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9leHRlbnNpb24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9zcmMvdGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDEwIEFyYzkwIEluY1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKlxuICogVGhpcyBjb2RlIGlzIGhlYXZpbHkgYmFzZWQgb24gQXJjOTAncyByZWFkYWJpbGl0eS5qcyAoMS43LjEpIHNjcmlwdFxuICogYXZhaWxhYmxlIGF0OiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvYXJjOTBsYWJzLXJlYWRhYmlsaXR5XG4gKi9cblxudmFyIFJFR0VYUFMgPSB7XG4gIC8vIE5PVEU6IFRoZXNlIHR3byByZWd1bGFyIGV4cHJlc3Npb25zIGFyZSBkdXBsaWNhdGVkIGluXG4gIC8vIFJlYWRhYmlsaXR5LmpzLiBQbGVhc2Uga2VlcCBib3RoIGNvcGllcyBpbiBzeW5jLlxuICB1bmxpa2VseUNhbmRpZGF0ZXM6IC8tYWQtfGFpMmh0bWx8YmFubmVyfGJyZWFkY3J1bWJzfGNvbWJ4fGNvbW1lbnR8Y29tbXVuaXR5fGNvdmVyLXdyYXB8ZGlzcXVzfGV4dHJhfGZvb3RlcnxnZHByfGhlYWRlcnxsZWdlbmRzfG1lbnV8cmVsYXRlZHxyZW1hcmt8cmVwbGllc3xyc3N8c2hvdXRib3h8c2lkZWJhcnxza3lzY3JhcGVyfHNvY2lhbHxzcG9uc29yfHN1cHBsZW1lbnRhbHxhZC1icmVha3xhZ2VnYXRlfHBhZ2luYXRpb258cGFnZXJ8cG9wdXB8eW9tLXJlbW90ZS9pLFxuICBva01heWJlSXRzQUNhbmRpZGF0ZTogL2FuZHxhcnRpY2xlfGJvZHl8Y29sdW1ufGNvbnRlbnR8bWFpbnxzaGFkb3cvaSxcbn07XG5cbmZ1bmN0aW9uIGlzTm9kZVZpc2libGUobm9kZSkge1xuICAvLyBIYXZlIHRvIG51bGwtY2hlY2sgbm9kZS5zdHlsZSBhbmQgbm9kZS5jbGFzc05hbWUuaW5kZXhPZiB0byBkZWFsIHdpdGggU1ZHIGFuZCBNYXRoTUwgbm9kZXMuXG4gIHJldHVybiAoIW5vZGUuc3R5bGUgfHwgbm9kZS5zdHlsZS5kaXNwbGF5ICE9IFwibm9uZVwiKVxuICAgICYmICFub2RlLmhhc0F0dHJpYnV0ZShcImhpZGRlblwiKVxuICAgIC8vY2hlY2sgZm9yIFwiZmFsbGJhY2staW1hZ2VcIiBzbyB0aGF0IHdpa2ltZWRpYSBtYXRoIGltYWdlcyBhcmUgZGlzcGxheWVkXG4gICAgJiYgKCFub2RlLmhhc0F0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpIHx8IG5vZGUuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgIT0gXCJ0cnVlXCIgfHwgKG5vZGUuY2xhc3NOYW1lICYmIG5vZGUuY2xhc3NOYW1lLmluZGV4T2YgJiYgbm9kZS5jbGFzc05hbWUuaW5kZXhPZihcImZhbGxiYWNrLWltYWdlXCIpICE9PSAtMSkpO1xufVxuXG4vKipcbiAqIERlY2lkZXMgd2hldGhlciBvciBub3QgdGhlIGRvY3VtZW50IGlzIHJlYWRlci1hYmxlIHdpdGhvdXQgcGFyc2luZyB0aGUgd2hvbGUgdGhpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5taW5Db250ZW50TGVuZ3RoPTE0MF0gVGhlIG1pbmltdW0gbm9kZSBjb250ZW50IGxlbmd0aCB1c2VkIHRvIGRlY2lkZSBpZiB0aGUgZG9jdW1lbnQgaXMgcmVhZGVyYWJsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5taW5TY29yZT0yMF0gVGhlIG1pbnVtdW0gY3VtdWxhdGVkICdzY29yZScgdXNlZCB0byBkZXRlcm1pbmUgaWYgdGhlIGRvY3VtZW50IGlzIHJlYWRlcmFibGUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy52aXNpYmlsaXR5Q2hlY2tlcj1pc05vZGVWaXNpYmxlXSBUaGUgZnVuY3Rpb24gdXNlZCB0byBkZXRlcm1pbmUgaWYgYSBub2RlIGlzIHZpc2libGUuXG4gKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB3ZSBzdXNwZWN0IFJlYWRhYmlsaXR5LnBhcnNlKCkgd2lsbCBzdWNlZWVkIGF0IHJldHVybmluZyBhbiBhcnRpY2xlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gaXNQcm9iYWJseVJlYWRlcmFibGUoZG9jLCBvcHRpb25zID0ge30pIHtcbiAgLy8gRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgcmVhc29ucyAnb3B0aW9ucycgY2FuIGVpdGhlciBiZSBhIGNvbmZpZ3VyYXRpb24gb2JqZWN0IG9yIHRoZSBmdW5jdGlvbiB1c2VkXG4gIC8vIHRvIGRldGVybWluZSBpZiBhIG5vZGUgaXMgdmlzaWJsZS5cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09IFwiZnVuY3Rpb25cIikge1xuICAgIG9wdGlvbnMgPSB7IHZpc2liaWxpdHlDaGVja2VyOiBvcHRpb25zIH07XG4gIH1cblxuICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7IG1pblNjb3JlOiAyMCwgbWluQ29udGVudExlbmd0aDogMTQwLCB2aXNpYmlsaXR5Q2hlY2tlcjogaXNOb2RlVmlzaWJsZSB9O1xuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgdmFyIG5vZGVzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoXCJwLCBwcmUsIGFydGljbGVcIik7XG5cbiAgLy8gR2V0IDxkaXY+IG5vZGVzIHdoaWNoIGhhdmUgPGJyPiBub2RlKHMpIGFuZCBhcHBlbmQgdGhlbSBpbnRvIHRoZSBgbm9kZXNgIHZhcmlhYmxlLlxuICAvLyBTb21lIGFydGljbGVzJyBET00gc3RydWN0dXJlcyBtaWdodCBsb29rIGxpa2VcbiAgLy8gPGRpdj5cbiAgLy8gICBTZW50ZW5jZXM8YnI+XG4gIC8vICAgPGJyPlxuICAvLyAgIFNlbnRlbmNlczxicj5cbiAgLy8gPC9kaXY+XG4gIHZhciBick5vZGVzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXYgPiBiclwiKTtcbiAgaWYgKGJyTm9kZXMubGVuZ3RoKSB7XG4gICAgdmFyIHNldCA9IG5ldyBTZXQobm9kZXMpO1xuICAgIFtdLmZvckVhY2guY2FsbChick5vZGVzLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgc2V0LmFkZChub2RlLnBhcmVudE5vZGUpO1xuICAgIH0pO1xuICAgIG5vZGVzID0gQXJyYXkuZnJvbShzZXQpO1xuICB9XG5cbiAgdmFyIHNjb3JlID0gMDtcbiAgLy8gVGhpcyBpcyBhIGxpdHRsZSBjaGVla3ksIHdlIHVzZSB0aGUgYWNjdW11bGF0b3IgJ3Njb3JlJyB0byBkZWNpZGUgd2hhdCB0byByZXR1cm4gZnJvbVxuICAvLyB0aGlzIGNhbGxiYWNrOlxuICByZXR1cm4gW10uc29tZS5jYWxsKG5vZGVzLCBmdW5jdGlvbiAobm9kZSkge1xuICAgIGlmICghb3B0aW9ucy52aXNpYmlsaXR5Q2hlY2tlcihub2RlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBtYXRjaFN0cmluZyA9IG5vZGUuY2xhc3NOYW1lICsgXCIgXCIgKyBub2RlLmlkO1xuICAgIGlmIChSRUdFWFBTLnVubGlrZWx5Q2FuZGlkYXRlcy50ZXN0KG1hdGNoU3RyaW5nKSAmJlxuICAgICAgICAhUkVHRVhQUy5va01heWJlSXRzQUNhbmRpZGF0ZS50ZXN0KG1hdGNoU3RyaW5nKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChub2RlLm1hdGNoZXMoXCJsaSBwXCIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHRleHRDb250ZW50TGVuZ3RoID0gbm9kZS50ZXh0Q29udGVudC50cmltKCkubGVuZ3RoO1xuICAgIGlmICh0ZXh0Q29udGVudExlbmd0aCA8IG9wdGlvbnMubWluQ29udGVudExlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHNjb3JlICs9IE1hdGguc3FydCh0ZXh0Q29udGVudExlbmd0aCAtIG9wdGlvbnMubWluQ29udGVudExlbmd0aCk7XG5cbiAgICBpZiAoc2NvcmUgPiBvcHRpb25zLm1pblNjb3JlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIpIHtcbiAgLyogZ2xvYmFsIG1vZHVsZSAqL1xuICBtb2R1bGUuZXhwb3J0cyA9IGlzUHJvYmFibHlSZWFkZXJhYmxlO1xufVxuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxMCBBcmM5MCBJbmNcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypcbiAqIFRoaXMgY29kZSBpcyBoZWF2aWx5IGJhc2VkIG9uIEFyYzkwJ3MgcmVhZGFiaWxpdHkuanMgKDEuNy4xKSBzY3JpcHRcbiAqIGF2YWlsYWJsZSBhdDogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL2FyYzkwbGFicy1yZWFkYWJpbGl0eVxuICovXG5cbi8qKlxuICogUHVibGljIGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIHtIVE1MRG9jdW1lbnR9IGRvYyAgICAgVGhlIGRvY3VtZW50IHRvIHBhcnNlLlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgIG9wdGlvbnMgVGhlIG9wdGlvbnMgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBSZWFkYWJpbGl0eShkb2MsIG9wdGlvbnMpIHtcbiAgLy8gSW4gc29tZSBvbGRlciB2ZXJzaW9ucywgcGVvcGxlIHBhc3NlZCBhIFVSSSBhcyB0aGUgZmlyc3QgYXJndW1lbnQuIENvcGU6XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgZG9jID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0gYXJndW1lbnRzWzJdO1xuICB9IGVsc2UgaWYgKCFkb2MgfHwgIWRvYy5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJGaXJzdCBhcmd1bWVudCB0byBSZWFkYWJpbGl0eSBjb25zdHJ1Y3RvciBzaG91bGQgYmUgYSBkb2N1bWVudCBvYmplY3QuXCIpO1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHRoaXMuX2RvYyA9IGRvYztcbiAgdGhpcy5fZG9jSlNET01QYXJzZXIgPSB0aGlzLl9kb2MuZmlyc3RDaGlsZC5fX0pTRE9NUGFyc2VyX187XG4gIHRoaXMuX2FydGljbGVUaXRsZSA9IG51bGw7XG4gIHRoaXMuX2FydGljbGVCeWxpbmUgPSBudWxsO1xuICB0aGlzLl9hcnRpY2xlRGlyID0gbnVsbDtcbiAgdGhpcy5fYXJ0aWNsZVNpdGVOYW1lID0gbnVsbDtcbiAgdGhpcy5fYXR0ZW1wdHMgPSBbXTtcblxuICAvLyBDb25maWd1cmFibGUgb3B0aW9uc1xuICB0aGlzLl9kZWJ1ZyA9ICEhb3B0aW9ucy5kZWJ1ZztcbiAgdGhpcy5fbWF4RWxlbXNUb1BhcnNlID0gb3B0aW9ucy5tYXhFbGVtc1RvUGFyc2UgfHwgdGhpcy5ERUZBVUxUX01BWF9FTEVNU19UT19QQVJTRTtcbiAgdGhpcy5fbmJUb3BDYW5kaWRhdGVzID0gb3B0aW9ucy5uYlRvcENhbmRpZGF0ZXMgfHwgdGhpcy5ERUZBVUxUX05fVE9QX0NBTkRJREFURVM7XG4gIHRoaXMuX2NoYXJUaHJlc2hvbGQgPSBvcHRpb25zLmNoYXJUaHJlc2hvbGQgfHwgdGhpcy5ERUZBVUxUX0NIQVJfVEhSRVNIT0xEO1xuICB0aGlzLl9jbGFzc2VzVG9QcmVzZXJ2ZSA9IHRoaXMuQ0xBU1NFU19UT19QUkVTRVJWRS5jb25jYXQob3B0aW9ucy5jbGFzc2VzVG9QcmVzZXJ2ZSB8fCBbXSk7XG4gIHRoaXMuX2tlZXBDbGFzc2VzID0gISFvcHRpb25zLmtlZXBDbGFzc2VzO1xuICB0aGlzLl9zZXJpYWxpemVyID0gb3B0aW9ucy5zZXJpYWxpemVyIHx8IGZ1bmN0aW9uKGVsKSB7XG4gICAgcmV0dXJuIGVsLmlubmVySFRNTDtcbiAgfTtcbiAgdGhpcy5fZGlzYWJsZUpTT05MRCA9ICEhb3B0aW9ucy5kaXNhYmxlSlNPTkxEO1xuICB0aGlzLl9hbGxvd2VkVmlkZW9SZWdleCA9IG9wdGlvbnMuYWxsb3dlZFZpZGVvUmVnZXggfHwgdGhpcy5SRUdFWFBTLnZpZGVvcztcblxuICAvLyBTdGFydCB3aXRoIGFsbCBmbGFncyBzZXRcbiAgdGhpcy5fZmxhZ3MgPSB0aGlzLkZMQUdfU1RSSVBfVU5MSUtFTFlTIHxcbiAgICAgICAgICAgICAgICB0aGlzLkZMQUdfV0VJR0hUX0NMQVNTRVMgfFxuICAgICAgICAgICAgICAgIHRoaXMuRkxBR19DTEVBTl9DT05ESVRJT05BTExZO1xuXG5cbiAgLy8gQ29udHJvbCB3aGV0aGVyIGxvZyBtZXNzYWdlcyBhcmUgc2VudCB0byB0aGUgY29uc29sZVxuICBpZiAodGhpcy5fZGVidWcpIHtcbiAgICBsZXQgbG9nTm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09IG5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgIHJldHVybiBgJHtub2RlLm5vZGVOYW1lfSAoXCIke25vZGUudGV4dENvbnRlbnR9XCIpYDtcbiAgICAgIH1cbiAgICAgIGxldCBhdHRyUGFpcnMgPSBBcnJheS5mcm9tKG5vZGUuYXR0cmlidXRlcyB8fCBbXSwgZnVuY3Rpb24oYXR0cikge1xuICAgICAgICByZXR1cm4gYCR7YXR0ci5uYW1lfT1cIiR7YXR0ci52YWx1ZX1cImA7XG4gICAgICB9KS5qb2luKFwiIFwiKTtcbiAgICAgIHJldHVybiBgPCR7bm9kZS5sb2NhbE5hbWV9ICR7YXR0clBhaXJzfT5gO1xuICAgIH07XG4gICAgdGhpcy5sb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgbGV0IGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50cywgYXJnID0+IHtcbiAgICAgICAgICBpZiAoYXJnICYmIGFyZy5ub2RlVHlwZSA9PSB0aGlzLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgcmV0dXJuIGxvZ05vZGUoYXJnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFyZztcbiAgICAgICAgfSk7XG4gICAgICAgIGFyZ3MudW5zaGlmdChcIlJlYWRlcjogKFJlYWRhYmlsaXR5KVwiKTtcbiAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncyk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkdW1wICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8qIGdsb2JhbCBkdW1wICovXG4gICAgICAgIHZhciBtc2cgPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoYXJndW1lbnRzLCBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgcmV0dXJuICh4ICYmIHgubm9kZU5hbWUpID8gbG9nTm9kZSh4KSA6IHg7XG4gICAgICAgIH0pLmpvaW4oXCIgXCIpO1xuICAgICAgICBkdW1wKFwiUmVhZGVyOiAoUmVhZGFiaWxpdHkpIFwiICsgbXNnICsgXCJcXG5cIik7XG4gICAgICB9XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmxvZyA9IGZ1bmN0aW9uICgpIHt9O1xuICB9XG59XG5cblJlYWRhYmlsaXR5LnByb3RvdHlwZSA9IHtcbiAgRkxBR19TVFJJUF9VTkxJS0VMWVM6IDB4MSxcbiAgRkxBR19XRUlHSFRfQ0xBU1NFUzogMHgyLFxuICBGTEFHX0NMRUFOX0NPTkRJVElPTkFMTFk6IDB4NCxcblxuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS9ub2RlVHlwZVxuICBFTEVNRU5UX05PREU6IDEsXG4gIFRFWFRfTk9ERTogMyxcblxuICAvLyBNYXggbnVtYmVyIG9mIG5vZGVzIHN1cHBvcnRlZCBieSB0aGlzIHBhcnNlci4gRGVmYXVsdDogMCAobm8gbGltaXQpXG4gIERFRkFVTFRfTUFYX0VMRU1TX1RPX1BBUlNFOiAwLFxuXG4gIC8vIFRoZSBudW1iZXIgb2YgdG9wIGNhbmRpZGF0ZXMgdG8gY29uc2lkZXIgd2hlbiBhbmFseXNpbmcgaG93XG4gIC8vIHRpZ2h0IHRoZSBjb21wZXRpdGlvbiBpcyBhbW9uZyBjYW5kaWRhdGVzLlxuICBERUZBVUxUX05fVE9QX0NBTkRJREFURVM6IDUsXG5cbiAgLy8gRWxlbWVudCB0YWdzIHRvIHNjb3JlIGJ5IGRlZmF1bHQuXG4gIERFRkFVTFRfVEFHU19UT19TQ09SRTogXCJzZWN0aW9uLGgyLGgzLGg0LGg1LGg2LHAsdGQscHJlXCIudG9VcHBlckNhc2UoKS5zcGxpdChcIixcIiksXG5cbiAgLy8gVGhlIGRlZmF1bHQgbnVtYmVyIG9mIGNoYXJzIGFuIGFydGljbGUgbXVzdCBoYXZlIGluIG9yZGVyIHRvIHJldHVybiBhIHJlc3VsdFxuICBERUZBVUxUX0NIQVJfVEhSRVNIT0xEOiA1MDAsXG5cbiAgLy8gQWxsIG9mIHRoZSByZWd1bGFyIGV4cHJlc3Npb25zIGluIHVzZSB3aXRoaW4gcmVhZGFiaWxpdHkuXG4gIC8vIERlZmluZWQgdXAgaGVyZSBzbyB3ZSBkb24ndCBpbnN0YW50aWF0ZSB0aGVtIHJlcGVhdGVkbHkgaW4gbG9vcHMuXG4gIFJFR0VYUFM6IHtcbiAgICAvLyBOT1RFOiBUaGVzZSB0d28gcmVndWxhciBleHByZXNzaW9ucyBhcmUgZHVwbGljYXRlZCBpblxuICAgIC8vIFJlYWRhYmlsaXR5LXJlYWRlcmFibGUuanMuIFBsZWFzZSBrZWVwIGJvdGggY29waWVzIGluIHN5bmMuXG4gICAgdW5saWtlbHlDYW5kaWRhdGVzOiAvLWFkLXxhaTJodG1sfGJhbm5lcnxicmVhZGNydW1ic3xjb21ieHxjb21tZW50fGNvbW11bml0eXxjb3Zlci13cmFwfGRpc3F1c3xleHRyYXxmb290ZXJ8Z2RwcnxoZWFkZXJ8bGVnZW5kc3xtZW51fHJlbGF0ZWR8cmVtYXJrfHJlcGxpZXN8cnNzfHNob3V0Ym94fHNpZGViYXJ8c2t5c2NyYXBlcnxzb2NpYWx8c3BvbnNvcnxzdXBwbGVtZW50YWx8YWQtYnJlYWt8YWdlZ2F0ZXxwYWdpbmF0aW9ufHBhZ2VyfHBvcHVwfHlvbS1yZW1vdGUvaSxcbiAgICBva01heWJlSXRzQUNhbmRpZGF0ZTogL2FuZHxhcnRpY2xlfGJvZHl8Y29sdW1ufGNvbnRlbnR8bWFpbnxzaGFkb3cvaSxcblxuICAgIHBvc2l0aXZlOiAvYXJ0aWNsZXxib2R5fGNvbnRlbnR8ZW50cnl8aGVudHJ5fGgtZW50cnl8bWFpbnxwYWdlfHBhZ2luYXRpb258cG9zdHx0ZXh0fGJsb2d8c3RvcnkvaSxcbiAgICBuZWdhdGl2ZTogLy1hZC18aGlkZGVufF5oaWQkfCBoaWQkfCBoaWQgfF5oaWQgfGJhbm5lcnxjb21ieHxjb21tZW50fGNvbS18Y29udGFjdHxmb290fGZvb3Rlcnxmb290bm90ZXxnZHByfG1hc3RoZWFkfG1lZGlhfG1ldGF8b3V0YnJhaW58cHJvbW98cmVsYXRlZHxzY3JvbGx8c2hhcmV8c2hvdXRib3h8c2lkZWJhcnxza3lzY3JhcGVyfHNwb25zb3J8c2hvcHBpbmd8dGFnc3x0b29sfHdpZGdldC9pLFxuICAgIGV4dHJhbmVvdXM6IC9wcmludHxhcmNoaXZlfGNvbW1lbnR8ZGlzY3Vzc3xlW1xcLV0/bWFpbHxzaGFyZXxyZXBseXxhbGx8bG9naW58c2lnbnxzaW5nbGV8dXRpbGl0eS9pLFxuICAgIGJ5bGluZTogL2J5bGluZXxhdXRob3J8ZGF0ZWxpbmV8d3JpdHRlbmJ5fHAtYXV0aG9yL2ksXG4gICAgcmVwbGFjZUZvbnRzOiAvPChcXC8/KWZvbnRbXj5dKj4vZ2ksXG4gICAgbm9ybWFsaXplOiAvXFxzezIsfS9nLFxuICAgIHZpZGVvczogL1xcL1xcLyh3d3dcXC4pPygoZGFpbHltb3Rpb258eW91dHViZXx5b3V0dWJlLW5vY29va2llfHBsYXllclxcLnZpbWVvfHZcXC5xcSlcXC5jb218KGFyY2hpdmV8dXBsb2FkXFwud2lraW1lZGlhKVxcLm9yZ3xwbGF5ZXJcXC50d2l0Y2hcXC50dikvaSxcbiAgICBzaGFyZUVsZW1lbnRzOiAvKFxcYnxfKShzaGFyZXxzaGFyZWRhZGR5KShcXGJ8XykvaSxcbiAgICBuZXh0TGluazogLyhuZXh0fHdlaXRlcnxjb250aW51ZXw+KFteXFx8XXwkKXzCuyhbXlxcfF18JCkpL2ksXG4gICAgcHJldkxpbms6IC8ocHJldnxlYXJsfG9sZHxuZXd8PHzCqykvaSxcbiAgICB0b2tlbml6ZTogL1xcVysvZyxcbiAgICB3aGl0ZXNwYWNlOiAvXlxccyokLyxcbiAgICBoYXNDb250ZW50OiAvXFxTJC8sXG4gICAgaGFzaFVybDogL14jLisvLFxuICAgIHNyY3NldFVybDogLyhcXFMrKShcXHMrW1xcZC5dK1t4d10pPyhcXHMqKD86LHwkKSkvZyxcbiAgICBiNjREYXRhVXJsOiAvXmRhdGE6XFxzKihbXlxcczssXSspXFxzKjtcXHMqYmFzZTY0XFxzKiwvaSxcbiAgICAvLyBDb21tYXMgYXMgdXNlZCBpbiBMYXRpbiwgU2luZGhpLCBDaGluZXNlIGFuZCB2YXJpb3VzIG90aGVyIHNjcmlwdHMuXG4gICAgLy8gc2VlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db21tYSNDb21tYV92YXJpYW50c1xuICAgIGNvbW1hczogL1xcdTAwMkN8XFx1MDYwQ3xcXHVGRTUwfFxcdUZFMTB8XFx1RkUxMXxcXHUyRTQxfFxcdTJFMzR8XFx1MkUzMnxcXHVGRjBDL2csXG4gICAgLy8gU2VlOiBodHRwczovL3NjaGVtYS5vcmcvQXJ0aWNsZVxuICAgIGpzb25MZEFydGljbGVUeXBlczogL15BcnRpY2xlfEFkdmVydGlzZXJDb250ZW50QXJ0aWNsZXxOZXdzQXJ0aWNsZXxBbmFseXNpc05ld3NBcnRpY2xlfEFza1B1YmxpY05ld3NBcnRpY2xlfEJhY2tncm91bmROZXdzQXJ0aWNsZXxPcGluaW9uTmV3c0FydGljbGV8UmVwb3J0YWdlTmV3c0FydGljbGV8UmV2aWV3TmV3c0FydGljbGV8UmVwb3J0fFNhdGlyaWNhbEFydGljbGV8U2Nob2xhcmx5QXJ0aWNsZXxNZWRpY2FsU2Nob2xhcmx5QXJ0aWNsZXxTb2NpYWxNZWRpYVBvc3Rpbmd8QmxvZ1Bvc3Rpbmd8TGl2ZUJsb2dQb3N0aW5nfERpc2N1c3Npb25Gb3J1bVBvc3Rpbmd8VGVjaEFydGljbGV8QVBJUmVmZXJlbmNlJC9cbiAgfSxcblxuICBVTkxJS0VMWV9ST0xFUzogWyBcIm1lbnVcIiwgXCJtZW51YmFyXCIsIFwiY29tcGxlbWVudGFyeVwiLCBcIm5hdmlnYXRpb25cIiwgXCJhbGVydFwiLCBcImFsZXJ0ZGlhbG9nXCIsIFwiZGlhbG9nXCIgXSxcblxuICBESVZfVE9fUF9FTEVNUzogbmV3IFNldChbIFwiQkxPQ0tRVU9URVwiLCBcIkRMXCIsIFwiRElWXCIsIFwiSU1HXCIsIFwiT0xcIiwgXCJQXCIsIFwiUFJFXCIsIFwiVEFCTEVcIiwgXCJVTFwiIF0pLFxuXG4gIEFMVEVSX1RPX0RJVl9FWENFUFRJT05TOiBbXCJESVZcIiwgXCJBUlRJQ0xFXCIsIFwiU0VDVElPTlwiLCBcIlBcIl0sXG5cbiAgUFJFU0VOVEFUSU9OQUxfQVRUUklCVVRFUzogWyBcImFsaWduXCIsIFwiYmFja2dyb3VuZFwiLCBcImJnY29sb3JcIiwgXCJib3JkZXJcIiwgXCJjZWxscGFkZGluZ1wiLCBcImNlbGxzcGFjaW5nXCIsIFwiZnJhbWVcIiwgXCJoc3BhY2VcIiwgXCJydWxlc1wiLCBcInN0eWxlXCIsIFwidmFsaWduXCIsIFwidnNwYWNlXCIgXSxcblxuICBERVBSRUNBVEVEX1NJWkVfQVRUUklCVVRFX0VMRU1TOiBbIFwiVEFCTEVcIiwgXCJUSFwiLCBcIlREXCIsIFwiSFJcIiwgXCJQUkVcIiBdLFxuXG4gIC8vIFRoZSBjb21tZW50ZWQgb3V0IGVsZW1lbnRzIHF1YWxpZnkgYXMgcGhyYXNpbmcgY29udGVudCBidXQgdGVuZCB0byBiZVxuICAvLyByZW1vdmVkIGJ5IHJlYWRhYmlsaXR5IHdoZW4gcHV0IGludG8gcGFyYWdyYXBocywgc28gd2UgaWdub3JlIHRoZW0gaGVyZS5cbiAgUEhSQVNJTkdfRUxFTVM6IFtcbiAgICAvLyBcIkNBTlZBU1wiLCBcIklGUkFNRVwiLCBcIlNWR1wiLCBcIlZJREVPXCIsXG4gICAgXCJBQkJSXCIsIFwiQVVESU9cIiwgXCJCXCIsIFwiQkRPXCIsIFwiQlJcIiwgXCJCVVRUT05cIiwgXCJDSVRFXCIsIFwiQ09ERVwiLCBcIkRBVEFcIixcbiAgICBcIkRBVEFMSVNUXCIsIFwiREZOXCIsIFwiRU1cIiwgXCJFTUJFRFwiLCBcIklcIiwgXCJJTUdcIiwgXCJJTlBVVFwiLCBcIktCRFwiLCBcIkxBQkVMXCIsXG4gICAgXCJNQVJLXCIsIFwiTUFUSFwiLCBcIk1FVEVSXCIsIFwiTk9TQ1JJUFRcIiwgXCJPQkpFQ1RcIiwgXCJPVVRQVVRcIiwgXCJQUk9HUkVTU1wiLCBcIlFcIixcbiAgICBcIlJVQllcIiwgXCJTQU1QXCIsIFwiU0NSSVBUXCIsIFwiU0VMRUNUXCIsIFwiU01BTExcIiwgXCJTUEFOXCIsIFwiU1RST05HXCIsIFwiU1VCXCIsXG4gICAgXCJTVVBcIiwgXCJURVhUQVJFQVwiLCBcIlRJTUVcIiwgXCJWQVJcIiwgXCJXQlJcIlxuICBdLFxuXG4gIC8vIFRoZXNlIGFyZSB0aGUgY2xhc3NlcyB0aGF0IHJlYWRhYmlsaXR5IHNldHMgaXRzZWxmLlxuICBDTEFTU0VTX1RPX1BSRVNFUlZFOiBbIFwicGFnZVwiIF0sXG5cbiAgLy8gVGhlc2UgYXJlIHRoZSBsaXN0IG9mIEhUTUwgZW50aXRpZXMgdGhhdCBuZWVkIHRvIGJlIGVzY2FwZWQuXG4gIEhUTUxfRVNDQVBFX01BUDoge1xuICAgIFwibHRcIjogXCI8XCIsXG4gICAgXCJndFwiOiBcIj5cIixcbiAgICBcImFtcFwiOiBcIiZcIixcbiAgICBcInF1b3RcIjogJ1wiJyxcbiAgICBcImFwb3NcIjogXCInXCIsXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJ1biBhbnkgcG9zdC1wcm9jZXNzIG1vZGlmaWNhdGlvbnMgdG8gYXJ0aWNsZSBjb250ZW50IGFzIG5lY2Vzc2FyeS5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHJldHVybiB2b2lkXG4gICoqL1xuICBfcG9zdFByb2Nlc3NDb250ZW50OiBmdW5jdGlvbihhcnRpY2xlQ29udGVudCkge1xuICAgIC8vIFJlYWRhYmlsaXR5IGNhbm5vdCBvcGVuIHJlbGF0aXZlIHVyaXMgc28gd2UgY29udmVydCB0aGVtIHRvIGFic29sdXRlIHVyaXMuXG4gICAgdGhpcy5fZml4UmVsYXRpdmVVcmlzKGFydGljbGVDb250ZW50KTtcblxuICAgIHRoaXMuX3NpbXBsaWZ5TmVzdGVkRWxlbWVudHMoYXJ0aWNsZUNvbnRlbnQpO1xuXG4gICAgaWYgKCF0aGlzLl9rZWVwQ2xhc3Nlcykge1xuICAgICAgLy8gUmVtb3ZlIGNsYXNzZXMuXG4gICAgICB0aGlzLl9jbGVhbkNsYXNzZXMoYXJ0aWNsZUNvbnRlbnQpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSXRlcmF0ZXMgb3ZlciBhIE5vZGVMaXN0LCBjYWxscyBgZmlsdGVyRm5gIGZvciBlYWNoIG5vZGUgYW5kIHJlbW92ZXMgbm9kZVxuICAgKiBpZiBmdW5jdGlvbiByZXR1cm5lZCBgdHJ1ZWAuXG4gICAqXG4gICAqIElmIGZ1bmN0aW9uIGlzIG5vdCBwYXNzZWQsIHJlbW92ZXMgYWxsIHRoZSBub2RlcyBpbiBub2RlIGxpc3QuXG4gICAqXG4gICAqIEBwYXJhbSBOb2RlTGlzdCBub2RlTGlzdCBUaGUgbm9kZXMgdG8gb3BlcmF0ZSBvblxuICAgKiBAcGFyYW0gRnVuY3Rpb24gZmlsdGVyRm4gdGhlIGZ1bmN0aW9uIHRvIHVzZSBhcyBhIGZpbHRlclxuICAgKiBAcmV0dXJuIHZvaWRcbiAgICovXG4gIF9yZW1vdmVOb2RlczogZnVuY3Rpb24obm9kZUxpc3QsIGZpbHRlckZuKSB7XG4gICAgLy8gQXZvaWQgZXZlciBvcGVyYXRpbmcgb24gbGl2ZSBub2RlIGxpc3RzLlxuICAgIGlmICh0aGlzLl9kb2NKU0RPTVBhcnNlciAmJiBub2RlTGlzdC5faXNMaXZlTm9kZUxpc3QpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkRvIG5vdCBwYXNzIGxpdmUgbm9kZSBsaXN0cyB0byBfcmVtb3ZlTm9kZXNcIik7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSBub2RlTGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIG5vZGUgPSBub2RlTGlzdFtpXTtcbiAgICAgIHZhciBwYXJlbnROb2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgaWYgKCFmaWx0ZXJGbiB8fCBmaWx0ZXJGbi5jYWxsKHRoaXMsIG5vZGUsIGksIG5vZGVMaXN0KSkge1xuICAgICAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIG92ZXIgYSBOb2RlTGlzdCwgYW5kIGNhbGxzIF9zZXROb2RlVGFnIGZvciBlYWNoIG5vZGUuXG4gICAqXG4gICAqIEBwYXJhbSBOb2RlTGlzdCBub2RlTGlzdCBUaGUgbm9kZXMgdG8gb3BlcmF0ZSBvblxuICAgKiBAcGFyYW0gU3RyaW5nIG5ld1RhZ05hbWUgdGhlIG5ldyB0YWcgbmFtZSB0byB1c2VcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBfcmVwbGFjZU5vZGVUYWdzOiBmdW5jdGlvbihub2RlTGlzdCwgbmV3VGFnTmFtZSkge1xuICAgIC8vIEF2b2lkIGV2ZXIgb3BlcmF0aW5nIG9uIGxpdmUgbm9kZSBsaXN0cy5cbiAgICBpZiAodGhpcy5fZG9jSlNET01QYXJzZXIgJiYgbm9kZUxpc3QuX2lzTGl2ZU5vZGVMaXN0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEbyBub3QgcGFzcyBsaXZlIG5vZGUgbGlzdHMgdG8gX3JlcGxhY2VOb2RlVGFnc1wiKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVMaXN0KSB7XG4gICAgICB0aGlzLl9zZXROb2RlVGFnKG5vZGUsIG5ld1RhZ05hbWUpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGEgTm9kZUxpc3QsIHdoaWNoIGRvZXNuJ3QgbmF0aXZlbHkgZnVsbHkgaW1wbGVtZW50IHRoZSBBcnJheVxuICAgKiBpbnRlcmZhY2UuXG4gICAqXG4gICAqIEZvciBjb252ZW5pZW5jZSwgdGhlIGN1cnJlbnQgb2JqZWN0IGNvbnRleHQgaXMgYXBwbGllZCB0byB0aGUgcHJvdmlkZWRcbiAgICogaXRlcmF0ZSBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtICBOb2RlTGlzdCBub2RlTGlzdCBUaGUgTm9kZUxpc3QuXG4gICAqIEBwYXJhbSAgRnVuY3Rpb24gZm4gICAgICAgVGhlIGl0ZXJhdGUgZnVuY3Rpb24uXG4gICAqIEByZXR1cm4gdm9pZFxuICAgKi9cbiAgX2ZvckVhY2hOb2RlOiBmdW5jdGlvbihub2RlTGlzdCwgZm4pIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKG5vZGVMaXN0LCBmbiwgdGhpcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBhIE5vZGVMaXN0LCBhbmQgcmV0dXJuIHRoZSBmaXJzdCBub2RlIHRoYXQgcGFzc2VzXG4gICAqIHRoZSBzdXBwbGllZCB0ZXN0IGZ1bmN0aW9uXG4gICAqXG4gICAqIEZvciBjb252ZW5pZW5jZSwgdGhlIGN1cnJlbnQgb2JqZWN0IGNvbnRleHQgaXMgYXBwbGllZCB0byB0aGUgcHJvdmlkZWRcbiAgICogdGVzdCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtICBOb2RlTGlzdCBub2RlTGlzdCBUaGUgTm9kZUxpc3QuXG4gICAqIEBwYXJhbSAgRnVuY3Rpb24gZm4gICAgICAgVGhlIHRlc3QgZnVuY3Rpb24uXG4gICAqIEByZXR1cm4gdm9pZFxuICAgKi9cbiAgX2ZpbmROb2RlOiBmdW5jdGlvbihub2RlTGlzdCwgZm4pIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmZpbmQuY2FsbChub2RlTGlzdCwgZm4sIHRoaXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgYSBOb2RlTGlzdCwgcmV0dXJuIHRydWUgaWYgYW55IG9mIHRoZSBwcm92aWRlZCBpdGVyYXRlXG4gICAqIGZ1bmN0aW9uIGNhbGxzIHJldHVybnMgdHJ1ZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKlxuICAgKiBGb3IgY29udmVuaWVuY2UsIHRoZSBjdXJyZW50IG9iamVjdCBjb250ZXh0IGlzIGFwcGxpZWQgdG8gdGhlXG4gICAqIHByb3ZpZGVkIGl0ZXJhdGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSAgTm9kZUxpc3Qgbm9kZUxpc3QgVGhlIE5vZGVMaXN0LlxuICAgKiBAcGFyYW0gIEZ1bmN0aW9uIGZuICAgICAgIFRoZSBpdGVyYXRlIGZ1bmN0aW9uLlxuICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICovXG4gIF9zb21lTm9kZTogZnVuY3Rpb24obm9kZUxpc3QsIGZuKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zb21lLmNhbGwobm9kZUxpc3QsIGZuLCB0aGlzKTtcbiAgfSxcblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGEgTm9kZUxpc3QsIHJldHVybiB0cnVlIGlmIGFsbCBvZiB0aGUgcHJvdmlkZWQgaXRlcmF0ZVxuICAgKiBmdW5jdGlvbiBjYWxscyByZXR1cm4gdHJ1ZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKlxuICAgKiBGb3IgY29udmVuaWVuY2UsIHRoZSBjdXJyZW50IG9iamVjdCBjb250ZXh0IGlzIGFwcGxpZWQgdG8gdGhlXG4gICAqIHByb3ZpZGVkIGl0ZXJhdGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSAgTm9kZUxpc3Qgbm9kZUxpc3QgVGhlIE5vZGVMaXN0LlxuICAgKiBAcGFyYW0gIEZ1bmN0aW9uIGZuICAgICAgIFRoZSBpdGVyYXRlIGZ1bmN0aW9uLlxuICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICovXG4gIF9ldmVyeU5vZGU6IGZ1bmN0aW9uKG5vZGVMaXN0LCBmbikge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuZXZlcnkuY2FsbChub2RlTGlzdCwgZm4sIHRoaXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDb25jYXQgYWxsIG5vZGVsaXN0cyBwYXNzZWQgYXMgYXJndW1lbnRzLlxuICAgKlxuICAgKiBAcmV0dXJuIC4uLk5vZGVMaXN0XG4gICAqIEByZXR1cm4gQXJyYXlcbiAgICovXG4gIF9jb25jYXROb2RlTGlzdHM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgbm9kZUxpc3RzID0gYXJncy5tYXAoZnVuY3Rpb24obGlzdCkge1xuICAgICAgcmV0dXJuIHNsaWNlLmNhbGwobGlzdCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIG5vZGVMaXN0cyk7XG4gIH0sXG5cbiAgX2dldEFsbE5vZGVzV2l0aFRhZzogZnVuY3Rpb24obm9kZSwgdGFnTmFtZXMpIHtcbiAgICBpZiAobm9kZS5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgICByZXR1cm4gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKHRhZ05hbWVzLmpvaW4oXCIsXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdLmNvbmNhdC5hcHBseShbXSwgdGFnTmFtZXMubWFwKGZ1bmN0aW9uKHRhZykge1xuICAgICAgdmFyIGNvbGxlY3Rpb24gPSBub2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZyk7XG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uKSA/IGNvbGxlY3Rpb24gOiBBcnJheS5mcm9tKGNvbGxlY3Rpb24pO1xuICAgIH0pKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgY2xhc3M9XCJcIiBhdHRyaWJ1dGUgZnJvbSBldmVyeSBlbGVtZW50IGluIHRoZSBnaXZlblxuICAgKiBzdWJ0cmVlLCBleGNlcHQgdGhvc2UgdGhhdCBtYXRjaCBDTEFTU0VTX1RPX1BSRVNFUlZFIGFuZFxuICAgKiB0aGUgY2xhc3Nlc1RvUHJlc2VydmUgYXJyYXkgZnJvbSB0aGUgb3B0aW9ucyBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSBFbGVtZW50XG4gICAqIEByZXR1cm4gdm9pZFxuICAgKi9cbiAgX2NsZWFuQ2xhc3NlczogZnVuY3Rpb24obm9kZSkge1xuICAgIHZhciBjbGFzc2VzVG9QcmVzZXJ2ZSA9IHRoaXMuX2NsYXNzZXNUb1ByZXNlcnZlO1xuICAgIHZhciBjbGFzc05hbWUgPSAobm9kZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuICAgICAgLnNwbGl0KC9cXHMrLylcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24oY2xzKSB7XG4gICAgICAgIHJldHVybiBjbGFzc2VzVG9QcmVzZXJ2ZS5pbmRleE9mKGNscykgIT0gLTE7XG4gICAgICB9KVxuICAgICAgLmpvaW4oXCIgXCIpO1xuXG4gICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgIH1cblxuICAgIGZvciAobm9kZSA9IG5vZGUuZmlyc3RFbGVtZW50Q2hpbGQ7IG5vZGU7IG5vZGUgPSBub2RlLm5leHRFbGVtZW50U2libGluZykge1xuICAgICAgdGhpcy5fY2xlYW5DbGFzc2VzKG5vZGUpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ29udmVydHMgZWFjaCA8YT4gYW5kIDxpbWc+IHVyaSBpbiB0aGUgZ2l2ZW4gZWxlbWVudCB0byBhbiBhYnNvbHV0ZSBVUkksXG4gICAqIGlnbm9yaW5nICNyZWYgVVJJcy5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBfZml4UmVsYXRpdmVVcmlzOiBmdW5jdGlvbihhcnRpY2xlQ29udGVudCkge1xuICAgIHZhciBiYXNlVVJJID0gdGhpcy5fZG9jLmJhc2VVUkk7XG4gICAgdmFyIGRvY3VtZW50VVJJID0gdGhpcy5fZG9jLmRvY3VtZW50VVJJO1xuICAgIGZ1bmN0aW9uIHRvQWJzb2x1dGVVUkkodXJpKSB7XG4gICAgICAvLyBMZWF2ZSBoYXNoIGxpbmtzIGFsb25lIGlmIHRoZSBiYXNlIFVSSSBtYXRjaGVzIHRoZSBkb2N1bWVudCBVUkk6XG4gICAgICBpZiAoYmFzZVVSSSA9PSBkb2N1bWVudFVSSSAmJiB1cmkuY2hhckF0KDApID09IFwiI1wiKSB7XG4gICAgICAgIHJldHVybiB1cmk7XG4gICAgICB9XG5cbiAgICAgIC8vIE90aGVyd2lzZSwgcmVzb2x2ZSBhZ2FpbnN0IGJhc2UgVVJJOlxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIG5ldyBVUkwodXJpLCBiYXNlVVJJKS5ocmVmO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgLy8gU29tZXRoaW5nIHdlbnQgd3JvbmcsIGp1c3QgcmV0dXJuIHRoZSBvcmlnaW5hbDpcbiAgICAgIH1cbiAgICAgIHJldHVybiB1cmk7XG4gICAgfVxuXG4gICAgdmFyIGxpbmtzID0gdGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKGFydGljbGVDb250ZW50LCBbXCJhXCJdKTtcbiAgICB0aGlzLl9mb3JFYWNoTm9kZShsaW5rcywgZnVuY3Rpb24obGluaykge1xuICAgICAgdmFyIGhyZWYgPSBsaW5rLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG4gICAgICBpZiAoaHJlZikge1xuICAgICAgICAvLyBSZW1vdmUgbGlua3Mgd2l0aCBqYXZhc2NyaXB0OiBVUklzLCBzaW5jZVxuICAgICAgICAvLyB0aGV5IHdvbid0IHdvcmsgYWZ0ZXIgc2NyaXB0cyBoYXZlIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwYWdlLlxuICAgICAgICBpZiAoaHJlZi5pbmRleE9mKFwiamF2YXNjcmlwdDpcIikgPT09IDApIHtcbiAgICAgICAgICAvLyBpZiB0aGUgbGluayBvbmx5IGNvbnRhaW5zIHNpbXBsZSB0ZXh0IGNvbnRlbnQsIGl0IGNhbiBiZSBjb252ZXJ0ZWQgdG8gYSB0ZXh0IG5vZGVcbiAgICAgICAgICBpZiAobGluay5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiBsaW5rLmNoaWxkTm9kZXNbMF0ubm9kZVR5cGUgPT09IHRoaXMuVEVYVF9OT0RFKSB7XG4gICAgICAgICAgICB2YXIgdGV4dCA9IHRoaXMuX2RvYy5jcmVhdGVUZXh0Tm9kZShsaW5rLnRleHRDb250ZW50KTtcbiAgICAgICAgICAgIGxpbmsucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQodGV4dCwgbGluayk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZSBsaW5rIGhhcyBtdWx0aXBsZSBjaGlsZHJlbiwgdGhleSBzaG91bGQgYWxsIGJlIHByZXNlcnZlZFxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuX2RvYy5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIHdoaWxlIChsaW5rLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxpbmsuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaW5rLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNvbnRhaW5lciwgbGluayk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCB0b0Fic29sdXRlVVJJKGhyZWYpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIG1lZGlhcyA9IHRoaXMuX2dldEFsbE5vZGVzV2l0aFRhZyhhcnRpY2xlQ29udGVudCwgW1xuICAgICAgXCJpbWdcIiwgXCJwaWN0dXJlXCIsIFwiZmlndXJlXCIsIFwidmlkZW9cIiwgXCJhdWRpb1wiLCBcInNvdXJjZVwiXG4gICAgXSk7XG5cbiAgICB0aGlzLl9mb3JFYWNoTm9kZShtZWRpYXMsIGZ1bmN0aW9uKG1lZGlhKSB7XG4gICAgICB2YXIgc3JjID0gbWVkaWEuZ2V0QXR0cmlidXRlKFwic3JjXCIpO1xuICAgICAgdmFyIHBvc3RlciA9IG1lZGlhLmdldEF0dHJpYnV0ZShcInBvc3RlclwiKTtcbiAgICAgIHZhciBzcmNzZXQgPSBtZWRpYS5nZXRBdHRyaWJ1dGUoXCJzcmNzZXRcIik7XG5cbiAgICAgIGlmIChzcmMpIHtcbiAgICAgICAgbWVkaWEuc2V0QXR0cmlidXRlKFwic3JjXCIsIHRvQWJzb2x1dGVVUkkoc3JjKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwb3N0ZXIpIHtcbiAgICAgICAgbWVkaWEuc2V0QXR0cmlidXRlKFwicG9zdGVyXCIsIHRvQWJzb2x1dGVVUkkocG9zdGVyKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzcmNzZXQpIHtcbiAgICAgICAgdmFyIG5ld1NyY3NldCA9IHNyY3NldC5yZXBsYWNlKHRoaXMuUkVHRVhQUy5zcmNzZXRVcmwsIGZ1bmN0aW9uKF8sIHAxLCBwMiwgcDMpIHtcbiAgICAgICAgICByZXR1cm4gdG9BYnNvbHV0ZVVSSShwMSkgKyAocDIgfHwgXCJcIikgKyBwMztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWVkaWEuc2V0QXR0cmlidXRlKFwic3Jjc2V0XCIsIG5ld1NyY3NldCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgX3NpbXBsaWZ5TmVzdGVkRWxlbWVudHM6IGZ1bmN0aW9uKGFydGljbGVDb250ZW50KSB7XG4gICAgdmFyIG5vZGUgPSBhcnRpY2xlQ29udGVudDtcblxuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICBpZiAobm9kZS5wYXJlbnROb2RlICYmIFtcIkRJVlwiLCBcIlNFQ1RJT05cIl0uaW5jbHVkZXMobm9kZS50YWdOYW1lKSAmJiAhKG5vZGUuaWQgJiYgbm9kZS5pZC5zdGFydHNXaXRoKFwicmVhZGFiaWxpdHlcIikpKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc0VsZW1lbnRXaXRob3V0Q29udGVudChub2RlKSkge1xuICAgICAgICAgIG5vZGUgPSB0aGlzLl9yZW1vdmVBbmRHZXROZXh0KG5vZGUpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2hhc1NpbmdsZVRhZ0luc2lkZUVsZW1lbnQobm9kZSwgXCJESVZcIikgfHwgdGhpcy5faGFzU2luZ2xlVGFnSW5zaWRlRWxlbWVudChub2RlLCBcIlNFQ1RJT05cIikpIHtcbiAgICAgICAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUobm9kZS5hdHRyaWJ1dGVzW2ldLm5hbWUsIG5vZGUuYXR0cmlidXRlc1tpXS52YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY2hpbGQsIG5vZGUpO1xuICAgICAgICAgIG5vZGUgPSBjaGlsZDtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBub2RlID0gdGhpcy5fZ2V0TmV4dE5vZGUobm9kZSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGFydGljbGUgdGl0bGUgYXMgYW4gSDEuXG4gICAqXG4gICAqIEByZXR1cm4gc3RyaW5nXG4gICAqKi9cbiAgX2dldEFydGljbGVUaXRsZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRvYyA9IHRoaXMuX2RvYztcbiAgICB2YXIgY3VyVGl0bGUgPSBcIlwiO1xuICAgIHZhciBvcmlnVGl0bGUgPSBcIlwiO1xuXG4gICAgdHJ5IHtcbiAgICAgIGN1clRpdGxlID0gb3JpZ1RpdGxlID0gZG9jLnRpdGxlLnRyaW0oKTtcblxuICAgICAgLy8gSWYgdGhleSBoYWQgYW4gZWxlbWVudCB3aXRoIGlkIFwidGl0bGVcIiBpbiB0aGVpciBIVE1MXG4gICAgICBpZiAodHlwZW9mIGN1clRpdGxlICE9PSBcInN0cmluZ1wiKVxuICAgICAgICBjdXJUaXRsZSA9IG9yaWdUaXRsZSA9IHRoaXMuX2dldElubmVyVGV4dChkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0aXRsZVwiKVswXSk7XG4gICAgfSBjYXRjaCAoZSkgey8qIGlnbm9yZSBleGNlcHRpb25zIHNldHRpbmcgdGhlIHRpdGxlLiAqL31cblxuICAgIHZhciB0aXRsZUhhZEhpZXJhcmNoaWNhbFNlcGFyYXRvcnMgPSBmYWxzZTtcbiAgICBmdW5jdGlvbiB3b3JkQ291bnQoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnNwbGl0KC9cXHMrLykubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlJ3MgYSBzZXBhcmF0b3IgaW4gdGhlIHRpdGxlLCBmaXJzdCByZW1vdmUgdGhlIGZpbmFsIHBhcnRcbiAgICBpZiAoKC8gW1xcfFxcLVxcXFxcXC8+wrtdIC8pLnRlc3QoY3VyVGl0bGUpKSB7XG4gICAgICB0aXRsZUhhZEhpZXJhcmNoaWNhbFNlcGFyYXRvcnMgPSAvIFtcXFxcXFwvPsK7XSAvLnRlc3QoY3VyVGl0bGUpO1xuICAgICAgY3VyVGl0bGUgPSBvcmlnVGl0bGUucmVwbGFjZSgvKC4qKVtcXHxcXC1cXFxcXFwvPsK7XSAuKi9naSwgXCIkMVwiKTtcblxuICAgICAgLy8gSWYgdGhlIHJlc3VsdGluZyB0aXRsZSBpcyB0b28gc2hvcnQgKDMgd29yZHMgb3IgZmV3ZXIpLCByZW1vdmVcbiAgICAgIC8vIHRoZSBmaXJzdCBwYXJ0IGluc3RlYWQ6XG4gICAgICBpZiAod29yZENvdW50KGN1clRpdGxlKSA8IDMpXG4gICAgICAgIGN1clRpdGxlID0gb3JpZ1RpdGxlLnJlcGxhY2UoL1teXFx8XFwtXFxcXFxcLz7Cu10qW1xcfFxcLVxcXFxcXC8+wrtdKC4qKS9naSwgXCIkMVwiKTtcbiAgICB9IGVsc2UgaWYgKGN1clRpdGxlLmluZGV4T2YoXCI6IFwiKSAhPT0gLTEpIHtcbiAgICAgIC8vIENoZWNrIGlmIHdlIGhhdmUgYW4gaGVhZGluZyBjb250YWluaW5nIHRoaXMgZXhhY3Qgc3RyaW5nLCBzbyB3ZVxuICAgICAgLy8gY291bGQgYXNzdW1lIGl0J3MgdGhlIGZ1bGwgdGl0bGUuXG4gICAgICB2YXIgaGVhZGluZ3MgPSB0aGlzLl9jb25jYXROb2RlTGlzdHMoXG4gICAgICAgIGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImgxXCIpLFxuICAgICAgICBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoMlwiKVxuICAgICAgKTtcbiAgICAgIHZhciB0cmltbWVkVGl0bGUgPSBjdXJUaXRsZS50cmltKCk7XG4gICAgICB2YXIgbWF0Y2ggPSB0aGlzLl9zb21lTm9kZShoZWFkaW5ncywgZnVuY3Rpb24oaGVhZGluZykge1xuICAgICAgICByZXR1cm4gaGVhZGluZy50ZXh0Q29udGVudC50cmltKCkgPT09IHRyaW1tZWRUaXRsZTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBJZiB3ZSBkb24ndCwgbGV0J3MgZXh0cmFjdCB0aGUgdGl0bGUgb3V0IG9mIHRoZSBvcmlnaW5hbCB0aXRsZSBzdHJpbmcuXG4gICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgIGN1clRpdGxlID0gb3JpZ1RpdGxlLnN1YnN0cmluZyhvcmlnVGl0bGUubGFzdEluZGV4T2YoXCI6XCIpICsgMSk7XG5cbiAgICAgICAgLy8gSWYgdGhlIHRpdGxlIGlzIG5vdyB0b28gc2hvcnQsIHRyeSB0aGUgZmlyc3QgY29sb24gaW5zdGVhZDpcbiAgICAgICAgaWYgKHdvcmRDb3VudChjdXJUaXRsZSkgPCAzKSB7XG4gICAgICAgICAgY3VyVGl0bGUgPSBvcmlnVGl0bGUuc3Vic3RyaW5nKG9yaWdUaXRsZS5pbmRleE9mKFwiOlwiKSArIDEpO1xuICAgICAgICAgIC8vIEJ1dCBpZiB3ZSBoYXZlIHRvbyBtYW55IHdvcmRzIGJlZm9yZSB0aGUgY29sb24gdGhlcmUncyBzb21ldGhpbmcgd2VpcmRcbiAgICAgICAgICAvLyB3aXRoIHRoZSB0aXRsZXMgYW5kIHRoZSBIIHRhZ3Mgc28gbGV0J3MganVzdCB1c2UgdGhlIG9yaWdpbmFsIHRpdGxlIGluc3RlYWRcbiAgICAgICAgfSBlbHNlIGlmICh3b3JkQ291bnQob3JpZ1RpdGxlLnN1YnN0cigwLCBvcmlnVGl0bGUuaW5kZXhPZihcIjpcIikpKSA+IDUpIHtcbiAgICAgICAgICBjdXJUaXRsZSA9IG9yaWdUaXRsZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY3VyVGl0bGUubGVuZ3RoID4gMTUwIHx8IGN1clRpdGxlLmxlbmd0aCA8IDE1KSB7XG4gICAgICB2YXIgaE9uZXMgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoMVwiKTtcblxuICAgICAgaWYgKGhPbmVzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgY3VyVGl0bGUgPSB0aGlzLl9nZXRJbm5lclRleHQoaE9uZXNbMF0pO1xuICAgIH1cblxuICAgIGN1clRpdGxlID0gY3VyVGl0bGUudHJpbSgpLnJlcGxhY2UodGhpcy5SRUdFWFBTLm5vcm1hbGl6ZSwgXCIgXCIpO1xuICAgIC8vIElmIHdlIG5vdyBoYXZlIDQgd29yZHMgb3IgZmV3ZXIgYXMgb3VyIHRpdGxlLCBhbmQgZWl0aGVyIG5vXG4gICAgLy8gJ2hpZXJhcmNoaWNhbCcgc2VwYXJhdG9ycyAoXFwsIC8sID4gb3IgwrspIHdlcmUgZm91bmQgaW4gdGhlIG9yaWdpbmFsXG4gICAgLy8gdGl0bGUgb3Igd2UgZGVjcmVhc2VkIHRoZSBudW1iZXIgb2Ygd29yZHMgYnkgbW9yZSB0aGFuIDEgd29yZCwgdXNlXG4gICAgLy8gdGhlIG9yaWdpbmFsIHRpdGxlLlxuICAgIHZhciBjdXJUaXRsZVdvcmRDb3VudCA9IHdvcmRDb3VudChjdXJUaXRsZSk7XG4gICAgaWYgKGN1clRpdGxlV29yZENvdW50IDw9IDQgJiZcbiAgICAgICAgKCF0aXRsZUhhZEhpZXJhcmNoaWNhbFNlcGFyYXRvcnMgfHxcbiAgICAgICAgIGN1clRpdGxlV29yZENvdW50ICE9IHdvcmRDb3VudChvcmlnVGl0bGUucmVwbGFjZSgvW1xcfFxcLVxcXFxcXC8+wrtdKy9nLCBcIlwiKSkgLSAxKSkge1xuICAgICAgY3VyVGl0bGUgPSBvcmlnVGl0bGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1clRpdGxlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBQcmVwYXJlIHRoZSBIVE1MIGRvY3VtZW50IGZvciByZWFkYWJpbGl0eSB0byBzY3JhcGUgaXQuXG4gICAqIFRoaXMgaW5jbHVkZXMgdGhpbmdzIGxpa2Ugc3RyaXBwaW5nIGphdmFzY3JpcHQsIENTUywgYW5kIGhhbmRsaW5nIHRlcnJpYmxlIG1hcmt1cC5cbiAgICpcbiAgICogQHJldHVybiB2b2lkXG4gICAqKi9cbiAgX3ByZXBEb2N1bWVudDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRvYyA9IHRoaXMuX2RvYztcblxuICAgIC8vIFJlbW92ZSBhbGwgc3R5bGUgdGFncyBpbiBoZWFkXG4gICAgdGhpcy5fcmVtb3ZlTm9kZXModGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKGRvYywgW1wic3R5bGVcIl0pKTtcblxuICAgIGlmIChkb2MuYm9keSkge1xuICAgICAgdGhpcy5fcmVwbGFjZUJycyhkb2MuYm9keSk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVwbGFjZU5vZGVUYWdzKHRoaXMuX2dldEFsbE5vZGVzV2l0aFRhZyhkb2MsIFtcImZvbnRcIl0pLCBcIlNQQU5cIik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZpbmRzIHRoZSBuZXh0IG5vZGUsIHN0YXJ0aW5nIGZyb20gdGhlIGdpdmVuIG5vZGUsIGFuZCBpZ25vcmluZ1xuICAgKiB3aGl0ZXNwYWNlIGluIGJldHdlZW4uIElmIHRoZSBnaXZlbiBub2RlIGlzIGFuIGVsZW1lbnQsIHRoZSBzYW1lIG5vZGUgaXNcbiAgICogcmV0dXJuZWQuXG4gICAqL1xuICBfbmV4dE5vZGU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdmFyIG5leHQgPSBub2RlO1xuICAgIHdoaWxlIChuZXh0XG4gICAgICAgICYmIChuZXh0Lm5vZGVUeXBlICE9IHRoaXMuRUxFTUVOVF9OT0RFKVxuICAgICAgICAmJiB0aGlzLlJFR0VYUFMud2hpdGVzcGFjZS50ZXN0KG5leHQudGV4dENvbnRlbnQpKSB7XG4gICAgICBuZXh0ID0gbmV4dC5uZXh0U2libGluZztcbiAgICB9XG4gICAgcmV0dXJuIG5leHQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIDIgb3IgbW9yZSBzdWNjZXNzaXZlIDxicj4gZWxlbWVudHMgd2l0aCBhIHNpbmdsZSA8cD4uXG4gICAqIFdoaXRlc3BhY2UgYmV0d2VlbiA8YnI+IGVsZW1lbnRzIGFyZSBpZ25vcmVkLiBGb3IgZXhhbXBsZTpcbiAgICogICA8ZGl2PmZvbzxicj5iYXI8YnI+IDxicj48YnI+YWJjPC9kaXY+XG4gICAqIHdpbGwgYmVjb21lOlxuICAgKiAgIDxkaXY+Zm9vPGJyPmJhcjxwPmFiYzwvcD48L2Rpdj5cbiAgICovXG4gIF9yZXBsYWNlQnJzOiBmdW5jdGlvbiAoZWxlbSkge1xuICAgIHRoaXMuX2ZvckVhY2hOb2RlKHRoaXMuX2dldEFsbE5vZGVzV2l0aFRhZyhlbGVtLCBbXCJiclwiXSksIGZ1bmN0aW9uKGJyKSB7XG4gICAgICB2YXIgbmV4dCA9IGJyLm5leHRTaWJsaW5nO1xuXG4gICAgICAvLyBXaGV0aGVyIDIgb3IgbW9yZSA8YnI+IGVsZW1lbnRzIGhhdmUgYmVlbiBmb3VuZCBhbmQgcmVwbGFjZWQgd2l0aCBhXG4gICAgICAvLyA8cD4gYmxvY2suXG4gICAgICB2YXIgcmVwbGFjZWQgPSBmYWxzZTtcblxuICAgICAgLy8gSWYgd2UgZmluZCBhIDxicj4gY2hhaW4sIHJlbW92ZSB0aGUgPGJyPnMgdW50aWwgd2UgaGl0IGFub3RoZXIgbm9kZVxuICAgICAgLy8gb3Igbm9uLXdoaXRlc3BhY2UuIFRoaXMgbGVhdmVzIGJlaGluZCB0aGUgZmlyc3QgPGJyPiBpbiB0aGUgY2hhaW5cbiAgICAgIC8vICh3aGljaCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggYSA8cD4gbGF0ZXIpLlxuICAgICAgd2hpbGUgKChuZXh0ID0gdGhpcy5fbmV4dE5vZGUobmV4dCkpICYmIChuZXh0LnRhZ05hbWUgPT0gXCJCUlwiKSkge1xuICAgICAgICByZXBsYWNlZCA9IHRydWU7XG4gICAgICAgIHZhciBiclNpYmxpbmcgPSBuZXh0Lm5leHRTaWJsaW5nO1xuICAgICAgICBuZXh0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobmV4dCk7XG4gICAgICAgIG5leHQgPSBiclNpYmxpbmc7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlIHJlbW92ZWQgYSA8YnI+IGNoYWluLCByZXBsYWNlIHRoZSByZW1haW5pbmcgPGJyPiB3aXRoIGEgPHA+LiBBZGRcbiAgICAgIC8vIGFsbCBzaWJsaW5nIG5vZGVzIGFzIGNoaWxkcmVuIG9mIHRoZSA8cD4gdW50aWwgd2UgaGl0IGFub3RoZXIgPGJyPlxuICAgICAgLy8gY2hhaW4uXG4gICAgICBpZiAocmVwbGFjZWQpIHtcbiAgICAgICAgdmFyIHAgPSB0aGlzLl9kb2MuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGJyLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHAsIGJyKTtcblxuICAgICAgICBuZXh0ID0gcC5uZXh0U2libGluZztcbiAgICAgICAgd2hpbGUgKG5leHQpIHtcbiAgICAgICAgICAvLyBJZiB3ZSd2ZSBoaXQgYW5vdGhlciA8YnI+PGJyPiwgd2UncmUgZG9uZSBhZGRpbmcgY2hpbGRyZW4gdG8gdGhpcyA8cD4uXG4gICAgICAgICAgaWYgKG5leHQudGFnTmFtZSA9PSBcIkJSXCIpIHtcbiAgICAgICAgICAgIHZhciBuZXh0RWxlbSA9IHRoaXMuX25leHROb2RlKG5leHQubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgaWYgKG5leHRFbGVtICYmIG5leHRFbGVtLnRhZ05hbWUgPT0gXCJCUlwiKVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXRoaXMuX2lzUGhyYXNpbmdDb250ZW50KG5leHQpKVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAvLyBPdGhlcndpc2UsIG1ha2UgdGhpcyBub2RlIGEgY2hpbGQgb2YgdGhlIG5ldyA8cD4uXG4gICAgICAgICAgdmFyIHNpYmxpbmcgPSBuZXh0Lm5leHRTaWJsaW5nO1xuICAgICAgICAgIHAuYXBwZW5kQ2hpbGQobmV4dCk7XG4gICAgICAgICAgbmV4dCA9IHNpYmxpbmc7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAocC5sYXN0Q2hpbGQgJiYgdGhpcy5faXNXaGl0ZXNwYWNlKHAubGFzdENoaWxkKSkge1xuICAgICAgICAgIHAucmVtb3ZlQ2hpbGQocC5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHAucGFyZW50Tm9kZS50YWdOYW1lID09PSBcIlBcIilcbiAgICAgICAgICB0aGlzLl9zZXROb2RlVGFnKHAucGFyZW50Tm9kZSwgXCJESVZcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgX3NldE5vZGVUYWc6IGZ1bmN0aW9uIChub2RlLCB0YWcpIHtcbiAgICB0aGlzLmxvZyhcIl9zZXROb2RlVGFnXCIsIG5vZGUsIHRhZyk7XG4gICAgaWYgKHRoaXMuX2RvY0pTRE9NUGFyc2VyKSB7XG4gICAgICBub2RlLmxvY2FsTmFtZSA9IHRhZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgbm9kZS50YWdOYW1lID0gdGFnLnRvVXBwZXJDYXNlKCk7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICB2YXIgcmVwbGFjZW1lbnQgPSBub2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgIHdoaWxlIChub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHJlcGxhY2VtZW50LmFwcGVuZENoaWxkKG5vZGUuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIG5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocmVwbGFjZW1lbnQsIG5vZGUpO1xuICAgIGlmIChub2RlLnJlYWRhYmlsaXR5KVxuICAgICAgcmVwbGFjZW1lbnQucmVhZGFiaWxpdHkgPSBub2RlLnJlYWRhYmlsaXR5O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcGxhY2VtZW50LnNldEF0dHJpYnV0ZShub2RlLmF0dHJpYnV0ZXNbaV0ubmFtZSwgbm9kZS5hdHRyaWJ1dGVzW2ldLnZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIC8qIGl0J3MgcG9zc2libGUgZm9yIHNldEF0dHJpYnV0ZSgpIHRvIHRocm93IGlmIHRoZSBhdHRyaWJ1dGUgbmFtZVxuICAgICAgICAgKiBpc24ndCBhIHZhbGlkIFhNTCBOYW1lLiBTdWNoIGF0dHJpYnV0ZXMgY2FuIGhvd2V2ZXIgYmUgcGFyc2VkIGZyb21cbiAgICAgICAgICogc291cmNlIGluIEhUTUwgZG9jcywgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93aGF0d2cvaHRtbC9pc3N1ZXMvNDI3NSxcbiAgICAgICAgICogc28gd2UgY2FuIGhpdCB0aGVtIGhlcmUgYW5kIHRoZW4gdGhyb3cuIFdlIGRvbid0IGNhcmUgYWJvdXQgc3VjaFxuICAgICAgICAgKiBhdHRyaWJ1dGVzIHNvIHdlIGlnbm9yZSB0aGVtLlxuICAgICAgICAgKi9cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcGxhY2VtZW50O1xuICB9LFxuXG4gIC8qKlxuICAgKiBQcmVwYXJlIHRoZSBhcnRpY2xlIG5vZGUgZm9yIGRpc3BsYXkuIENsZWFuIG91dCBhbnkgaW5saW5lIHN0eWxlcyxcbiAgICogaWZyYW1lcywgZm9ybXMsIHN0cmlwIGV4dHJhbmVvdXMgPHA+IHRhZ3MsIGV0Yy5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHJldHVybiB2b2lkXG4gICAqKi9cbiAgX3ByZXBBcnRpY2xlOiBmdW5jdGlvbihhcnRpY2xlQ29udGVudCkge1xuICAgIHRoaXMuX2NsZWFuU3R5bGVzKGFydGljbGVDb250ZW50KTtcblxuICAgIC8vIENoZWNrIGZvciBkYXRhIHRhYmxlcyBiZWZvcmUgd2UgY29udGludWUsIHRvIGF2b2lkIHJlbW92aW5nIGl0ZW1zIGluXG4gICAgLy8gdGhvc2UgdGFibGVzLCB3aGljaCB3aWxsIG9mdGVuIGJlIGlzb2xhdGVkIGV2ZW4gdGhvdWdoIHRoZXkncmVcbiAgICAvLyB2aXN1YWxseSBsaW5rZWQgdG8gb3RoZXIgY29udGVudC1mdWwgZWxlbWVudHMgKHRleHQsIGltYWdlcywgZXRjLikuXG4gICAgdGhpcy5fbWFya0RhdGFUYWJsZXMoYXJ0aWNsZUNvbnRlbnQpO1xuXG4gICAgdGhpcy5fZml4TGF6eUltYWdlcyhhcnRpY2xlQ29udGVudCk7XG5cbiAgICAvLyBDbGVhbiBvdXQganVuayBmcm9tIHRoZSBhcnRpY2xlIGNvbnRlbnRcbiAgICB0aGlzLl9jbGVhbkNvbmRpdGlvbmFsbHkoYXJ0aWNsZUNvbnRlbnQsIFwiZm9ybVwiKTtcbiAgICB0aGlzLl9jbGVhbkNvbmRpdGlvbmFsbHkoYXJ0aWNsZUNvbnRlbnQsIFwiZmllbGRzZXRcIik7XG4gICAgdGhpcy5fY2xlYW4oYXJ0aWNsZUNvbnRlbnQsIFwib2JqZWN0XCIpO1xuICAgIHRoaXMuX2NsZWFuKGFydGljbGVDb250ZW50LCBcImVtYmVkXCIpO1xuICAgIHRoaXMuX2NsZWFuKGFydGljbGVDb250ZW50LCBcImZvb3RlclwiKTtcbiAgICB0aGlzLl9jbGVhbihhcnRpY2xlQ29udGVudCwgXCJsaW5rXCIpO1xuICAgIHRoaXMuX2NsZWFuKGFydGljbGVDb250ZW50LCBcImFzaWRlXCIpO1xuXG4gICAgLy8gQ2xlYW4gb3V0IGVsZW1lbnRzIHdpdGggbGl0dGxlIGNvbnRlbnQgdGhhdCBoYXZlIFwic2hhcmVcIiBpbiB0aGVpciBpZC9jbGFzcyBjb21iaW5hdGlvbnMgZnJvbSBmaW5hbCB0b3AgY2FuZGlkYXRlcyxcbiAgICAvLyB3aGljaCBtZWFucyB3ZSBkb24ndCByZW1vdmUgdGhlIHRvcCBjYW5kaWRhdGVzIGV2ZW4gdGhleSBoYXZlIFwic2hhcmVcIi5cblxuICAgIHZhciBzaGFyZUVsZW1lbnRUaHJlc2hvbGQgPSB0aGlzLkRFRkFVTFRfQ0hBUl9USFJFU0hPTEQ7XG5cbiAgICB0aGlzLl9mb3JFYWNoTm9kZShhcnRpY2xlQ29udGVudC5jaGlsZHJlbiwgZnVuY3Rpb24gKHRvcENhbmRpZGF0ZSkge1xuICAgICAgdGhpcy5fY2xlYW5NYXRjaGVkTm9kZXModG9wQ2FuZGlkYXRlLCBmdW5jdGlvbiAobm9kZSwgbWF0Y2hTdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuUkVHRVhQUy5zaGFyZUVsZW1lbnRzLnRlc3QobWF0Y2hTdHJpbmcpICYmIG5vZGUudGV4dENvbnRlbnQubGVuZ3RoIDwgc2hhcmVFbGVtZW50VGhyZXNob2xkO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jbGVhbihhcnRpY2xlQ29udGVudCwgXCJpZnJhbWVcIik7XG4gICAgdGhpcy5fY2xlYW4oYXJ0aWNsZUNvbnRlbnQsIFwiaW5wdXRcIik7XG4gICAgdGhpcy5fY2xlYW4oYXJ0aWNsZUNvbnRlbnQsIFwidGV4dGFyZWFcIik7XG4gICAgdGhpcy5fY2xlYW4oYXJ0aWNsZUNvbnRlbnQsIFwic2VsZWN0XCIpO1xuICAgIHRoaXMuX2NsZWFuKGFydGljbGVDb250ZW50LCBcImJ1dHRvblwiKTtcbiAgICB0aGlzLl9jbGVhbkhlYWRlcnMoYXJ0aWNsZUNvbnRlbnQpO1xuXG4gICAgLy8gRG8gdGhlc2UgbGFzdCBhcyB0aGUgcHJldmlvdXMgc3R1ZmYgbWF5IGhhdmUgcmVtb3ZlZCBqdW5rXG4gICAgLy8gdGhhdCB3aWxsIGFmZmVjdCB0aGVzZVxuICAgIHRoaXMuX2NsZWFuQ29uZGl0aW9uYWxseShhcnRpY2xlQ29udGVudCwgXCJ0YWJsZVwiKTtcbiAgICB0aGlzLl9jbGVhbkNvbmRpdGlvbmFsbHkoYXJ0aWNsZUNvbnRlbnQsIFwidWxcIik7XG4gICAgdGhpcy5fY2xlYW5Db25kaXRpb25hbGx5KGFydGljbGVDb250ZW50LCBcImRpdlwiKTtcblxuICAgIC8vIHJlcGxhY2UgSDEgd2l0aCBIMiBhcyBIMSBzaG91bGQgYmUgb25seSB0aXRsZSB0aGF0IGlzIGRpc3BsYXllZCBzZXBhcmF0ZWx5XG4gICAgdGhpcy5fcmVwbGFjZU5vZGVUYWdzKHRoaXMuX2dldEFsbE5vZGVzV2l0aFRhZyhhcnRpY2xlQ29udGVudCwgW1wiaDFcIl0pLCBcImgyXCIpO1xuXG4gICAgLy8gUmVtb3ZlIGV4dHJhIHBhcmFncmFwaHNcbiAgICB0aGlzLl9yZW1vdmVOb2Rlcyh0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcoYXJ0aWNsZUNvbnRlbnQsIFtcInBcIl0pLCBmdW5jdGlvbiAocGFyYWdyYXBoKSB7XG4gICAgICB2YXIgaW1nQ291bnQgPSBwYXJhZ3JhcGguZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWdcIikubGVuZ3RoO1xuICAgICAgdmFyIGVtYmVkQ291bnQgPSBwYXJhZ3JhcGguZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJlbWJlZFwiKS5sZW5ndGg7XG4gICAgICB2YXIgb2JqZWN0Q291bnQgPSBwYXJhZ3JhcGguZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJvYmplY3RcIikubGVuZ3RoO1xuICAgICAgLy8gQXQgdGhpcyBwb2ludCwgbmFzdHkgaWZyYW1lcyBoYXZlIGJlZW4gcmVtb3ZlZCwgb25seSByZW1haW4gZW1iZWRkZWQgdmlkZW8gb25lcy5cbiAgICAgIHZhciBpZnJhbWVDb3VudCA9IHBhcmFncmFwaC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlmcmFtZVwiKS5sZW5ndGg7XG4gICAgICB2YXIgdG90YWxDb3VudCA9IGltZ0NvdW50ICsgZW1iZWRDb3VudCArIG9iamVjdENvdW50ICsgaWZyYW1lQ291bnQ7XG5cbiAgICAgIHJldHVybiB0b3RhbENvdW50ID09PSAwICYmICF0aGlzLl9nZXRJbm5lclRleHQocGFyYWdyYXBoLCBmYWxzZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9mb3JFYWNoTm9kZSh0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcoYXJ0aWNsZUNvbnRlbnQsIFtcImJyXCJdKSwgZnVuY3Rpb24oYnIpIHtcbiAgICAgIHZhciBuZXh0ID0gdGhpcy5fbmV4dE5vZGUoYnIubmV4dFNpYmxpbmcpO1xuICAgICAgaWYgKG5leHQgJiYgbmV4dC50YWdOYW1lID09IFwiUFwiKVxuICAgICAgICBici5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJyKTtcbiAgICB9KTtcblxuICAgIC8vIFJlbW92ZSBzaW5nbGUtY2VsbCB0YWJsZXNcbiAgICB0aGlzLl9mb3JFYWNoTm9kZSh0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcoYXJ0aWNsZUNvbnRlbnQsIFtcInRhYmxlXCJdKSwgZnVuY3Rpb24odGFibGUpIHtcbiAgICAgIHZhciB0Ym9keSA9IHRoaXMuX2hhc1NpbmdsZVRhZ0luc2lkZUVsZW1lbnQodGFibGUsIFwiVEJPRFlcIikgPyB0YWJsZS5maXJzdEVsZW1lbnRDaGlsZCA6IHRhYmxlO1xuICAgICAgaWYgKHRoaXMuX2hhc1NpbmdsZVRhZ0luc2lkZUVsZW1lbnQodGJvZHksIFwiVFJcIikpIHtcbiAgICAgICAgdmFyIHJvdyA9IHRib2R5LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICBpZiAodGhpcy5faGFzU2luZ2xlVGFnSW5zaWRlRWxlbWVudChyb3csIFwiVERcIikpIHtcbiAgICAgICAgICB2YXIgY2VsbCA9IHJvdy5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICBjZWxsID0gdGhpcy5fc2V0Tm9kZVRhZyhjZWxsLCB0aGlzLl9ldmVyeU5vZGUoY2VsbC5jaGlsZE5vZGVzLCB0aGlzLl9pc1BocmFzaW5nQ29udGVudCkgPyBcIlBcIiA6IFwiRElWXCIpO1xuICAgICAgICAgIHRhYmxlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNlbGwsIHRhYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGEgbm9kZSB3aXRoIHRoZSByZWFkYWJpbGl0eSBvYmplY3QuIEFsc28gY2hlY2tzIHRoZVxuICAgKiBjbGFzc05hbWUvaWQgZm9yIHNwZWNpYWwgbmFtZXMgdG8gYWRkIHRvIGl0cyBzY29yZS5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHJldHVybiB2b2lkXG4gICoqL1xuICBfaW5pdGlhbGl6ZU5vZGU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBub2RlLnJlYWRhYmlsaXR5ID0ge1wiY29udGVudFNjb3JlXCI6IDB9O1xuXG4gICAgc3dpdGNoIChub2RlLnRhZ05hbWUpIHtcbiAgICAgIGNhc2UgXCJESVZcIjpcbiAgICAgICAgbm9kZS5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmUgKz0gNTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJQUkVcIjpcbiAgICAgIGNhc2UgXCJURFwiOlxuICAgICAgY2FzZSBcIkJMT0NLUVVPVEVcIjpcbiAgICAgICAgbm9kZS5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmUgKz0gMztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJBRERSRVNTXCI6XG4gICAgICBjYXNlIFwiT0xcIjpcbiAgICAgIGNhc2UgXCJVTFwiOlxuICAgICAgY2FzZSBcIkRMXCI6XG4gICAgICBjYXNlIFwiRERcIjpcbiAgICAgIGNhc2UgXCJEVFwiOlxuICAgICAgY2FzZSBcIkxJXCI6XG4gICAgICBjYXNlIFwiRk9STVwiOlxuICAgICAgICBub2RlLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZSAtPSAzO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIkgxXCI6XG4gICAgICBjYXNlIFwiSDJcIjpcbiAgICAgIGNhc2UgXCJIM1wiOlxuICAgICAgY2FzZSBcIkg0XCI6XG4gICAgICBjYXNlIFwiSDVcIjpcbiAgICAgIGNhc2UgXCJINlwiOlxuICAgICAgY2FzZSBcIlRIXCI6XG4gICAgICAgIG5vZGUucmVhZGFiaWxpdHkuY29udGVudFNjb3JlIC09IDU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIG5vZGUucmVhZGFiaWxpdHkuY29udGVudFNjb3JlICs9IHRoaXMuX2dldENsYXNzV2VpZ2h0KG5vZGUpO1xuICB9LFxuXG4gIF9yZW1vdmVBbmRHZXROZXh0OiBmdW5jdGlvbihub2RlKSB7XG4gICAgdmFyIG5leHROb2RlID0gdGhpcy5fZ2V0TmV4dE5vZGUobm9kZSwgdHJ1ZSk7XG4gICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgIHJldHVybiBuZXh0Tm9kZTtcbiAgfSxcblxuICAvKipcbiAgICogVHJhdmVyc2UgdGhlIERPTSBmcm9tIG5vZGUgdG8gbm9kZSwgc3RhcnRpbmcgYXQgdGhlIG5vZGUgcGFzc2VkIGluLlxuICAgKiBQYXNzIHRydWUgZm9yIHRoZSBzZWNvbmQgcGFyYW1ldGVyIHRvIGluZGljYXRlIHRoaXMgbm9kZSBpdHNlbGZcbiAgICogKGFuZCBpdHMga2lkcykgYXJlIGdvaW5nIGF3YXksIGFuZCB3ZSB3YW50IHRoZSBuZXh0IG5vZGUgb3Zlci5cbiAgICpcbiAgICogQ2FsbGluZyB0aGlzIGluIGEgbG9vcCB3aWxsIHRyYXZlcnNlIHRoZSBET00gZGVwdGgtZmlyc3QuXG4gICAqL1xuICBfZ2V0TmV4dE5vZGU6IGZ1bmN0aW9uKG5vZGUsIGlnbm9yZVNlbGZBbmRLaWRzKSB7XG4gICAgLy8gRmlyc3QgY2hlY2sgZm9yIGtpZHMgaWYgdGhvc2UgYXJlbid0IGJlaW5nIGlnbm9yZWRcbiAgICBpZiAoIWlnbm9yZVNlbGZBbmRLaWRzICYmIG5vZGUuZmlyc3RFbGVtZW50Q2hpbGQpIHtcbiAgICAgIHJldHVybiBub2RlLmZpcnN0RWxlbWVudENoaWxkO1xuICAgIH1cbiAgICAvLyBUaGVuIGZvciBzaWJsaW5ncy4uLlxuICAgIGlmIChub2RlLm5leHRFbGVtZW50U2libGluZykge1xuICAgICAgcmV0dXJuIG5vZGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgIH1cbiAgICAvLyBBbmQgZmluYWxseSwgbW92ZSB1cCB0aGUgcGFyZW50IGNoYWluICphbmQqIGZpbmQgYSBzaWJsaW5nXG4gICAgLy8gKGJlY2F1c2UgdGhpcyBpcyBkZXB0aC1maXJzdCB0cmF2ZXJzYWwsIHdlIHdpbGwgaGF2ZSBhbHJlYWR5XG4gICAgLy8gc2VlbiB0aGUgcGFyZW50IG5vZGVzIHRoZW1zZWx2ZXMpLlxuICAgIGRvIHtcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAobm9kZSAmJiAhbm9kZS5uZXh0RWxlbWVudFNpYmxpbmcpO1xuICAgIHJldHVybiBub2RlICYmIG5vZGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuICB9LFxuXG4gIC8vIGNvbXBhcmVzIHNlY29uZCB0ZXh0IHRvIGZpcnN0IG9uZVxuICAvLyAxID0gc2FtZSB0ZXh0LCAwID0gY29tcGxldGVseSBkaWZmZXJlbnQgdGV4dFxuICAvLyB3b3JrcyB0aGUgd2F5IHRoYXQgaXQgc3BsaXRzIGJvdGggdGV4dHMgaW50byB3b3JkcyBhbmQgdGhlbiBmaW5kcyB3b3JkcyB0aGF0IGFyZSB1bmlxdWUgaW4gc2Vjb25kIHRleHRcbiAgLy8gdGhlIHJlc3VsdCBpcyBnaXZlbiBieSB0aGUgbG93ZXIgbGVuZ3RoIG9mIHVuaXF1ZSBwYXJ0c1xuICBfdGV4dFNpbWlsYXJpdHk6IGZ1bmN0aW9uKHRleHRBLCB0ZXh0Qikge1xuICAgIHZhciB0b2tlbnNBID0gdGV4dEEudG9Mb3dlckNhc2UoKS5zcGxpdCh0aGlzLlJFR0VYUFMudG9rZW5pemUpLmZpbHRlcihCb29sZWFuKTtcbiAgICB2YXIgdG9rZW5zQiA9IHRleHRCLnRvTG93ZXJDYXNlKCkuc3BsaXQodGhpcy5SRUdFWFBTLnRva2VuaXplKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgaWYgKCF0b2tlbnNBLmxlbmd0aCB8fCAhdG9rZW5zQi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICB2YXIgdW5pcVRva2Vuc0IgPSB0b2tlbnNCLmZpbHRlcih0b2tlbiA9PiAhdG9rZW5zQS5pbmNsdWRlcyh0b2tlbikpO1xuICAgIHZhciBkaXN0YW5jZUIgPSB1bmlxVG9rZW5zQi5qb2luKFwiIFwiKS5sZW5ndGggLyB0b2tlbnNCLmpvaW4oXCIgXCIpLmxlbmd0aDtcbiAgICByZXR1cm4gMSAtIGRpc3RhbmNlQjtcbiAgfSxcblxuICBfY2hlY2tCeWxpbmU6IGZ1bmN0aW9uKG5vZGUsIG1hdGNoU3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX2FydGljbGVCeWxpbmUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5nZXRBdHRyaWJ1dGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHJlbCA9IG5vZGUuZ2V0QXR0cmlidXRlKFwicmVsXCIpO1xuICAgICAgdmFyIGl0ZW1wcm9wID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJpdGVtcHJvcFwiKTtcbiAgICB9XG5cbiAgICBpZiAoKHJlbCA9PT0gXCJhdXRob3JcIiB8fCAoaXRlbXByb3AgJiYgaXRlbXByb3AuaW5kZXhPZihcImF1dGhvclwiKSAhPT0gLTEpIHx8IHRoaXMuUkVHRVhQUy5ieWxpbmUudGVzdChtYXRjaFN0cmluZykpICYmIHRoaXMuX2lzVmFsaWRCeWxpbmUobm9kZS50ZXh0Q29udGVudCkpIHtcbiAgICAgIHRoaXMuX2FydGljbGVCeWxpbmUgPSBub2RlLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBfZ2V0Tm9kZUFuY2VzdG9yczogZnVuY3Rpb24obm9kZSwgbWF4RGVwdGgpIHtcbiAgICBtYXhEZXB0aCA9IG1heERlcHRoIHx8IDA7XG4gICAgdmFyIGkgPSAwLCBhbmNlc3RvcnMgPSBbXTtcbiAgICB3aGlsZSAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICBhbmNlc3RvcnMucHVzaChub2RlLnBhcmVudE5vZGUpO1xuICAgICAgaWYgKG1heERlcHRoICYmICsraSA9PT0gbWF4RGVwdGgpXG4gICAgICAgIGJyZWFrO1xuICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGFuY2VzdG9ycztcbiAgfSxcblxuICAvKioqXG4gICAqIGdyYWJBcnRpY2xlIC0gVXNpbmcgYSB2YXJpZXR5IG9mIG1ldHJpY3MgKGNvbnRlbnQgc2NvcmUsIGNsYXNzbmFtZSwgZWxlbWVudCB0eXBlcyksIGZpbmQgdGhlIGNvbnRlbnQgdGhhdCBpc1xuICAgKiAgICAgICAgIG1vc3QgbGlrZWx5IHRvIGJlIHRoZSBzdHVmZiBhIHVzZXIgd2FudHMgdG8gcmVhZC4gVGhlbiByZXR1cm4gaXQgd3JhcHBlZCB1cCBpbiBhIGRpdi5cbiAgICpcbiAgICogQHBhcmFtIHBhZ2UgYSBkb2N1bWVudCB0byBydW4gdXBvbi4gTmVlZHMgdG8gYmUgYSBmdWxsIGRvY3VtZW50LCBjb21wbGV0ZSB3aXRoIGJvZHkuXG4gICAqIEByZXR1cm4gRWxlbWVudFxuICAqKi9cbiAgX2dyYWJBcnRpY2xlOiBmdW5jdGlvbiAocGFnZSkge1xuICAgIHRoaXMubG9nKFwiKioqKiBncmFiQXJ0aWNsZSAqKioqXCIpO1xuICAgIHZhciBkb2MgPSB0aGlzLl9kb2M7XG4gICAgdmFyIGlzUGFnaW5nID0gcGFnZSAhPT0gbnVsbDtcbiAgICBwYWdlID0gcGFnZSA/IHBhZ2UgOiB0aGlzLl9kb2MuYm9keTtcblxuICAgIC8vIFdlIGNhbid0IGdyYWIgYW4gYXJ0aWNsZSBpZiB3ZSBkb24ndCBoYXZlIGEgcGFnZSFcbiAgICBpZiAoIXBhZ2UpIHtcbiAgICAgIHRoaXMubG9nKFwiTm8gYm9keSBmb3VuZCBpbiBkb2N1bWVudC4gQWJvcnQuXCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHBhZ2VDYWNoZUh0bWwgPSBwYWdlLmlubmVySFRNTDtcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB0aGlzLmxvZyhcIlN0YXJ0aW5nIGdyYWJBcnRpY2xlIGxvb3BcIik7XG4gICAgICB2YXIgc3RyaXBVbmxpa2VseUNhbmRpZGF0ZXMgPSB0aGlzLl9mbGFnSXNBY3RpdmUodGhpcy5GTEFHX1NUUklQX1VOTElLRUxZUyk7XG5cbiAgICAgIC8vIEZpcnN0LCBub2RlIHByZXBwaW5nLiBUcmFzaCBub2RlcyB0aGF0IGxvb2sgY3J1ZGR5IChsaWtlIG9uZXMgd2l0aCB0aGVcbiAgICAgIC8vIGNsYXNzIG5hbWUgXCJjb21tZW50XCIsIGV0YyksIGFuZCB0dXJuIGRpdnMgaW50byBQIHRhZ3Mgd2hlcmUgdGhleSBoYXZlIGJlZW5cbiAgICAgIC8vIHVzZWQgaW5hcHByb3ByaWF0ZWx5IChhcyBpbiwgd2hlcmUgdGhleSBjb250YWluIG5vIG90aGVyIGJsb2NrIGxldmVsIGVsZW1lbnRzLilcbiAgICAgIHZhciBlbGVtZW50c1RvU2NvcmUgPSBbXTtcbiAgICAgIHZhciBub2RlID0gdGhpcy5fZG9jLmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgbGV0IHNob3VsZFJlbW92ZVRpdGxlSGVhZGVyID0gdHJ1ZTtcblxuICAgICAgd2hpbGUgKG5vZGUpIHtcblxuICAgICAgICBpZiAobm9kZS50YWdOYW1lID09PSBcIkhUTUxcIikge1xuICAgICAgICAgIHRoaXMuX2FydGljbGVMYW5nID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1hdGNoU3RyaW5nID0gbm9kZS5jbGFzc05hbWUgKyBcIiBcIiArIG5vZGUuaWQ7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc1Byb2JhYmx5VmlzaWJsZShub2RlKSkge1xuICAgICAgICAgIHRoaXMubG9nKFwiUmVtb3ZpbmcgaGlkZGVuIG5vZGUgLSBcIiArIG1hdGNoU3RyaW5nKTtcbiAgICAgICAgICBub2RlID0gdGhpcy5fcmVtb3ZlQW5kR2V0TmV4dChub2RlKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVzZXIgaXMgbm90IGFibGUgdG8gc2VlIGVsZW1lbnRzIGFwcGxpZWQgd2l0aCBib3RoIFwiYXJpYS1tb2RhbCA9IHRydWVcIiBhbmQgXCJyb2xlID0gZGlhbG9nXCJcbiAgICAgICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKFwiYXJpYS1tb2RhbFwiKSA9PSBcInRydWVcIiAmJiBub2RlLmdldEF0dHJpYnV0ZShcInJvbGVcIikgPT0gXCJkaWFsb2dcIikge1xuICAgICAgICAgIG5vZGUgPSB0aGlzLl9yZW1vdmVBbmRHZXROZXh0KG5vZGUpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoaXMgbm9kZSBpcyBhIGJ5bGluZSwgYW5kIHJlbW92ZSBpdCBpZiBpdCBpcy5cbiAgICAgICAgaWYgKHRoaXMuX2NoZWNrQnlsaW5lKG5vZGUsIG1hdGNoU3RyaW5nKSkge1xuICAgICAgICAgIG5vZGUgPSB0aGlzLl9yZW1vdmVBbmRHZXROZXh0KG5vZGUpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNob3VsZFJlbW92ZVRpdGxlSGVhZGVyICYmIHRoaXMuX2hlYWRlckR1cGxpY2F0ZXNUaXRsZShub2RlKSkge1xuICAgICAgICAgIHRoaXMubG9nKFwiUmVtb3ZpbmcgaGVhZGVyOiBcIiwgbm9kZS50ZXh0Q29udGVudC50cmltKCksIHRoaXMuX2FydGljbGVUaXRsZS50cmltKCkpO1xuICAgICAgICAgIHNob3VsZFJlbW92ZVRpdGxlSGVhZGVyID0gZmFsc2U7XG4gICAgICAgICAgbm9kZSA9IHRoaXMuX3JlbW92ZUFuZEdldE5leHQobm9kZSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgdW5saWtlbHkgY2FuZGlkYXRlc1xuICAgICAgICBpZiAoc3RyaXBVbmxpa2VseUNhbmRpZGF0ZXMpIHtcbiAgICAgICAgICBpZiAodGhpcy5SRUdFWFBTLnVubGlrZWx5Q2FuZGlkYXRlcy50ZXN0KG1hdGNoU3RyaW5nKSAmJlxuICAgICAgICAgICAgICAhdGhpcy5SRUdFWFBTLm9rTWF5YmVJdHNBQ2FuZGlkYXRlLnRlc3QobWF0Y2hTdHJpbmcpICYmXG4gICAgICAgICAgICAgICF0aGlzLl9oYXNBbmNlc3RvclRhZyhub2RlLCBcInRhYmxlXCIpICYmXG4gICAgICAgICAgICAgICF0aGlzLl9oYXNBbmNlc3RvclRhZyhub2RlLCBcImNvZGVcIikgJiZcbiAgICAgICAgICAgICAgbm9kZS50YWdOYW1lICE9PSBcIkJPRFlcIiAmJlxuICAgICAgICAgICAgICBub2RlLnRhZ05hbWUgIT09IFwiQVwiKSB7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlJlbW92aW5nIHVubGlrZWx5IGNhbmRpZGF0ZSAtIFwiICsgbWF0Y2hTdHJpbmcpO1xuICAgICAgICAgICAgbm9kZSA9IHRoaXMuX3JlbW92ZUFuZEdldE5leHQobm9kZSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5VTkxJS0VMWV9ST0xFUy5pbmNsdWRlcyhub2RlLmdldEF0dHJpYnV0ZShcInJvbGVcIikpKSB7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlJlbW92aW5nIGNvbnRlbnQgd2l0aCByb2xlIFwiICsgbm9kZS5nZXRBdHRyaWJ1dGUoXCJyb2xlXCIpICsgXCIgLSBcIiArIG1hdGNoU3RyaW5nKTtcbiAgICAgICAgICAgIG5vZGUgPSB0aGlzLl9yZW1vdmVBbmRHZXROZXh0KG5vZGUpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIERJViwgU0VDVElPTiwgYW5kIEhFQURFUiBub2RlcyB3aXRob3V0IGFueSBjb250ZW50KGUuZy4gdGV4dCwgaW1hZ2UsIHZpZGVvLCBvciBpZnJhbWUpLlxuICAgICAgICBpZiAoKG5vZGUudGFnTmFtZSA9PT0gXCJESVZcIiB8fCBub2RlLnRhZ05hbWUgPT09IFwiU0VDVElPTlwiIHx8IG5vZGUudGFnTmFtZSA9PT0gXCJIRUFERVJcIiB8fFxuICAgICAgICAgICAgIG5vZGUudGFnTmFtZSA9PT0gXCJIMVwiIHx8IG5vZGUudGFnTmFtZSA9PT0gXCJIMlwiIHx8IG5vZGUudGFnTmFtZSA9PT0gXCJIM1wiIHx8XG4gICAgICAgICAgICAgbm9kZS50YWdOYW1lID09PSBcIkg0XCIgfHwgbm9kZS50YWdOYW1lID09PSBcIkg1XCIgfHwgbm9kZS50YWdOYW1lID09PSBcIkg2XCIpICYmXG4gICAgICAgICAgICB0aGlzLl9pc0VsZW1lbnRXaXRob3V0Q29udGVudChub2RlKSkge1xuICAgICAgICAgIG5vZGUgPSB0aGlzLl9yZW1vdmVBbmRHZXROZXh0KG5vZGUpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuREVGQVVMVF9UQUdTX1RPX1NDT1JFLmluZGV4T2Yobm9kZS50YWdOYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICBlbGVtZW50c1RvU2NvcmUucHVzaChub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFR1cm4gYWxsIGRpdnMgdGhhdCBkb24ndCBoYXZlIGNoaWxkcmVuIGJsb2NrIGxldmVsIGVsZW1lbnRzIGludG8gcCdzXG4gICAgICAgIGlmIChub2RlLnRhZ05hbWUgPT09IFwiRElWXCIpIHtcbiAgICAgICAgICAvLyBQdXQgcGhyYXNpbmcgY29udGVudCBpbnRvIHBhcmFncmFwaHMuXG4gICAgICAgICAgdmFyIHAgPSBudWxsO1xuICAgICAgICAgIHZhciBjaGlsZE5vZGUgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgd2hpbGUgKGNoaWxkTm9kZSkge1xuICAgICAgICAgICAgdmFyIG5leHRTaWJsaW5nID0gY2hpbGROb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lzUGhyYXNpbmdDb250ZW50KGNoaWxkTm9kZSkpIHtcbiAgICAgICAgICAgICAgaWYgKHAgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwLmFwcGVuZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2lzV2hpdGVzcGFjZShjaGlsZE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgcCA9IGRvYy5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgICAgICBub2RlLnJlcGxhY2VDaGlsZChwLCBjaGlsZE5vZGUpO1xuICAgICAgICAgICAgICAgIHAuYXBwZW5kQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHdoaWxlIChwLmxhc3RDaGlsZCAmJiB0aGlzLl9pc1doaXRlc3BhY2UocC5sYXN0Q2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgcC5yZW1vdmVDaGlsZChwLmxhc3RDaGlsZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGlsZE5vZGUgPSBuZXh0U2libGluZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBTaXRlcyBsaWtlIGh0dHA6Ly9tb2JpbGUuc2xhdGUuY29tIGVuY2xvc2VzIGVhY2ggcGFyYWdyYXBoIHdpdGggYSBESVZcbiAgICAgICAgICAvLyBlbGVtZW50LiBESVZzIHdpdGggb25seSBhIFAgZWxlbWVudCBpbnNpZGUgYW5kIG5vIHRleHQgY29udGVudCBjYW4gYmVcbiAgICAgICAgICAvLyBzYWZlbHkgY29udmVydGVkIGludG8gcGxhaW4gUCBlbGVtZW50cyB0byBhdm9pZCBjb25mdXNpbmcgdGhlIHNjb3JpbmdcbiAgICAgICAgICAvLyBhbGdvcml0aG0gd2l0aCBESVZzIHdpdGggYXJlLCBpbiBwcmFjdGljZSwgcGFyYWdyYXBocy5cbiAgICAgICAgICBpZiAodGhpcy5faGFzU2luZ2xlVGFnSW5zaWRlRWxlbWVudChub2RlLCBcIlBcIikgJiYgdGhpcy5fZ2V0TGlua0RlbnNpdHkobm9kZSkgPCAwLjI1KSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgICAgICAgICBub2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld05vZGUsIG5vZGUpO1xuICAgICAgICAgICAgbm9kZSA9IG5ld05vZGU7XG4gICAgICAgICAgICBlbGVtZW50c1RvU2NvcmUucHVzaChub2RlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9oYXNDaGlsZEJsb2NrRWxlbWVudChub2RlKSkge1xuICAgICAgICAgICAgbm9kZSA9IHRoaXMuX3NldE5vZGVUYWcobm9kZSwgXCJQXCIpO1xuICAgICAgICAgICAgZWxlbWVudHNUb1Njb3JlLnB1c2gobm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSB0aGlzLl9nZXROZXh0Tm9kZShub2RlKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBMb29wIHRocm91Z2ggYWxsIHBhcmFncmFwaHMsIGFuZCBhc3NpZ24gYSBzY29yZSB0byB0aGVtIGJhc2VkIG9uIGhvdyBjb250ZW50LXkgdGhleSBsb29rLlxuICAgICAgICogVGhlbiBhZGQgdGhlaXIgc2NvcmUgdG8gdGhlaXIgcGFyZW50IG5vZGUuXG4gICAgICAgKlxuICAgICAgICogQSBzY29yZSBpcyBkZXRlcm1pbmVkIGJ5IHRoaW5ncyBsaWtlIG51bWJlciBvZiBjb21tYXMsIGNsYXNzIG5hbWVzLCBldGMuIE1heWJlIGV2ZW50dWFsbHkgbGluayBkZW5zaXR5LlxuICAgICAgKiovXG4gICAgICB2YXIgY2FuZGlkYXRlcyA9IFtdO1xuICAgICAgdGhpcy5fZm9yRWFjaE5vZGUoZWxlbWVudHNUb1Njb3JlLCBmdW5jdGlvbihlbGVtZW50VG9TY29yZSkge1xuICAgICAgICBpZiAoIWVsZW1lbnRUb1Njb3JlLnBhcmVudE5vZGUgfHwgdHlwZW9mKGVsZW1lbnRUb1Njb3JlLnBhcmVudE5vZGUudGFnTmFtZSkgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIC8vIElmIHRoaXMgcGFyYWdyYXBoIGlzIGxlc3MgdGhhbiAyNSBjaGFyYWN0ZXJzLCBkb24ndCBldmVuIGNvdW50IGl0LlxuICAgICAgICB2YXIgaW5uZXJUZXh0ID0gdGhpcy5fZ2V0SW5uZXJUZXh0KGVsZW1lbnRUb1Njb3JlKTtcbiAgICAgICAgaWYgKGlubmVyVGV4dC5sZW5ndGggPCAyNSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgLy8gRXhjbHVkZSBub2RlcyB3aXRoIG5vIGFuY2VzdG9yLlxuICAgICAgICB2YXIgYW5jZXN0b3JzID0gdGhpcy5fZ2V0Tm9kZUFuY2VzdG9ycyhlbGVtZW50VG9TY29yZSwgNSk7XG4gICAgICAgIGlmIChhbmNlc3RvcnMubGVuZ3RoID09PSAwKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgY29udGVudFNjb3JlID0gMDtcblxuICAgICAgICAvLyBBZGQgYSBwb2ludCBmb3IgdGhlIHBhcmFncmFwaCBpdHNlbGYgYXMgYSBiYXNlLlxuICAgICAgICBjb250ZW50U2NvcmUgKz0gMTtcblxuICAgICAgICAvLyBBZGQgcG9pbnRzIGZvciBhbnkgY29tbWFzIHdpdGhpbiB0aGlzIHBhcmFncmFwaC5cbiAgICAgICAgY29udGVudFNjb3JlICs9IGlubmVyVGV4dC5zcGxpdCh0aGlzLlJFR0VYUFMuY29tbWFzKS5sZW5ndGg7XG5cbiAgICAgICAgLy8gRm9yIGV2ZXJ5IDEwMCBjaGFyYWN0ZXJzIGluIHRoaXMgcGFyYWdyYXBoLCBhZGQgYW5vdGhlciBwb2ludC4gVXAgdG8gMyBwb2ludHMuXG4gICAgICAgIGNvbnRlbnRTY29yZSArPSBNYXRoLm1pbihNYXRoLmZsb29yKGlubmVyVGV4dC5sZW5ndGggLyAxMDApLCAzKTtcblxuICAgICAgICAvLyBJbml0aWFsaXplIGFuZCBzY29yZSBhbmNlc3RvcnMuXG4gICAgICAgIHRoaXMuX2ZvckVhY2hOb2RlKGFuY2VzdG9ycywgZnVuY3Rpb24oYW5jZXN0b3IsIGxldmVsKSB7XG4gICAgICAgICAgaWYgKCFhbmNlc3Rvci50YWdOYW1lIHx8ICFhbmNlc3Rvci5wYXJlbnROb2RlIHx8IHR5cGVvZihhbmNlc3Rvci5wYXJlbnROb2RlLnRhZ05hbWUpID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZihhbmNlc3Rvci5yZWFkYWJpbGl0eSkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemVOb2RlKGFuY2VzdG9yKTtcbiAgICAgICAgICAgIGNhbmRpZGF0ZXMucHVzaChhbmNlc3Rvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTm9kZSBzY29yZSBkaXZpZGVyOlxuICAgICAgICAgIC8vIC0gcGFyZW50OiAgICAgICAgICAgICAxIChubyBkaXZpc2lvbilcbiAgICAgICAgICAvLyAtIGdyYW5kcGFyZW50OiAgICAgICAgMlxuICAgICAgICAgIC8vIC0gZ3JlYXQgZ3JhbmRwYXJlbnQrOiBhbmNlc3RvciBsZXZlbCAqIDNcbiAgICAgICAgICBpZiAobGV2ZWwgPT09IDApXG4gICAgICAgICAgICB2YXIgc2NvcmVEaXZpZGVyID0gMTtcbiAgICAgICAgICBlbHNlIGlmIChsZXZlbCA9PT0gMSlcbiAgICAgICAgICAgIHNjb3JlRGl2aWRlciA9IDI7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc2NvcmVEaXZpZGVyID0gbGV2ZWwgKiAzO1xuICAgICAgICAgIGFuY2VzdG9yLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZSArPSBjb250ZW50U2NvcmUgLyBzY29yZURpdmlkZXI7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEFmdGVyIHdlJ3ZlIGNhbGN1bGF0ZWQgc2NvcmVzLCBsb29wIHRocm91Z2ggYWxsIG9mIHRoZSBwb3NzaWJsZVxuICAgICAgLy8gY2FuZGlkYXRlIG5vZGVzIHdlIGZvdW5kIGFuZCBmaW5kIHRoZSBvbmUgd2l0aCB0aGUgaGlnaGVzdCBzY29yZS5cbiAgICAgIHZhciB0b3BDYW5kaWRhdGVzID0gW107XG4gICAgICBmb3IgKHZhciBjID0gMCwgY2wgPSBjYW5kaWRhdGVzLmxlbmd0aDsgYyA8IGNsOyBjICs9IDEpIHtcbiAgICAgICAgdmFyIGNhbmRpZGF0ZSA9IGNhbmRpZGF0ZXNbY107XG5cbiAgICAgICAgLy8gU2NhbGUgdGhlIGZpbmFsIGNhbmRpZGF0ZXMgc2NvcmUgYmFzZWQgb24gbGluayBkZW5zaXR5LiBHb29kIGNvbnRlbnRcbiAgICAgICAgLy8gc2hvdWxkIGhhdmUgYSByZWxhdGl2ZWx5IHNtYWxsIGxpbmsgZGVuc2l0eSAoNSUgb3IgbGVzcykgYW5kIGJlIG1vc3RseVxuICAgICAgICAvLyB1bmFmZmVjdGVkIGJ5IHRoaXMgb3BlcmF0aW9uLlxuICAgICAgICB2YXIgY2FuZGlkYXRlU2NvcmUgPSBjYW5kaWRhdGUucmVhZGFiaWxpdHkuY29udGVudFNjb3JlICogKDEgLSB0aGlzLl9nZXRMaW5rRGVuc2l0eShjYW5kaWRhdGUpKTtcbiAgICAgICAgY2FuZGlkYXRlLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZSA9IGNhbmRpZGF0ZVNjb3JlO1xuXG4gICAgICAgIHRoaXMubG9nKFwiQ2FuZGlkYXRlOlwiLCBjYW5kaWRhdGUsIFwid2l0aCBzY29yZSBcIiArIGNhbmRpZGF0ZVNjb3JlKTtcblxuICAgICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRoaXMuX25iVG9wQ2FuZGlkYXRlczsgdCsrKSB7XG4gICAgICAgICAgdmFyIGFUb3BDYW5kaWRhdGUgPSB0b3BDYW5kaWRhdGVzW3RdO1xuXG4gICAgICAgICAgaWYgKCFhVG9wQ2FuZGlkYXRlIHx8IGNhbmRpZGF0ZVNjb3JlID4gYVRvcENhbmRpZGF0ZS5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmUpIHtcbiAgICAgICAgICAgIHRvcENhbmRpZGF0ZXMuc3BsaWNlKHQsIDAsIGNhbmRpZGF0ZSk7XG4gICAgICAgICAgICBpZiAodG9wQ2FuZGlkYXRlcy5sZW5ndGggPiB0aGlzLl9uYlRvcENhbmRpZGF0ZXMpXG4gICAgICAgICAgICAgIHRvcENhbmRpZGF0ZXMucG9wKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHRvcENhbmRpZGF0ZSA9IHRvcENhbmRpZGF0ZXNbMF0gfHwgbnVsbDtcbiAgICAgIHZhciBuZWVkZWRUb0NyZWF0ZVRvcENhbmRpZGF0ZSA9IGZhbHNlO1xuICAgICAgdmFyIHBhcmVudE9mVG9wQ2FuZGlkYXRlO1xuXG4gICAgICAvLyBJZiB3ZSBzdGlsbCBoYXZlIG5vIHRvcCBjYW5kaWRhdGUsIGp1c3QgdXNlIHRoZSBib2R5IGFzIGEgbGFzdCByZXNvcnQuXG4gICAgICAvLyBXZSBhbHNvIGhhdmUgdG8gY29weSB0aGUgYm9keSBub2RlIHNvIGl0IGlzIHNvbWV0aGluZyB3ZSBjYW4gbW9kaWZ5LlxuICAgICAgaWYgKHRvcENhbmRpZGF0ZSA9PT0gbnVsbCB8fCB0b3BDYW5kaWRhdGUudGFnTmFtZSA9PT0gXCJCT0RZXCIpIHtcbiAgICAgICAgLy8gTW92ZSBhbGwgb2YgdGhlIHBhZ2UncyBjaGlsZHJlbiBpbnRvIHRvcENhbmRpZGF0ZVxuICAgICAgICB0b3BDYW5kaWRhdGUgPSBkb2MuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbiAgICAgICAgbmVlZGVkVG9DcmVhdGVUb3BDYW5kaWRhdGUgPSB0cnVlO1xuICAgICAgICAvLyBNb3ZlIGV2ZXJ5dGhpbmcgKG5vdCBqdXN0IGVsZW1lbnRzLCBhbHNvIHRleHQgbm9kZXMgZXRjLikgaW50byB0aGUgY29udGFpbmVyXG4gICAgICAgIC8vIHNvIHdlIGV2ZW4gaW5jbHVkZSB0ZXh0IGRpcmVjdGx5IGluIHRoZSBib2R5OlxuICAgICAgICB3aGlsZSAocGFnZS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgdGhpcy5sb2coXCJNb3ZpbmcgY2hpbGQgb3V0OlwiLCBwYWdlLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgIHRvcENhbmRpZGF0ZS5hcHBlbmRDaGlsZChwYWdlLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFnZS5hcHBlbmRDaGlsZCh0b3BDYW5kaWRhdGUpO1xuXG4gICAgICAgIHRoaXMuX2luaXRpYWxpemVOb2RlKHRvcENhbmRpZGF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRvcENhbmRpZGF0ZSkge1xuICAgICAgICAvLyBGaW5kIGEgYmV0dGVyIHRvcCBjYW5kaWRhdGUgbm9kZSBpZiBpdCBjb250YWlucyAoYXQgbGVhc3QgdGhyZWUpIG5vZGVzIHdoaWNoIGJlbG9uZyB0byBgdG9wQ2FuZGlkYXRlc2AgYXJyYXlcbiAgICAgICAgLy8gYW5kIHdob3NlIHNjb3JlcyBhcmUgcXVpdGUgY2xvc2VkIHdpdGggY3VycmVudCBgdG9wQ2FuZGlkYXRlYCBub2RlLlxuICAgICAgICB2YXIgYWx0ZXJuYXRpdmVDYW5kaWRhdGVBbmNlc3RvcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0b3BDYW5kaWRhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRvcENhbmRpZGF0ZXNbaV0ucmVhZGFiaWxpdHkuY29udGVudFNjb3JlIC8gdG9wQ2FuZGlkYXRlLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZSA+PSAwLjc1KSB7XG4gICAgICAgICAgICBhbHRlcm5hdGl2ZUNhbmRpZGF0ZUFuY2VzdG9ycy5wdXNoKHRoaXMuX2dldE5vZGVBbmNlc3RvcnModG9wQ2FuZGlkYXRlc1tpXSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgTUlOSU1VTV9UT1BDQU5ESURBVEVTID0gMztcbiAgICAgICAgaWYgKGFsdGVybmF0aXZlQ2FuZGlkYXRlQW5jZXN0b3JzLmxlbmd0aCA+PSBNSU5JTVVNX1RPUENBTkRJREFURVMpIHtcbiAgICAgICAgICBwYXJlbnRPZlRvcENhbmRpZGF0ZSA9IHRvcENhbmRpZGF0ZS5wYXJlbnROb2RlO1xuICAgICAgICAgIHdoaWxlIChwYXJlbnRPZlRvcENhbmRpZGF0ZS50YWdOYW1lICE9PSBcIkJPRFlcIikge1xuICAgICAgICAgICAgdmFyIGxpc3RzQ29udGFpbmluZ1RoaXNBbmNlc3RvciA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBhbmNlc3RvckluZGV4ID0gMDsgYW5jZXN0b3JJbmRleCA8IGFsdGVybmF0aXZlQ2FuZGlkYXRlQW5jZXN0b3JzLmxlbmd0aCAmJiBsaXN0c0NvbnRhaW5pbmdUaGlzQW5jZXN0b3IgPCBNSU5JTVVNX1RPUENBTkRJREFURVM7IGFuY2VzdG9ySW5kZXgrKykge1xuICAgICAgICAgICAgICBsaXN0c0NvbnRhaW5pbmdUaGlzQW5jZXN0b3IgKz0gTnVtYmVyKGFsdGVybmF0aXZlQ2FuZGlkYXRlQW5jZXN0b3JzW2FuY2VzdG9ySW5kZXhdLmluY2x1ZGVzKHBhcmVudE9mVG9wQ2FuZGlkYXRlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGlzdHNDb250YWluaW5nVGhpc0FuY2VzdG9yID49IE1JTklNVU1fVE9QQ0FORElEQVRFUykge1xuICAgICAgICAgICAgICB0b3BDYW5kaWRhdGUgPSBwYXJlbnRPZlRvcENhbmRpZGF0ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJlbnRPZlRvcENhbmRpZGF0ZSA9IHBhcmVudE9mVG9wQ2FuZGlkYXRlLnBhcmVudE5vZGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdG9wQ2FuZGlkYXRlLnJlYWRhYmlsaXR5KSB7XG4gICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZU5vZGUodG9wQ2FuZGlkYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlY2F1c2Ugb2Ygb3VyIGJvbnVzIHN5c3RlbSwgcGFyZW50cyBvZiBjYW5kaWRhdGVzIG1pZ2h0IGhhdmUgc2NvcmVzXG4gICAgICAgIC8vIHRoZW1zZWx2ZXMuIFRoZXkgZ2V0IGhhbGYgb2YgdGhlIG5vZGUuIFRoZXJlIHdvbid0IGJlIG5vZGVzIHdpdGggaGlnaGVyXG4gICAgICAgIC8vIHNjb3JlcyB0aGFuIG91ciB0b3BDYW5kaWRhdGUsIGJ1dCBpZiB3ZSBzZWUgdGhlIHNjb3JlIGdvaW5nICp1cCogaW4gdGhlIGZpcnN0XG4gICAgICAgIC8vIGZldyBzdGVwcyB1cCB0aGUgdHJlZSwgdGhhdCdzIGEgZGVjZW50IHNpZ24gdGhhdCB0aGVyZSBtaWdodCBiZSBtb3JlIGNvbnRlbnRcbiAgICAgICAgLy8gbHVya2luZyBpbiBvdGhlciBwbGFjZXMgdGhhdCB3ZSB3YW50IHRvIHVuaWZ5IGluLiBUaGUgc2libGluZyBzdHVmZlxuICAgICAgICAvLyBiZWxvdyBkb2VzIHNvbWUgb2YgdGhhdCAtIGJ1dCBvbmx5IGlmIHdlJ3ZlIGxvb2tlZCBoaWdoIGVub3VnaCB1cCB0aGUgRE9NXG4gICAgICAgIC8vIHRyZWUuXG4gICAgICAgIHBhcmVudE9mVG9wQ2FuZGlkYXRlID0gdG9wQ2FuZGlkYXRlLnBhcmVudE5vZGU7XG4gICAgICAgIHZhciBsYXN0U2NvcmUgPSB0b3BDYW5kaWRhdGUucmVhZGFiaWxpdHkuY29udGVudFNjb3JlO1xuICAgICAgICAvLyBUaGUgc2NvcmVzIHNob3VsZG4ndCBnZXQgdG9vIGxvdy5cbiAgICAgICAgdmFyIHNjb3JlVGhyZXNob2xkID0gbGFzdFNjb3JlIC8gMztcbiAgICAgICAgd2hpbGUgKHBhcmVudE9mVG9wQ2FuZGlkYXRlLnRhZ05hbWUgIT09IFwiQk9EWVwiKSB7XG4gICAgICAgICAgaWYgKCFwYXJlbnRPZlRvcENhbmRpZGF0ZS5yZWFkYWJpbGl0eSkge1xuICAgICAgICAgICAgcGFyZW50T2ZUb3BDYW5kaWRhdGUgPSBwYXJlbnRPZlRvcENhbmRpZGF0ZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBwYXJlbnRTY29yZSA9IHBhcmVudE9mVG9wQ2FuZGlkYXRlLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZTtcbiAgICAgICAgICBpZiAocGFyZW50U2NvcmUgPCBzY29yZVRocmVzaG9sZClcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGlmIChwYXJlbnRTY29yZSA+IGxhc3RTY29yZSkge1xuICAgICAgICAgICAgLy8gQWxyaWdodCEgV2UgZm91bmQgYSBiZXR0ZXIgcGFyZW50IHRvIHVzZS5cbiAgICAgICAgICAgIHRvcENhbmRpZGF0ZSA9IHBhcmVudE9mVG9wQ2FuZGlkYXRlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxhc3RTY29yZSA9IHBhcmVudE9mVG9wQ2FuZGlkYXRlLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZTtcbiAgICAgICAgICBwYXJlbnRPZlRvcENhbmRpZGF0ZSA9IHBhcmVudE9mVG9wQ2FuZGlkYXRlLnBhcmVudE5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgdG9wIGNhbmRpZGF0ZSBpcyB0aGUgb25seSBjaGlsZCwgdXNlIHBhcmVudCBpbnN0ZWFkLiBUaGlzIHdpbGwgaGVscCBzaWJsaW5nXG4gICAgICAgIC8vIGpvaW5pbmcgbG9naWMgd2hlbiBhZGphY2VudCBjb250ZW50IGlzIGFjdHVhbGx5IGxvY2F0ZWQgaW4gcGFyZW50J3Mgc2libGluZyBub2RlLlxuICAgICAgICBwYXJlbnRPZlRvcENhbmRpZGF0ZSA9IHRvcENhbmRpZGF0ZS5wYXJlbnROb2RlO1xuICAgICAgICB3aGlsZSAocGFyZW50T2ZUb3BDYW5kaWRhdGUudGFnTmFtZSAhPSBcIkJPRFlcIiAmJiBwYXJlbnRPZlRvcENhbmRpZGF0ZS5jaGlsZHJlbi5sZW5ndGggPT0gMSkge1xuICAgICAgICAgIHRvcENhbmRpZGF0ZSA9IHBhcmVudE9mVG9wQ2FuZGlkYXRlO1xuICAgICAgICAgIHBhcmVudE9mVG9wQ2FuZGlkYXRlID0gdG9wQ2FuZGlkYXRlLnBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0b3BDYW5kaWRhdGUucmVhZGFiaWxpdHkpIHtcbiAgICAgICAgICB0aGlzLl9pbml0aWFsaXplTm9kZSh0b3BDYW5kaWRhdGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgdGhlIHRvcCBjYW5kaWRhdGUsIGxvb2sgdGhyb3VnaCBpdHMgc2libGluZ3MgZm9yIGNvbnRlbnRcbiAgICAgIC8vIHRoYXQgbWlnaHQgYWxzbyBiZSByZWxhdGVkLiBUaGluZ3MgbGlrZSBwcmVhbWJsZXMsIGNvbnRlbnQgc3BsaXQgYnkgYWRzXG4gICAgICAvLyB0aGF0IHdlIHJlbW92ZWQsIGV0Yy5cbiAgICAgIHZhciBhcnRpY2xlQ29udGVudCA9IGRvYy5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuICAgICAgaWYgKGlzUGFnaW5nKVxuICAgICAgICBhcnRpY2xlQ29udGVudC5pZCA9IFwicmVhZGFiaWxpdHktY29udGVudFwiO1xuXG4gICAgICB2YXIgc2libGluZ1Njb3JlVGhyZXNob2xkID0gTWF0aC5tYXgoMTAsIHRvcENhbmRpZGF0ZS5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmUgKiAwLjIpO1xuICAgICAgLy8gS2VlcCBwb3RlbnRpYWwgdG9wIGNhbmRpZGF0ZSdzIHBhcmVudCBub2RlIHRvIHRyeSB0byBnZXQgdGV4dCBkaXJlY3Rpb24gb2YgaXQgbGF0ZXIuXG4gICAgICBwYXJlbnRPZlRvcENhbmRpZGF0ZSA9IHRvcENhbmRpZGF0ZS5wYXJlbnROb2RlO1xuICAgICAgdmFyIHNpYmxpbmdzID0gcGFyZW50T2ZUb3BDYW5kaWRhdGUuY2hpbGRyZW47XG5cbiAgICAgIGZvciAodmFyIHMgPSAwLCBzbCA9IHNpYmxpbmdzLmxlbmd0aDsgcyA8IHNsOyBzKyspIHtcbiAgICAgICAgdmFyIHNpYmxpbmcgPSBzaWJsaW5nc1tzXTtcbiAgICAgICAgdmFyIGFwcGVuZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMubG9nKFwiTG9va2luZyBhdCBzaWJsaW5nIG5vZGU6XCIsIHNpYmxpbmcsIHNpYmxpbmcucmVhZGFiaWxpdHkgPyAoXCJ3aXRoIHNjb3JlIFwiICsgc2libGluZy5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmUpIDogXCJcIik7XG4gICAgICAgIHRoaXMubG9nKFwiU2libGluZyBoYXMgc2NvcmVcIiwgc2libGluZy5yZWFkYWJpbGl0eSA/IHNpYmxpbmcucmVhZGFiaWxpdHkuY29udGVudFNjb3JlIDogXCJVbmtub3duXCIpO1xuXG4gICAgICAgIGlmIChzaWJsaW5nID09PSB0b3BDYW5kaWRhdGUpIHtcbiAgICAgICAgICBhcHBlbmQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBjb250ZW50Qm9udXMgPSAwO1xuXG4gICAgICAgICAgLy8gR2l2ZSBhIGJvbnVzIGlmIHNpYmxpbmcgbm9kZXMgYW5kIHRvcCBjYW5kaWRhdGVzIGhhdmUgdGhlIGV4YW1wbGUgc2FtZSBjbGFzc25hbWVcbiAgICAgICAgICBpZiAoc2libGluZy5jbGFzc05hbWUgPT09IHRvcENhbmRpZGF0ZS5jbGFzc05hbWUgJiYgdG9wQ2FuZGlkYXRlLmNsYXNzTmFtZSAhPT0gXCJcIilcbiAgICAgICAgICAgIGNvbnRlbnRCb251cyArPSB0b3BDYW5kaWRhdGUucmVhZGFiaWxpdHkuY29udGVudFNjb3JlICogMC4yO1xuXG4gICAgICAgICAgaWYgKHNpYmxpbmcucmVhZGFiaWxpdHkgJiZcbiAgICAgICAgICAgICAgKChzaWJsaW5nLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZSArIGNvbnRlbnRCb251cykgPj0gc2libGluZ1Njb3JlVGhyZXNob2xkKSkge1xuICAgICAgICAgICAgYXBwZW5kID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNpYmxpbmcubm9kZU5hbWUgPT09IFwiUFwiKSB7XG4gICAgICAgICAgICB2YXIgbGlua0RlbnNpdHkgPSB0aGlzLl9nZXRMaW5rRGVuc2l0eShzaWJsaW5nKTtcbiAgICAgICAgICAgIHZhciBub2RlQ29udGVudCA9IHRoaXMuX2dldElubmVyVGV4dChzaWJsaW5nKTtcbiAgICAgICAgICAgIHZhciBub2RlTGVuZ3RoID0gbm9kZUNvbnRlbnQubGVuZ3RoO1xuXG4gICAgICAgICAgICBpZiAobm9kZUxlbmd0aCA+IDgwICYmIGxpbmtEZW5zaXR5IDwgMC4yNSkge1xuICAgICAgICAgICAgICBhcHBlbmQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlTGVuZ3RoIDwgODAgJiYgbm9kZUxlbmd0aCA+IDAgJiYgbGlua0RlbnNpdHkgPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgbm9kZUNvbnRlbnQuc2VhcmNoKC9cXC4oIHwkKS8pICE9PSAtMSkge1xuICAgICAgICAgICAgICBhcHBlbmQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcHBlbmQpIHtcbiAgICAgICAgICB0aGlzLmxvZyhcIkFwcGVuZGluZyBub2RlOlwiLCBzaWJsaW5nKTtcblxuICAgICAgICAgIGlmICh0aGlzLkFMVEVSX1RPX0RJVl9FWENFUFRJT05TLmluZGV4T2Yoc2libGluZy5ub2RlTmFtZSkgPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIGEgbm9kZSB0aGF0IGlzbid0IGEgY29tbW9uIGJsb2NrIGxldmVsIGVsZW1lbnQsIGxpa2UgYSBmb3JtIG9yIHRkIHRhZy5cbiAgICAgICAgICAgIC8vIFR1cm4gaXQgaW50byBhIGRpdiBzbyBpdCBkb2Vzbid0IGdldCBmaWx0ZXJlZCBvdXQgbGF0ZXIgYnkgYWNjaWRlbnQuXG4gICAgICAgICAgICB0aGlzLmxvZyhcIkFsdGVyaW5nIHNpYmxpbmc6XCIsIHNpYmxpbmcsIFwidG8gZGl2LlwiKTtcblxuICAgICAgICAgICAgc2libGluZyA9IHRoaXMuX3NldE5vZGVUYWcoc2libGluZywgXCJESVZcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXJ0aWNsZUNvbnRlbnQuYXBwZW5kQ2hpbGQoc2libGluZyk7XG4gICAgICAgICAgLy8gRmV0Y2ggY2hpbGRyZW4gYWdhaW4gdG8gbWFrZSBpdCBjb21wYXRpYmxlXG4gICAgICAgICAgLy8gd2l0aCBET00gcGFyc2VycyB3aXRob3V0IGxpdmUgY29sbGVjdGlvbiBzdXBwb3J0LlxuICAgICAgICAgIHNpYmxpbmdzID0gcGFyZW50T2ZUb3BDYW5kaWRhdGUuY2hpbGRyZW47XG4gICAgICAgICAgLy8gc2libGluZ3MgaXMgYSByZWZlcmVuY2UgdG8gdGhlIGNoaWxkcmVuIGFycmF5LCBhbmRcbiAgICAgICAgICAvLyBzaWJsaW5nIGlzIHJlbW92ZWQgZnJvbSB0aGUgYXJyYXkgd2hlbiB3ZSBjYWxsIGFwcGVuZENoaWxkKCkuXG4gICAgICAgICAgLy8gQXMgYSByZXN1bHQsIHdlIG11c3QgcmV2aXNpdCB0aGlzIGluZGV4IHNpbmNlIHRoZSBub2Rlc1xuICAgICAgICAgIC8vIGhhdmUgYmVlbiBzaGlmdGVkLlxuICAgICAgICAgIHMgLT0gMTtcbiAgICAgICAgICBzbCAtPSAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9kZWJ1ZylcbiAgICAgICAgdGhpcy5sb2coXCJBcnRpY2xlIGNvbnRlbnQgcHJlLXByZXA6IFwiICsgYXJ0aWNsZUNvbnRlbnQuaW5uZXJIVE1MKTtcbiAgICAgIC8vIFNvIHdlIGhhdmUgYWxsIG9mIHRoZSBjb250ZW50IHRoYXQgd2UgbmVlZC4gTm93IHdlIGNsZWFuIGl0IHVwIGZvciBwcmVzZW50YXRpb24uXG4gICAgICB0aGlzLl9wcmVwQXJ0aWNsZShhcnRpY2xlQ29udGVudCk7XG4gICAgICBpZiAodGhpcy5fZGVidWcpXG4gICAgICAgIHRoaXMubG9nKFwiQXJ0aWNsZSBjb250ZW50IHBvc3QtcHJlcDogXCIgKyBhcnRpY2xlQ29udGVudC5pbm5lckhUTUwpO1xuXG4gICAgICBpZiAobmVlZGVkVG9DcmVhdGVUb3BDYW5kaWRhdGUpIHtcbiAgICAgICAgLy8gV2UgYWxyZWFkeSBjcmVhdGVkIGEgZmFrZSBkaXYgdGhpbmcsIGFuZCB0aGVyZSB3b3VsZG4ndCBoYXZlIGJlZW4gYW55IHNpYmxpbmdzIGxlZnRcbiAgICAgICAgLy8gZm9yIHRoZSBwcmV2aW91cyBsb29wLCBzbyB0aGVyZSdzIG5vIHBvaW50IHRyeWluZyB0byBjcmVhdGUgYSBuZXcgZGl2LCBhbmQgdGhlblxuICAgICAgICAvLyBtb3ZlIGFsbCB0aGUgY2hpbGRyZW4gb3Zlci4gSnVzdCBhc3NpZ24gSURzIGFuZCBjbGFzcyBuYW1lcyBoZXJlLiBObyBuZWVkIHRvIGFwcGVuZFxuICAgICAgICAvLyBiZWNhdXNlIHRoYXQgYWxyZWFkeSBoYXBwZW5lZCBhbnl3YXkuXG4gICAgICAgIHRvcENhbmRpZGF0ZS5pZCA9IFwicmVhZGFiaWxpdHktcGFnZS0xXCI7XG4gICAgICAgIHRvcENhbmRpZGF0ZS5jbGFzc05hbWUgPSBcInBhZ2VcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkaXYgPSBkb2MuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbiAgICAgICAgZGl2LmlkID0gXCJyZWFkYWJpbGl0eS1wYWdlLTFcIjtcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IFwicGFnZVwiO1xuICAgICAgICB3aGlsZSAoYXJ0aWNsZUNvbnRlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChhcnRpY2xlQ29udGVudC5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBhcnRpY2xlQ29udGVudC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fZGVidWcpXG4gICAgICAgIHRoaXMubG9nKFwiQXJ0aWNsZSBjb250ZW50IGFmdGVyIHBhZ2luZzogXCIgKyBhcnRpY2xlQ29udGVudC5pbm5lckhUTUwpO1xuXG4gICAgICB2YXIgcGFyc2VTdWNjZXNzZnVsID0gdHJ1ZTtcblxuICAgICAgLy8gTm93IHRoYXQgd2UndmUgZ29uZSB0aHJvdWdoIHRoZSBmdWxsIGFsZ29yaXRobSwgY2hlY2sgdG8gc2VlIGlmXG4gICAgICAvLyB3ZSBnb3QgYW55IG1lYW5pbmdmdWwgY29udGVudC4gSWYgd2UgZGlkbid0LCB3ZSBtYXkgbmVlZCB0byByZS1ydW5cbiAgICAgIC8vIGdyYWJBcnRpY2xlIHdpdGggZGlmZmVyZW50IGZsYWdzIHNldC4gVGhpcyBnaXZlcyB1cyBhIGhpZ2hlciBsaWtlbGlob29kIG9mXG4gICAgICAvLyBmaW5kaW5nIHRoZSBjb250ZW50LCBhbmQgdGhlIHNpZXZlIGFwcHJvYWNoIGdpdmVzIHVzIGEgaGlnaGVyIGxpa2VsaWhvb2Qgb2ZcbiAgICAgIC8vIGZpbmRpbmcgdGhlIC1yaWdodC0gY29udGVudC5cbiAgICAgIHZhciB0ZXh0TGVuZ3RoID0gdGhpcy5fZ2V0SW5uZXJUZXh0KGFydGljbGVDb250ZW50LCB0cnVlKS5sZW5ndGg7XG4gICAgICBpZiAodGV4dExlbmd0aCA8IHRoaXMuX2NoYXJUaHJlc2hvbGQpIHtcbiAgICAgICAgcGFyc2VTdWNjZXNzZnVsID0gZmFsc2U7XG4gICAgICAgIHBhZ2UuaW5uZXJIVE1MID0gcGFnZUNhY2hlSHRtbDtcblxuICAgICAgICBpZiAodGhpcy5fZmxhZ0lzQWN0aXZlKHRoaXMuRkxBR19TVFJJUF9VTkxJS0VMWVMpKSB7XG4gICAgICAgICAgdGhpcy5fcmVtb3ZlRmxhZyh0aGlzLkZMQUdfU1RSSVBfVU5MSUtFTFlTKTtcbiAgICAgICAgICB0aGlzLl9hdHRlbXB0cy5wdXNoKHthcnRpY2xlQ29udGVudDogYXJ0aWNsZUNvbnRlbnQsIHRleHRMZW5ndGg6IHRleHRMZW5ndGh9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9mbGFnSXNBY3RpdmUodGhpcy5GTEFHX1dFSUdIVF9DTEFTU0VTKSkge1xuICAgICAgICAgIHRoaXMuX3JlbW92ZUZsYWcodGhpcy5GTEFHX1dFSUdIVF9DTEFTU0VTKTtcbiAgICAgICAgICB0aGlzLl9hdHRlbXB0cy5wdXNoKHthcnRpY2xlQ29udGVudDogYXJ0aWNsZUNvbnRlbnQsIHRleHRMZW5ndGg6IHRleHRMZW5ndGh9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9mbGFnSXNBY3RpdmUodGhpcy5GTEFHX0NMRUFOX0NPTkRJVElPTkFMTFkpKSB7XG4gICAgICAgICAgdGhpcy5fcmVtb3ZlRmxhZyh0aGlzLkZMQUdfQ0xFQU5fQ09ORElUSU9OQUxMWSk7XG4gICAgICAgICAgdGhpcy5fYXR0ZW1wdHMucHVzaCh7YXJ0aWNsZUNvbnRlbnQ6IGFydGljbGVDb250ZW50LCB0ZXh0TGVuZ3RoOiB0ZXh0TGVuZ3RofSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fYXR0ZW1wdHMucHVzaCh7YXJ0aWNsZUNvbnRlbnQ6IGFydGljbGVDb250ZW50LCB0ZXh0TGVuZ3RoOiB0ZXh0TGVuZ3RofSk7XG4gICAgICAgICAgLy8gTm8gbHVjayBhZnRlciByZW1vdmluZyBmbGFncywganVzdCByZXR1cm4gdGhlIGxvbmdlc3QgdGV4dCB3ZSBmb3VuZCBkdXJpbmcgdGhlIGRpZmZlcmVudCBsb29wc1xuICAgICAgICAgIHRoaXMuX2F0dGVtcHRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBiLnRleHRMZW5ndGggLSBhLnRleHRMZW5ndGg7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBCdXQgZmlyc3QgY2hlY2sgaWYgd2UgYWN0dWFsbHkgaGF2ZSBzb21ldGhpbmdcbiAgICAgICAgICBpZiAoIXRoaXMuX2F0dGVtcHRzWzBdLnRleHRMZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFydGljbGVDb250ZW50ID0gdGhpcy5fYXR0ZW1wdHNbMF0uYXJ0aWNsZUNvbnRlbnQ7XG4gICAgICAgICAgcGFyc2VTdWNjZXNzZnVsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGFyc2VTdWNjZXNzZnVsKSB7XG4gICAgICAgIC8vIEZpbmQgb3V0IHRleHQgZGlyZWN0aW9uIGZyb20gYW5jZXN0b3JzIG9mIGZpbmFsIHRvcCBjYW5kaWRhdGUuXG4gICAgICAgIHZhciBhbmNlc3RvcnMgPSBbcGFyZW50T2ZUb3BDYW5kaWRhdGUsIHRvcENhbmRpZGF0ZV0uY29uY2F0KHRoaXMuX2dldE5vZGVBbmNlc3RvcnMocGFyZW50T2ZUb3BDYW5kaWRhdGUpKTtcbiAgICAgICAgdGhpcy5fc29tZU5vZGUoYW5jZXN0b3JzLCBmdW5jdGlvbihhbmNlc3Rvcikge1xuICAgICAgICAgIGlmICghYW5jZXN0b3IudGFnTmFtZSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB2YXIgYXJ0aWNsZURpciA9IGFuY2VzdG9yLmdldEF0dHJpYnV0ZShcImRpclwiKTtcbiAgICAgICAgICBpZiAoYXJ0aWNsZURpcikge1xuICAgICAgICAgICAgdGhpcy5fYXJ0aWNsZURpciA9IGFydGljbGVEaXI7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGFydGljbGVDb250ZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgaW5wdXQgc3RyaW5nIGNvdWxkIGJlIGEgYnlsaW5lLlxuICAgKiBUaGlzIHZlcmlmaWVzIHRoYXQgdGhlIGlucHV0IGlzIGEgc3RyaW5nLCBhbmQgdGhhdCB0aGUgbGVuZ3RoXG4gICAqIGlzIGxlc3MgdGhhbiAxMDAgY2hhcnMuXG4gICAqXG4gICAqIEBwYXJhbSBwb3NzaWJsZUJ5bGluZSB7c3RyaW5nfSAtIGEgc3RyaW5nIHRvIGNoZWNrIHdoZXRoZXIgaXRzIGEgYnlsaW5lLlxuICAgKiBAcmV0dXJuIEJvb2xlYW4gLSB3aGV0aGVyIHRoZSBpbnB1dCBzdHJpbmcgaXMgYSBieWxpbmUuXG4gICAqL1xuICBfaXNWYWxpZEJ5bGluZTogZnVuY3Rpb24oYnlsaW5lKSB7XG4gICAgaWYgKHR5cGVvZiBieWxpbmUgPT0gXCJzdHJpbmdcIiB8fCBieWxpbmUgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgIGJ5bGluZSA9IGJ5bGluZS50cmltKCk7XG4gICAgICByZXR1cm4gKGJ5bGluZS5sZW5ndGggPiAwKSAmJiAoYnlsaW5lLmxlbmd0aCA8IDEwMCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogQ29udmVydHMgc29tZSBvZiB0aGUgY29tbW9uIEhUTUwgZW50aXRpZXMgaW4gc3RyaW5nIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgY2hhcmFjdGVycy5cbiAgICpcbiAgICogQHBhcmFtIHN0ciB7c3RyaW5nfSAtIGEgc3RyaW5nIHRvIHVuZXNjYXBlLlxuICAgKiBAcmV0dXJuIHN0cmluZyB3aXRob3V0IEhUTUwgZW50aXR5LlxuICAgKi9cbiAgX3VuZXNjYXBlSHRtbEVudGl0aWVzOiBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoIXN0cikge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG5cbiAgICB2YXIgaHRtbEVzY2FwZU1hcCA9IHRoaXMuSFRNTF9FU0NBUEVfTUFQO1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvJihxdW90fGFtcHxhcG9zfGx0fGd0KTsvZywgZnVuY3Rpb24oXywgdGFnKSB7XG4gICAgICByZXR1cm4gaHRtbEVzY2FwZU1hcFt0YWddO1xuICAgIH0pLnJlcGxhY2UoLyYjKD86eChbMC05YS16XXsxLDR9KXwoWzAtOV17MSw0fSkpOy9naSwgZnVuY3Rpb24oXywgaGV4LCBudW1TdHIpIHtcbiAgICAgIHZhciBudW0gPSBwYXJzZUludChoZXggfHwgbnVtU3RyLCBoZXggPyAxNiA6IDEwKTtcbiAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKG51bSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRyeSB0byBleHRyYWN0IG1ldGFkYXRhIGZyb20gSlNPTi1MRCBvYmplY3QuXG4gICAqIEZvciBub3csIG9ubHkgU2NoZW1hLm9yZyBvYmplY3RzIG9mIHR5cGUgQXJ0aWNsZSBvciBpdHMgc3VidHlwZXMgYXJlIHN1cHBvcnRlZC5cbiAgICogQHJldHVybiBPYmplY3Qgd2l0aCBhbnkgbWV0YWRhdGEgdGhhdCBjb3VsZCBiZSBleHRyYWN0ZWQgKHBvc3NpYmx5IG5vbmUpXG4gICAqL1xuICBfZ2V0SlNPTkxEOiBmdW5jdGlvbiAoZG9jKSB7XG4gICAgdmFyIHNjcmlwdHMgPSB0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcoZG9jLCBbXCJzY3JpcHRcIl0pO1xuXG4gICAgdmFyIG1ldGFkYXRhO1xuXG4gICAgdGhpcy5fZm9yRWFjaE5vZGUoc2NyaXB0cywgZnVuY3Rpb24oanNvbkxkRWxlbWVudCkge1xuICAgICAgaWYgKCFtZXRhZGF0YSAmJiBqc29uTGRFbGVtZW50LmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT09IFwiYXBwbGljYXRpb24vbGQranNvblwiKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gU3RyaXAgQ0RBVEEgbWFya2VycyBpZiBwcmVzZW50XG4gICAgICAgICAgdmFyIGNvbnRlbnQgPSBqc29uTGRFbGVtZW50LnRleHRDb250ZW50LnJlcGxhY2UoL15cXHMqPCFcXFtDREFUQVxcW3xcXF1cXF0+XFxzKiQvZywgXCJcIik7XG4gICAgICAgICAgdmFyIHBhcnNlZCA9IEpTT04ucGFyc2UoY29udGVudCk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXBhcnNlZFtcIkBjb250ZXh0XCJdIHx8XG4gICAgICAgICAgICAhcGFyc2VkW1wiQGNvbnRleHRcIl0ubWF0Y2goL15odHRwcz9cXDpcXC9cXC9zY2hlbWFcXC5vcmckLylcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXBhcnNlZFtcIkB0eXBlXCJdICYmIEFycmF5LmlzQXJyYXkocGFyc2VkW1wiQGdyYXBoXCJdKSkge1xuICAgICAgICAgICAgcGFyc2VkID0gcGFyc2VkW1wiQGdyYXBoXCJdLmZpbmQoZnVuY3Rpb24oaXQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChpdFtcIkB0eXBlXCJdIHx8IFwiXCIpLm1hdGNoKFxuICAgICAgICAgICAgICAgIHRoaXMuUkVHRVhQUy5qc29uTGRBcnRpY2xlVHlwZXNcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFwYXJzZWQgfHxcbiAgICAgICAgICAgICFwYXJzZWRbXCJAdHlwZVwiXSB8fFxuICAgICAgICAgICAgIXBhcnNlZFtcIkB0eXBlXCJdLm1hdGNoKHRoaXMuUkVHRVhQUy5qc29uTGRBcnRpY2xlVHlwZXMpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWV0YWRhdGEgPSB7fTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgcGFyc2VkLm5hbWUgPT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHBhcnNlZC5oZWFkbGluZSA9PT0gXCJzdHJpbmdcIiAmJiBwYXJzZWQubmFtZSAhPT0gcGFyc2VkLmhlYWRsaW5lKSB7XG4gICAgICAgICAgICAvLyB3ZSBoYXZlIGJvdGggbmFtZSBhbmQgaGVhZGxpbmUgZWxlbWVudCBpbiB0aGUgSlNPTi1MRC4gVGhleSBzaG91bGQgYm90aCBiZSB0aGUgc2FtZSBidXQgc29tZSB3ZWJzaXRlcyBsaWtlIGFrdHVhbG5lLmN6XG4gICAgICAgICAgICAvLyBwdXQgdGhlaXIgb3duIG5hbWUgaW50byBcIm5hbWVcIiBhbmQgdGhlIGFydGljbGUgdGl0bGUgdG8gXCJoZWFkbGluZVwiIHdoaWNoIGNvbmZ1c2VzIFJlYWRhYmlsaXR5LiBTbyB3ZSB0cnkgdG8gY2hlY2sgaWYgZWl0aGVyXG4gICAgICAgICAgICAvLyBcIm5hbWVcIiBvciBcImhlYWRsaW5lXCIgY2xvc2VseSBtYXRjaGVzIHRoZSBodG1sIHRpdGxlLCBhbmQgaWYgc28sIHVzZSB0aGF0IG9uZS4gSWYgbm90LCB0aGVuIHdlIHVzZSBcIm5hbWVcIiBieSBkZWZhdWx0LlxuXG4gICAgICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLl9nZXRBcnRpY2xlVGl0bGUoKTtcbiAgICAgICAgICAgIHZhciBuYW1lTWF0Y2hlcyA9IHRoaXMuX3RleHRTaW1pbGFyaXR5KHBhcnNlZC5uYW1lLCB0aXRsZSkgPiAwLjc1O1xuICAgICAgICAgICAgdmFyIGhlYWRsaW5lTWF0Y2hlcyA9IHRoaXMuX3RleHRTaW1pbGFyaXR5KHBhcnNlZC5oZWFkbGluZSwgdGl0bGUpID4gMC43NTtcblxuICAgICAgICAgICAgaWYgKGhlYWRsaW5lTWF0Y2hlcyAmJiAhbmFtZU1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgbWV0YWRhdGEudGl0bGUgPSBwYXJzZWQuaGVhZGxpbmU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBtZXRhZGF0YS50aXRsZSA9IHBhcnNlZC5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhcnNlZC5uYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBtZXRhZGF0YS50aXRsZSA9IHBhcnNlZC5uYW1lLnRyaW0oKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJzZWQuaGVhZGxpbmUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLnRpdGxlID0gcGFyc2VkLmhlYWRsaW5lLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBhcnNlZC5hdXRob3IpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyc2VkLmF1dGhvci5uYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhLmJ5bGluZSA9IHBhcnNlZC5hdXRob3IubmFtZS50cmltKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkLmF1dGhvcikgJiYgcGFyc2VkLmF1dGhvclswXSAmJiB0eXBlb2YgcGFyc2VkLmF1dGhvclswXS5uYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhLmJ5bGluZSA9IHBhcnNlZC5hdXRob3JcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGF1dGhvcikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGF1dGhvciAmJiB0eXBlb2YgYXV0aG9yLm5hbWUgPT09IFwic3RyaW5nXCI7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uKGF1dGhvcikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGF1dGhvci5uYW1lLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5qb2luKFwiLCBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgcGFyc2VkLmRlc2NyaXB0aW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5leGNlcnB0ID0gcGFyc2VkLmRlc2NyaXB0aW9uLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgcGFyc2VkLnB1Ymxpc2hlciAmJlxuICAgICAgICAgICAgdHlwZW9mIHBhcnNlZC5wdWJsaXNoZXIubmFtZSA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICkge1xuICAgICAgICAgICAgbWV0YWRhdGEuc2l0ZU5hbWUgPSBwYXJzZWQucHVibGlzaGVyLm5hbWUudHJpbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIHBhcnNlZC5kYXRlUHVibGlzaGVkID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5kYXRlUHVibGlzaGVkID0gcGFyc2VkLmRhdGVQdWJsaXNoZWQudHJpbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHRoaXMubG9nKGVyci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBtZXRhZGF0YSA/IG1ldGFkYXRhIDoge307XG4gIH0sXG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIGdldCBleGNlcnB0IGFuZCBieWxpbmUgbWV0YWRhdGEgZm9yIHRoZSBhcnRpY2xlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0ganNvbmxkIOKAlCBvYmplY3QgY29udGFpbmluZyBhbnkgbWV0YWRhdGEgdGhhdFxuICAgKiBjb3VsZCBiZSBleHRyYWN0ZWQgZnJvbSBKU09OLUxEIG9iamVjdC5cbiAgICpcbiAgICogQHJldHVybiBPYmplY3Qgd2l0aCBvcHRpb25hbCBcImV4Y2VycHRcIiBhbmQgXCJieWxpbmVcIiBwcm9wZXJ0aWVzXG4gICAqL1xuICBfZ2V0QXJ0aWNsZU1ldGFkYXRhOiBmdW5jdGlvbihqc29ubGQpIHtcbiAgICB2YXIgbWV0YWRhdGEgPSB7fTtcbiAgICB2YXIgdmFsdWVzID0ge307XG4gICAgdmFyIG1ldGFFbGVtZW50cyA9IHRoaXMuX2RvYy5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm1ldGFcIik7XG5cbiAgICAvLyBwcm9wZXJ0eSBpcyBhIHNwYWNlLXNlcGFyYXRlZCBsaXN0IG9mIHZhbHVlc1xuICAgIHZhciBwcm9wZXJ0eVBhdHRlcm4gPSAvXFxzKihhcnRpY2xlfGRjfGRjdGVybXxvZ3x0d2l0dGVyKVxccyo6XFxzKihhdXRob3J8Y3JlYXRvcnxkZXNjcmlwdGlvbnxwdWJsaXNoZWRfdGltZXx0aXRsZXxzaXRlX25hbWUpXFxzKi9naTtcblxuICAgIC8vIG5hbWUgaXMgYSBzaW5nbGUgdmFsdWVcbiAgICB2YXIgbmFtZVBhdHRlcm4gPSAvXlxccyooPzooZGN8ZGN0ZXJtfG9nfHR3aXR0ZXJ8d2VpYm86KGFydGljbGV8d2VicGFnZSkpXFxzKltcXC46XVxccyopPyhhdXRob3J8Y3JlYXRvcnxkZXNjcmlwdGlvbnx0aXRsZXxzaXRlX25hbWUpXFxzKiQvaTtcblxuICAgIC8vIEZpbmQgZGVzY3JpcHRpb24gdGFncy5cbiAgICB0aGlzLl9mb3JFYWNoTm9kZShtZXRhRWxlbWVudHMsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIHZhciBlbGVtZW50TmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKTtcbiAgICAgIHZhciBlbGVtZW50UHJvcGVydHkgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcInByb3BlcnR5XCIpO1xuICAgICAgdmFyIGNvbnRlbnQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIik7XG4gICAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIG1hdGNoZXMgPSBudWxsO1xuICAgICAgdmFyIG5hbWUgPSBudWxsO1xuXG4gICAgICBpZiAoZWxlbWVudFByb3BlcnR5KSB7XG4gICAgICAgIG1hdGNoZXMgPSBlbGVtZW50UHJvcGVydHkubWF0Y2gocHJvcGVydHlQYXR0ZXJuKTtcbiAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAvLyBDb252ZXJ0IHRvIGxvd2VyY2FzZSwgYW5kIHJlbW92ZSBhbnkgd2hpdGVzcGFjZVxuICAgICAgICAgIC8vIHNvIHdlIGNhbiBtYXRjaCBiZWxvdy5cbiAgICAgICAgICBuYW1lID0gbWF0Y2hlc1swXS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccy9nLCBcIlwiKTtcbiAgICAgICAgICAvLyBtdWx0aXBsZSBhdXRob3JzXG4gICAgICAgICAgdmFsdWVzW25hbWVdID0gY29udGVudC50cmltKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghbWF0Y2hlcyAmJiBlbGVtZW50TmFtZSAmJiBuYW1lUGF0dGVybi50ZXN0KGVsZW1lbnROYW1lKSkge1xuICAgICAgICBuYW1lID0gZWxlbWVudE5hbWU7XG4gICAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgICAgLy8gQ29udmVydCB0byBsb3dlcmNhc2UsIHJlbW92ZSBhbnkgd2hpdGVzcGFjZSwgYW5kIGNvbnZlcnQgZG90c1xuICAgICAgICAgIC8vIHRvIGNvbG9ucyBzbyB3ZSBjYW4gbWF0Y2ggYmVsb3cuXG4gICAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMvZywgXCJcIikucmVwbGFjZSgvXFwuL2csIFwiOlwiKTtcbiAgICAgICAgICB2YWx1ZXNbbmFtZV0gPSBjb250ZW50LnRyaW0oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gZ2V0IHRpdGxlXG4gICAgbWV0YWRhdGEudGl0bGUgPSBqc29ubGQudGl0bGUgfHxcbiAgICAgICAgICAgICAgICAgICAgIHZhbHVlc1tcImRjOnRpdGxlXCJdIHx8XG4gICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbXCJkY3Rlcm06dGl0bGVcIl0gfHxcbiAgICAgICAgICAgICAgICAgICAgIHZhbHVlc1tcIm9nOnRpdGxlXCJdIHx8XG4gICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbXCJ3ZWlibzphcnRpY2xlOnRpdGxlXCJdIHx8XG4gICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbXCJ3ZWlibzp3ZWJwYWdlOnRpdGxlXCJdIHx8XG4gICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbXCJ0aXRsZVwiXSB8fFxuICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW1widHdpdHRlcjp0aXRsZVwiXTtcblxuICAgIGlmICghbWV0YWRhdGEudGl0bGUpIHtcbiAgICAgIG1ldGFkYXRhLnRpdGxlID0gdGhpcy5fZ2V0QXJ0aWNsZVRpdGxlKCk7XG4gICAgfVxuXG4gICAgLy8gZ2V0IGF1dGhvclxuICAgIG1ldGFkYXRhLmJ5bGluZSA9IGpzb25sZC5ieWxpbmUgfHxcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbXCJkYzpjcmVhdG9yXCJdIHx8XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW1wiZGN0ZXJtOmNyZWF0b3JcIl0gfHxcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbXCJhdXRob3JcIl07XG5cbiAgICAvLyBnZXQgZGVzY3JpcHRpb25cbiAgICBtZXRhZGF0YS5leGNlcnB0ID0ganNvbmxkLmV4Y2VycHQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW1wiZGM6ZGVzY3JpcHRpb25cIl0gfHxcbiAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW1wiZGN0ZXJtOmRlc2NyaXB0aW9uXCJdIHx8XG4gICAgICAgICAgICAgICAgICAgICAgIHZhbHVlc1tcIm9nOmRlc2NyaXB0aW9uXCJdIHx8XG4gICAgICAgICAgICAgICAgICAgICAgIHZhbHVlc1tcIndlaWJvOmFydGljbGU6ZGVzY3JpcHRpb25cIl0gfHxcbiAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW1wid2VpYm86d2VicGFnZTpkZXNjcmlwdGlvblwiXSB8fFxuICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbXCJkZXNjcmlwdGlvblwiXSB8fFxuICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbXCJ0d2l0dGVyOmRlc2NyaXB0aW9uXCJdO1xuXG4gICAgLy8gZ2V0IHNpdGUgbmFtZVxuICAgIG1ldGFkYXRhLnNpdGVOYW1lID0ganNvbmxkLnNpdGVOYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbXCJvZzpzaXRlX25hbWVcIl07XG5cbiAgICAvLyBnZXQgYXJ0aWNsZSBwdWJsaXNoZWQgdGltZVxuICAgIG1ldGFkYXRhLnB1Ymxpc2hlZFRpbWUgPSBqc29ubGQuZGF0ZVB1Ymxpc2hlZCB8fFxuICAgICAgdmFsdWVzW1wiYXJ0aWNsZTpwdWJsaXNoZWRfdGltZVwiXSB8fCBudWxsO1xuXG4gICAgLy8gaW4gbWFueSBzaXRlcyB0aGUgbWV0YSB2YWx1ZSBpcyBlc2NhcGVkIHdpdGggSFRNTCBlbnRpdGllcyxcbiAgICAvLyBzbyBoZXJlIHdlIG5lZWQgdG8gdW5lc2NhcGUgaXRcbiAgICBtZXRhZGF0YS50aXRsZSA9IHRoaXMuX3VuZXNjYXBlSHRtbEVudGl0aWVzKG1ldGFkYXRhLnRpdGxlKTtcbiAgICBtZXRhZGF0YS5ieWxpbmUgPSB0aGlzLl91bmVzY2FwZUh0bWxFbnRpdGllcyhtZXRhZGF0YS5ieWxpbmUpO1xuICAgIG1ldGFkYXRhLmV4Y2VycHQgPSB0aGlzLl91bmVzY2FwZUh0bWxFbnRpdGllcyhtZXRhZGF0YS5leGNlcnB0KTtcbiAgICBtZXRhZGF0YS5zaXRlTmFtZSA9IHRoaXMuX3VuZXNjYXBlSHRtbEVudGl0aWVzKG1ldGFkYXRhLnNpdGVOYW1lKTtcbiAgICBtZXRhZGF0YS5wdWJsaXNoZWRUaW1lID0gdGhpcy5fdW5lc2NhcGVIdG1sRW50aXRpZXMobWV0YWRhdGEucHVibGlzaGVkVGltZSk7XG5cbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIG5vZGUgaXMgaW1hZ2UsIG9yIGlmIG5vZGUgY29udGFpbnMgZXhhY3RseSBvbmx5IG9uZSBpbWFnZVxuICAgKiB3aGV0aGVyIGFzIGEgZGlyZWN0IGNoaWxkIG9yIGFzIGl0cyBkZXNjZW5kYW50cy5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgKiovXG4gIF9pc1NpbmdsZUltYWdlOiBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudGFnTmFtZSA9PT0gXCJJTUdcIikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoICE9PSAxIHx8IG5vZGUudGV4dENvbnRlbnQudHJpbSgpICE9PSBcIlwiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2lzU2luZ2xlSW1hZ2Uobm9kZS5jaGlsZHJlblswXSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZpbmQgYWxsIDxub3NjcmlwdD4gdGhhdCBhcmUgbG9jYXRlZCBhZnRlciA8aW1nPiBub2RlcywgYW5kIHdoaWNoIGNvbnRhaW4gb25seSBvbmVcbiAgICogPGltZz4gZWxlbWVudC4gUmVwbGFjZSB0aGUgZmlyc3QgaW1hZ2Ugd2l0aCB0aGUgaW1hZ2UgZnJvbSBpbnNpZGUgdGhlIDxub3NjcmlwdD4gdGFnLFxuICAgKiBhbmQgcmVtb3ZlIHRoZSA8bm9zY3JpcHQ+IHRhZy4gVGhpcyBpbXByb3ZlcyB0aGUgcXVhbGl0eSBvZiB0aGUgaW1hZ2VzIHdlIHVzZSBvblxuICAgKiBzb21lIHNpdGVzIChlLmcuIE1lZGl1bSkuXG4gICAqXG4gICAqIEBwYXJhbSBFbGVtZW50XG4gICoqL1xuICBfdW53cmFwTm9zY3JpcHRJbWFnZXM6IGZ1bmN0aW9uKGRvYykge1xuICAgIC8vIEZpbmQgaW1nIHdpdGhvdXQgc291cmNlIG9yIGF0dHJpYnV0ZXMgdGhhdCBtaWdodCBjb250YWlucyBpbWFnZSwgYW5kIHJlbW92ZSBpdC5cbiAgICAvLyBUaGlzIGlzIGRvbmUgdG8gcHJldmVudCBhIHBsYWNlaG9sZGVyIGltZyBpcyByZXBsYWNlZCBieSBpbWcgZnJvbSBub3NjcmlwdCBpbiBuZXh0IHN0ZXAuXG4gICAgdmFyIGltZ3MgPSBBcnJheS5mcm9tKGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKSk7XG4gICAgdGhpcy5fZm9yRWFjaE5vZGUoaW1ncywgZnVuY3Rpb24oaW1nKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltZy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhdHRyID0gaW1nLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIHN3aXRjaCAoYXR0ci5uYW1lKSB7XG4gICAgICAgICAgY2FzZSBcInNyY1wiOlxuICAgICAgICAgIGNhc2UgXCJzcmNzZXRcIjpcbiAgICAgICAgICBjYXNlIFwiZGF0YS1zcmNcIjpcbiAgICAgICAgICBjYXNlIFwiZGF0YS1zcmNzZXRcIjpcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgvXFwuKGpwZ3xqcGVnfHBuZ3x3ZWJwKS9pLnRlc3QoYXR0ci52YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW1nLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaW1nKTtcbiAgICB9KTtcblxuICAgIC8vIE5leHQgZmluZCBub3NjcmlwdCBhbmQgdHJ5IHRvIGV4dHJhY3QgaXRzIGltYWdlXG4gICAgdmFyIG5vc2NyaXB0cyA9IEFycmF5LmZyb20oZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibm9zY3JpcHRcIikpO1xuICAgIHRoaXMuX2ZvckVhY2hOb2RlKG5vc2NyaXB0cywgZnVuY3Rpb24obm9zY3JpcHQpIHtcbiAgICAgIC8vIFBhcnNlIGNvbnRlbnQgb2Ygbm9zY3JpcHQgYW5kIG1ha2Ugc3VyZSBpdCBvbmx5IGNvbnRhaW5zIGltYWdlXG4gICAgICB2YXIgdG1wID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICB0bXAuaW5uZXJIVE1MID0gbm9zY3JpcHQuaW5uZXJIVE1MO1xuICAgICAgaWYgKCF0aGlzLl9pc1NpbmdsZUltYWdlKHRtcCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBub3NjcmlwdCBoYXMgcHJldmlvdXMgc2libGluZyBhbmQgaXQgb25seSBjb250YWlucyBpbWFnZSxcbiAgICAgIC8vIHJlcGxhY2UgaXQgd2l0aCBub3NjcmlwdCBjb250ZW50LiBIb3dldmVyIHdlIGFsc28ga2VlcCBvbGRcbiAgICAgIC8vIGF0dHJpYnV0ZXMgdGhhdCBtaWdodCBjb250YWlucyBpbWFnZS5cbiAgICAgIHZhciBwcmV2RWxlbWVudCA9IG5vc2NyaXB0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICBpZiAocHJldkVsZW1lbnQgJiYgdGhpcy5faXNTaW5nbGVJbWFnZShwcmV2RWxlbWVudCkpIHtcbiAgICAgICAgdmFyIHByZXZJbWcgPSBwcmV2RWxlbWVudDtcbiAgICAgICAgaWYgKHByZXZJbWcudGFnTmFtZSAhPT0gXCJJTUdcIikge1xuICAgICAgICAgIHByZXZJbWcgPSBwcmV2RWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKVswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXdJbWcgPSB0bXAuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWdcIilbMF07XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJldkltZy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGF0dHIgPSBwcmV2SW1nLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgaWYgKGF0dHIudmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChhdHRyLm5hbWUgPT09IFwic3JjXCIgfHwgYXR0ci5uYW1lID09PSBcInNyY3NldFwiIHx8IC9cXC4oanBnfGpwZWd8cG5nfHdlYnApL2kudGVzdChhdHRyLnZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKG5ld0ltZy5nZXRBdHRyaWJ1dGUoYXR0ci5uYW1lKSA9PT0gYXR0ci52YWx1ZSkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF0dHJOYW1lID0gYXR0ci5uYW1lO1xuICAgICAgICAgICAgaWYgKG5ld0ltZy5oYXNBdHRyaWJ1dGUoYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgIGF0dHJOYW1lID0gXCJkYXRhLW9sZC1cIiArIGF0dHJOYW1lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXdJbWcuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyLnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBub3NjcmlwdC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh0bXAuZmlyc3RFbGVtZW50Q2hpbGQsIHByZXZFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlcyBzY3JpcHQgdGFncyBmcm9tIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgKiovXG4gIF9yZW1vdmVTY3JpcHRzOiBmdW5jdGlvbihkb2MpIHtcbiAgICB0aGlzLl9yZW1vdmVOb2Rlcyh0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcoZG9jLCBbXCJzY3JpcHRcIiwgXCJub3NjcmlwdFwiXSkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGlzIG5vZGUgaGFzIG9ubHkgd2hpdGVzcGFjZSBhbmQgYSBzaW5nbGUgZWxlbWVudCB3aXRoIGdpdmVuIHRhZ1xuICAgKiBSZXR1cm5zIGZhbHNlIGlmIHRoZSBESVYgbm9kZSBjb250YWlucyBub24tZW1wdHkgdGV4dCBub2Rlc1xuICAgKiBvciBpZiBpdCBjb250YWlucyBubyBlbGVtZW50IHdpdGggZ2l2ZW4gdGFnIG9yIG1vcmUgdGhhbiAxIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBFbGVtZW50XG4gICAqIEBwYXJhbSBzdHJpbmcgdGFnIG9mIGNoaWxkIGVsZW1lbnRcbiAgKiovXG4gIF9oYXNTaW5nbGVUYWdJbnNpZGVFbGVtZW50OiBmdW5jdGlvbihlbGVtZW50LCB0YWcpIHtcbiAgICAvLyBUaGVyZSBzaG91bGQgYmUgZXhhY3RseSAxIGVsZW1lbnQgY2hpbGQgd2l0aCBnaXZlbiB0YWdcbiAgICBpZiAoZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggIT0gMSB8fCBlbGVtZW50LmNoaWxkcmVuWzBdLnRhZ05hbWUgIT09IHRhZykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEFuZCB0aGVyZSBzaG91bGQgYmUgbm8gdGV4dCBub2RlcyB3aXRoIHJlYWwgY29udGVudFxuICAgIHJldHVybiAhdGhpcy5fc29tZU5vZGUoZWxlbWVudC5jaGlsZE5vZGVzLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gdGhpcy5URVhUX05PREUgJiZcbiAgICAgICAgICAgICB0aGlzLlJFR0VYUFMuaGFzQ29udGVudC50ZXN0KG5vZGUudGV4dENvbnRlbnQpO1xuICAgIH0pO1xuICB9LFxuXG4gIF9pc0VsZW1lbnRXaXRob3V0Q29udGVudDogZnVuY3Rpb24obm9kZSkge1xuICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSB0aGlzLkVMRU1FTlRfTk9ERSAmJlxuICAgICAgbm9kZS50ZXh0Q29udGVudC50cmltKCkubGVuZ3RoID09IDAgJiZcbiAgICAgIChub2RlLmNoaWxkcmVuLmxlbmd0aCA9PSAwIHx8XG4gICAgICAgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT0gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJyXCIpLmxlbmd0aCArIG5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoclwiKS5sZW5ndGgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgd2hldGhlciBlbGVtZW50IGhhcyBhbnkgY2hpbGRyZW4gYmxvY2sgbGV2ZWwgZWxlbWVudHMuXG4gICAqXG4gICAqIEBwYXJhbSBFbGVtZW50XG4gICAqL1xuICBfaGFzQ2hpbGRCbG9ja0VsZW1lbnQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvbWVOb2RlKGVsZW1lbnQuY2hpbGROb2RlcywgZnVuY3Rpb24obm9kZSkge1xuICAgICAgcmV0dXJuIHRoaXMuRElWX1RPX1BfRUxFTVMuaGFzKG5vZGUudGFnTmFtZSkgfHxcbiAgICAgICAgICAgICB0aGlzLl9oYXNDaGlsZEJsb2NrRWxlbWVudChub2RlKTtcbiAgICB9KTtcbiAgfSxcblxuICAvKioqXG4gICAqIERldGVybWluZSBpZiBhIG5vZGUgcXVhbGlmaWVzIGFzIHBocmFzaW5nIGNvbnRlbnQuXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0d1aWRlL0hUTUwvQ29udGVudF9jYXRlZ29yaWVzI1BocmFzaW5nX2NvbnRlbnRcbiAgKiovXG4gIF9pc1BocmFzaW5nQ29udGVudDogZnVuY3Rpb24obm9kZSkge1xuICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSB0aGlzLlRFWFRfTk9ERSB8fCB0aGlzLlBIUkFTSU5HX0VMRU1TLmluZGV4T2Yobm9kZS50YWdOYW1lKSAhPT0gLTEgfHxcbiAgICAgICgobm9kZS50YWdOYW1lID09PSBcIkFcIiB8fCBub2RlLnRhZ05hbWUgPT09IFwiREVMXCIgfHwgbm9kZS50YWdOYW1lID09PSBcIklOU1wiKSAmJlxuICAgICAgICB0aGlzLl9ldmVyeU5vZGUobm9kZS5jaGlsZE5vZGVzLCB0aGlzLl9pc1BocmFzaW5nQ29udGVudCkpO1xuICB9LFxuXG4gIF9pc1doaXRlc3BhY2U6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICByZXR1cm4gKG5vZGUubm9kZVR5cGUgPT09IHRoaXMuVEVYVF9OT0RFICYmIG5vZGUudGV4dENvbnRlbnQudHJpbSgpLmxlbmd0aCA9PT0gMCkgfHxcbiAgICAgICAgICAgKG5vZGUubm9kZVR5cGUgPT09IHRoaXMuRUxFTUVOVF9OT0RFICYmIG5vZGUudGFnTmFtZSA9PT0gXCJCUlwiKTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IHRoZSBpbm5lciB0ZXh0IG9mIGEgbm9kZSAtIGNyb3NzIGJyb3dzZXIgY29tcGF0aWJseS5cbiAgICogVGhpcyBhbHNvIHN0cmlwcyBvdXQgYW55IGV4Y2VzcyB3aGl0ZXNwYWNlIHRvIGJlIGZvdW5kLlxuICAgKlxuICAgKiBAcGFyYW0gRWxlbWVudFxuICAgKiBAcGFyYW0gQm9vbGVhbiBub3JtYWxpemVTcGFjZXMgKGRlZmF1bHQ6IHRydWUpXG4gICAqIEByZXR1cm4gc3RyaW5nXG4gICoqL1xuICBfZ2V0SW5uZXJUZXh0OiBmdW5jdGlvbihlLCBub3JtYWxpemVTcGFjZXMpIHtcbiAgICBub3JtYWxpemVTcGFjZXMgPSAodHlwZW9mIG5vcm1hbGl6ZVNwYWNlcyA9PT0gXCJ1bmRlZmluZWRcIikgPyB0cnVlIDogbm9ybWFsaXplU3BhY2VzO1xuICAgIHZhciB0ZXh0Q29udGVudCA9IGUudGV4dENvbnRlbnQudHJpbSgpO1xuXG4gICAgaWYgKG5vcm1hbGl6ZVNwYWNlcykge1xuICAgICAgcmV0dXJuIHRleHRDb250ZW50LnJlcGxhY2UodGhpcy5SRUdFWFBTLm5vcm1hbGl6ZSwgXCIgXCIpO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dENvbnRlbnQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIHRpbWVzIGEgc3RyaW5nIHMgYXBwZWFycyBpbiB0aGUgbm9kZSBlLlxuICAgKlxuICAgKiBAcGFyYW0gRWxlbWVudFxuICAgKiBAcGFyYW0gc3RyaW5nIC0gd2hhdCB0byBzcGxpdCBvbi4gRGVmYXVsdCBpcyBcIixcIlxuICAgKiBAcmV0dXJuIG51bWJlciAoaW50ZWdlcilcbiAgKiovXG4gIF9nZXRDaGFyQ291bnQ6IGZ1bmN0aW9uKGUsIHMpIHtcbiAgICBzID0gcyB8fCBcIixcIjtcbiAgICByZXR1cm4gdGhpcy5fZ2V0SW5uZXJUZXh0KGUpLnNwbGl0KHMpLmxlbmd0aCAtIDE7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgc3R5bGUgYXR0cmlidXRlIG9uIGV2ZXJ5IGUgYW5kIHVuZGVyLlxuICAgKiBUT0RPOiBUZXN0IGlmIGdldEVsZW1lbnRzQnlUYWdOYW1lKCopIGlzIGZhc3Rlci5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHJldHVybiB2b2lkXG4gICoqL1xuICBfY2xlYW5TdHlsZXM6IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoIWUgfHwgZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic3ZnXCIpXG4gICAgICByZXR1cm47XG5cbiAgICAvLyBSZW1vdmUgYHN0eWxlYCBhbmQgZGVwcmVjYXRlZCBwcmVzZW50YXRpb25hbCBhdHRyaWJ1dGVzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLlBSRVNFTlRBVElPTkFMX0FUVFJJQlVURVMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGUucmVtb3ZlQXR0cmlidXRlKHRoaXMuUFJFU0VOVEFUSU9OQUxfQVRUUklCVVRFU1tpXSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuREVQUkVDQVRFRF9TSVpFX0FUVFJJQlVURV9FTEVNUy5pbmRleE9mKGUudGFnTmFtZSkgIT09IC0xKSB7XG4gICAgICBlLnJlbW92ZUF0dHJpYnV0ZShcIndpZHRoXCIpO1xuICAgICAgZS5yZW1vdmVBdHRyaWJ1dGUoXCJoZWlnaHRcIik7XG4gICAgfVxuXG4gICAgdmFyIGN1ciA9IGUuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgd2hpbGUgKGN1ciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fY2xlYW5TdHlsZXMoY3VyKTtcbiAgICAgIGN1ciA9IGN1ci5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRlbnNpdHkgb2YgbGlua3MgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSBjb250ZW50XG4gICAqIFRoaXMgaXMgdGhlIGFtb3VudCBvZiB0ZXh0IHRoYXQgaXMgaW5zaWRlIGEgbGluayBkaXZpZGVkIGJ5IHRoZSB0b3RhbCB0ZXh0IGluIHRoZSBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0gRWxlbWVudFxuICAgKiBAcmV0dXJuIG51bWJlciAoZmxvYXQpXG4gICoqL1xuICBfZ2V0TGlua0RlbnNpdHk6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB2YXIgdGV4dExlbmd0aCA9IHRoaXMuX2dldElubmVyVGV4dChlbGVtZW50KS5sZW5ndGg7XG4gICAgaWYgKHRleHRMZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gMDtcblxuICAgIHZhciBsaW5rTGVuZ3RoID0gMDtcblxuICAgIC8vIFhYWCBpbXBsZW1lbnQgX3JlZHVjZU5vZGVMaXN0P1xuICAgIHRoaXMuX2ZvckVhY2hOb2RlKGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpLCBmdW5jdGlvbihsaW5rTm9kZSkge1xuICAgICAgdmFyIGhyZWYgPSBsaW5rTm9kZS5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpO1xuICAgICAgdmFyIGNvZWZmaWNpZW50ID0gaHJlZiAmJiB0aGlzLlJFR0VYUFMuaGFzaFVybC50ZXN0KGhyZWYpID8gMC4zIDogMTtcbiAgICAgIGxpbmtMZW5ndGggKz0gdGhpcy5fZ2V0SW5uZXJUZXh0KGxpbmtOb2RlKS5sZW5ndGggKiBjb2VmZmljaWVudDtcbiAgICB9KTtcblxuICAgIHJldHVybiBsaW5rTGVuZ3RoIC8gdGV4dExlbmd0aDtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGFuIGVsZW1lbnRzIGNsYXNzL2lkIHdlaWdodC4gVXNlcyByZWd1bGFyIGV4cHJlc3Npb25zIHRvIHRlbGwgaWYgdGhpc1xuICAgKiBlbGVtZW50IGxvb2tzIGdvb2Qgb3IgYmFkLlxuICAgKlxuICAgKiBAcGFyYW0gRWxlbWVudFxuICAgKiBAcmV0dXJuIG51bWJlciAoSW50ZWdlcilcbiAgKiovXG4gIF9nZXRDbGFzc1dlaWdodDogZnVuY3Rpb24oZSkge1xuICAgIGlmICghdGhpcy5fZmxhZ0lzQWN0aXZlKHRoaXMuRkxBR19XRUlHSFRfQ0xBU1NFUykpXG4gICAgICByZXR1cm4gMDtcblxuICAgIHZhciB3ZWlnaHQgPSAwO1xuXG4gICAgLy8gTG9vayBmb3IgYSBzcGVjaWFsIGNsYXNzbmFtZVxuICAgIGlmICh0eXBlb2YoZS5jbGFzc05hbWUpID09PSBcInN0cmluZ1wiICYmIGUuY2xhc3NOYW1lICE9PSBcIlwiKSB7XG4gICAgICBpZiAodGhpcy5SRUdFWFBTLm5lZ2F0aXZlLnRlc3QoZS5jbGFzc05hbWUpKVxuICAgICAgICB3ZWlnaHQgLT0gMjU7XG5cbiAgICAgIGlmICh0aGlzLlJFR0VYUFMucG9zaXRpdmUudGVzdChlLmNsYXNzTmFtZSkpXG4gICAgICAgIHdlaWdodCArPSAyNTtcbiAgICB9XG5cbiAgICAvLyBMb29rIGZvciBhIHNwZWNpYWwgSURcbiAgICBpZiAodHlwZW9mKGUuaWQpID09PSBcInN0cmluZ1wiICYmIGUuaWQgIT09IFwiXCIpIHtcbiAgICAgIGlmICh0aGlzLlJFR0VYUFMubmVnYXRpdmUudGVzdChlLmlkKSlcbiAgICAgICAgd2VpZ2h0IC09IDI1O1xuXG4gICAgICBpZiAodGhpcy5SRUdFWFBTLnBvc2l0aXZlLnRlc3QoZS5pZCkpXG4gICAgICAgIHdlaWdodCArPSAyNTtcbiAgICB9XG5cbiAgICByZXR1cm4gd2VpZ2h0O1xuICB9LFxuXG4gIC8qKlxuICAgKiBDbGVhbiBhIG5vZGUgb2YgYWxsIGVsZW1lbnRzIG9mIHR5cGUgXCJ0YWdcIi5cbiAgICogKFVubGVzcyBpdCdzIGEgeW91dHViZS92aW1lbyB2aWRlby4gUGVvcGxlIGxvdmUgbW92aWVzLilcbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHBhcmFtIHN0cmluZyB0YWcgdG8gY2xlYW5cbiAgICogQHJldHVybiB2b2lkXG4gICAqKi9cbiAgX2NsZWFuOiBmdW5jdGlvbihlLCB0YWcpIHtcbiAgICB2YXIgaXNFbWJlZCA9IFtcIm9iamVjdFwiLCBcImVtYmVkXCIsIFwiaWZyYW1lXCJdLmluZGV4T2YodGFnKSAhPT0gLTE7XG5cbiAgICB0aGlzLl9yZW1vdmVOb2Rlcyh0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcoZSwgW3RhZ10pLCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAvLyBBbGxvdyB5b3V0dWJlIGFuZCB2aW1lbyB2aWRlb3MgdGhyb3VnaCBhcyBwZW9wbGUgdXN1YWxseSB3YW50IHRvIHNlZSB0aG9zZS5cbiAgICAgIGlmIChpc0VtYmVkKSB7XG4gICAgICAgIC8vIEZpcnN0LCBjaGVjayB0aGUgZWxlbWVudHMgYXR0cmlidXRlcyB0byBzZWUgaWYgYW55IG9mIHRoZW0gY29udGFpbiB5b3V0dWJlIG9yIHZpbWVvXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2FsbG93ZWRWaWRlb1JlZ2V4LnRlc3QoZWxlbWVudC5hdHRyaWJ1dGVzW2ldLnZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZvciBlbWJlZCB3aXRoIDxvYmplY3Q+IHRhZywgY2hlY2sgaW5uZXIgSFRNTCBhcyB3ZWxsLlxuICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSBcIm9iamVjdFwiICYmIHRoaXMuX2FsbG93ZWRWaWRlb1JlZ2V4LnRlc3QoZWxlbWVudC5pbm5lckhUTUwpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGdpdmVuIG5vZGUgaGFzIG9uZSBvZiBpdHMgYW5jZXN0b3IgdGFnIG5hbWUgbWF0Y2hpbmcgdGhlXG4gICAqIHByb3ZpZGVkIG9uZS5cbiAgICogQHBhcmFtICBIVE1MRWxlbWVudCBub2RlXG4gICAqIEBwYXJhbSAgU3RyaW5nICAgICAgdGFnTmFtZVxuICAgKiBAcGFyYW0gIE51bWJlciAgICAgIG1heERlcHRoXG4gICAqIEBwYXJhbSAgRnVuY3Rpb24gICAgZmlsdGVyRm4gYSBmaWx0ZXIgdG8gaW52b2tlIHRvIGRldGVybWluZSB3aGV0aGVyIHRoaXMgbm9kZSAnY291bnRzJ1xuICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICovXG4gIF9oYXNBbmNlc3RvclRhZzogZnVuY3Rpb24obm9kZSwgdGFnTmFtZSwgbWF4RGVwdGgsIGZpbHRlckZuKSB7XG4gICAgbWF4RGVwdGggPSBtYXhEZXB0aCB8fCAzO1xuICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgdmFyIGRlcHRoID0gMDtcbiAgICB3aGlsZSAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICBpZiAobWF4RGVwdGggPiAwICYmIGRlcHRoID4gbWF4RGVwdGgpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChub2RlLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gdGFnTmFtZSAmJiAoIWZpbHRlckZuIHx8IGZpbHRlckZuKG5vZGUucGFyZW50Tm9kZSkpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICBkZXB0aCsrO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybiBhbiBvYmplY3QgaW5kaWNhdGluZyBob3cgbWFueSByb3dzIGFuZCBjb2x1bW5zIHRoaXMgdGFibGUgaGFzLlxuICAgKi9cbiAgX2dldFJvd0FuZENvbHVtbkNvdW50OiBmdW5jdGlvbih0YWJsZSkge1xuICAgIHZhciByb3dzID0gMDtcbiAgICB2YXIgY29sdW1ucyA9IDA7XG4gICAgdmFyIHRycyA9IHRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJcIik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciByb3dzcGFuID0gdHJzW2ldLmdldEF0dHJpYnV0ZShcInJvd3NwYW5cIikgfHwgMDtcbiAgICAgIGlmIChyb3dzcGFuKSB7XG4gICAgICAgIHJvd3NwYW4gPSBwYXJzZUludChyb3dzcGFuLCAxMCk7XG4gICAgICB9XG4gICAgICByb3dzICs9IChyb3dzcGFuIHx8IDEpO1xuXG4gICAgICAvLyBOb3cgbG9vayBmb3IgY29sdW1uLXJlbGF0ZWQgaW5mb1xuICAgICAgdmFyIGNvbHVtbnNJblRoaXNSb3cgPSAwO1xuICAgICAgdmFyIGNlbGxzID0gdHJzW2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGRcIik7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNlbGxzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gY2VsbHNbal0uZ2V0QXR0cmlidXRlKFwiY29sc3BhblwiKSB8fCAwO1xuICAgICAgICBpZiAoY29sc3Bhbikge1xuICAgICAgICAgIGNvbHNwYW4gPSBwYXJzZUludChjb2xzcGFuLCAxMCk7XG4gICAgICAgIH1cbiAgICAgICAgY29sdW1uc0luVGhpc1JvdyArPSAoY29sc3BhbiB8fCAxKTtcbiAgICAgIH1cbiAgICAgIGNvbHVtbnMgPSBNYXRoLm1heChjb2x1bW5zLCBjb2x1bW5zSW5UaGlzUm93KTtcbiAgICB9XG4gICAgcmV0dXJuIHtyb3dzOiByb3dzLCBjb2x1bW5zOiBjb2x1bW5zfTtcbiAgfSxcblxuICAvKipcbiAgICogTG9vayBmb3IgJ2RhdGEnIChhcyBvcHBvc2VkIHRvICdsYXlvdXQnKSB0YWJsZXMsIGZvciB3aGljaCB3ZSB1c2VcbiAgICogc2ltaWxhciBjaGVja3MgYXNcbiAgICogaHR0cHM6Ly9zZWFyY2hmb3gub3JnL21vemlsbGEtY2VudHJhbC9yZXYvZjgyZDVjNTQ5ZjA0NmNiNjRjZTU2MDJiZmQ4OTRiN2FlODA3YzhmOC9hY2Nlc3NpYmxlL2dlbmVyaWMvVGFibGVBY2Nlc3NpYmxlLmNwcCMxOVxuICAgKi9cbiAgX21hcmtEYXRhVGFibGVzOiBmdW5jdGlvbihyb290KSB7XG4gICAgdmFyIHRhYmxlcyA9IHJvb3QuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0YWJsZVwiKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhYmxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRhYmxlID0gdGFibGVzW2ldO1xuICAgICAgdmFyIHJvbGUgPSB0YWJsZS5nZXRBdHRyaWJ1dGUoXCJyb2xlXCIpO1xuICAgICAgaWYgKHJvbGUgPT0gXCJwcmVzZW50YXRpb25cIikge1xuICAgICAgICB0YWJsZS5fcmVhZGFiaWxpdHlEYXRhVGFibGUgPSBmYWxzZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgZGF0YXRhYmxlID0gdGFibGUuZ2V0QXR0cmlidXRlKFwiZGF0YXRhYmxlXCIpO1xuICAgICAgaWYgKGRhdGF0YWJsZSA9PSBcIjBcIikge1xuICAgICAgICB0YWJsZS5fcmVhZGFiaWxpdHlEYXRhVGFibGUgPSBmYWxzZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgc3VtbWFyeSA9IHRhYmxlLmdldEF0dHJpYnV0ZShcInN1bW1hcnlcIik7XG4gICAgICBpZiAoc3VtbWFyeSkge1xuICAgICAgICB0YWJsZS5fcmVhZGFiaWxpdHlEYXRhVGFibGUgPSB0cnVlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhcHRpb24gPSB0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImNhcHRpb25cIilbMF07XG4gICAgICBpZiAoY2FwdGlvbiAmJiBjYXB0aW9uLmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB0YWJsZS5fcmVhZGFiaWxpdHlEYXRhVGFibGUgPSB0cnVlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIHRhYmxlIGhhcyBhIGRlc2NlbmRhbnQgd2l0aCBhbnkgb2YgdGhlc2UgdGFncywgY29uc2lkZXIgYSBkYXRhIHRhYmxlOlxuICAgICAgdmFyIGRhdGFUYWJsZURlc2NlbmRhbnRzID0gW1wiY29sXCIsIFwiY29sZ3JvdXBcIiwgXCJ0Zm9vdFwiLCBcInRoZWFkXCIsIFwidGhcIl07XG4gICAgICB2YXIgZGVzY2VuZGFudEV4aXN0cyA9IGZ1bmN0aW9uKHRhZykge1xuICAgICAgICByZXR1cm4gISF0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWcpWzBdO1xuICAgICAgfTtcbiAgICAgIGlmIChkYXRhVGFibGVEZXNjZW5kYW50cy5zb21lKGRlc2NlbmRhbnRFeGlzdHMpKSB7XG4gICAgICAgIHRoaXMubG9nKFwiRGF0YSB0YWJsZSBiZWNhdXNlIGZvdW5kIGRhdGEteSBkZXNjZW5kYW50XCIpO1xuICAgICAgICB0YWJsZS5fcmVhZGFiaWxpdHlEYXRhVGFibGUgPSB0cnVlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gTmVzdGVkIHRhYmxlcyBpbmRpY2F0ZSBhIGxheW91dCB0YWJsZTpcbiAgICAgIGlmICh0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRhYmxlXCIpWzBdKSB7XG4gICAgICAgIHRhYmxlLl9yZWFkYWJpbGl0eURhdGFUYWJsZSA9IGZhbHNlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNpemVJbmZvID0gdGhpcy5fZ2V0Um93QW5kQ29sdW1uQ291bnQodGFibGUpO1xuICAgICAgaWYgKHNpemVJbmZvLnJvd3MgPj0gMTAgfHwgc2l6ZUluZm8uY29sdW1ucyA+IDQpIHtcbiAgICAgICAgdGFibGUuX3JlYWRhYmlsaXR5RGF0YVRhYmxlID0gdHJ1ZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyBOb3cganVzdCBnbyBieSBzaXplIGVudGlyZWx5OlxuICAgICAgdGFibGUuX3JlYWRhYmlsaXR5RGF0YVRhYmxlID0gc2l6ZUluZm8ucm93cyAqIHNpemVJbmZvLmNvbHVtbnMgPiAxMDtcbiAgICB9XG4gIH0sXG5cbiAgLyogY29udmVydCBpbWFnZXMgYW5kIGZpZ3VyZXMgdGhhdCBoYXZlIHByb3BlcnRpZXMgbGlrZSBkYXRhLXNyYyBpbnRvIGltYWdlcyB0aGF0IGNhbiBiZSBsb2FkZWQgd2l0aG91dCBKUyAqL1xuICBfZml4TGF6eUltYWdlczogZnVuY3Rpb24gKHJvb3QpIHtcbiAgICB0aGlzLl9mb3JFYWNoTm9kZSh0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcocm9vdCwgW1wiaW1nXCIsIFwicGljdHVyZVwiLCBcImZpZ3VyZVwiXSksIGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAvLyBJbiBzb21lIHNpdGVzIChlLmcuIEtvdGFrdSksIHRoZXkgcHV0IDFweCBzcXVhcmUgaW1hZ2UgYXMgYmFzZTY0IGRhdGEgdXJpIGluIHRoZSBzcmMgYXR0cmlidXRlLlxuICAgICAgLy8gU28sIGhlcmUgd2UgY2hlY2sgaWYgdGhlIGRhdGEgdXJpIGlzIHRvbyBzaG9ydCwganVzdCBtaWdodCBhcyB3ZWxsIHJlbW92ZSBpdC5cbiAgICAgIGlmIChlbGVtLnNyYyAmJiB0aGlzLlJFR0VYUFMuYjY0RGF0YVVybC50ZXN0KGVsZW0uc3JjKSkge1xuICAgICAgICAvLyBNYWtlIHN1cmUgaXQncyBub3QgU1ZHLCBiZWNhdXNlIFNWRyBjYW4gaGF2ZSBhIG1lYW5pbmdmdWwgaW1hZ2UgaW4gdW5kZXIgMTMzIGJ5dGVzLlxuICAgICAgICB2YXIgcGFydHMgPSB0aGlzLlJFR0VYUFMuYjY0RGF0YVVybC5leGVjKGVsZW0uc3JjKTtcbiAgICAgICAgaWYgKHBhcnRzWzFdID09PSBcImltYWdlL3N2Zyt4bWxcIikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGlzIGVsZW1lbnQgaGFzIG90aGVyIGF0dHJpYnV0ZXMgd2hpY2ggY29udGFpbnMgaW1hZ2UuXG4gICAgICAgIC8vIElmIGl0IGRvZXNuJ3QsIHRoZW4gdGhpcyBzcmMgaXMgaW1wb3J0YW50IGFuZCBzaG91bGRuJ3QgYmUgcmVtb3ZlZC5cbiAgICAgICAgdmFyIHNyY0NvdWxkQmVSZW1vdmVkID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGF0dHIgPSBlbGVtLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgaWYgKGF0dHIubmFtZSA9PT0gXCJzcmNcIikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKC9cXC4oanBnfGpwZWd8cG5nfHdlYnApL2kudGVzdChhdHRyLnZhbHVlKSkge1xuICAgICAgICAgICAgc3JjQ291bGRCZVJlbW92ZWQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGVyZSB3ZSBhc3N1bWUgaWYgaW1hZ2UgaXMgbGVzcyB0aGFuIDEwMCBieXRlcyAob3IgMTMzQiBhZnRlciBlbmNvZGVkIHRvIGJhc2U2NClcbiAgICAgICAgLy8gaXQgd2lsbCBiZSB0b28gc21hbGwsIHRoZXJlZm9yZSBpdCBtaWdodCBiZSBwbGFjZWhvbGRlciBpbWFnZS5cbiAgICAgICAgaWYgKHNyY0NvdWxkQmVSZW1vdmVkKSB7XG4gICAgICAgICAgdmFyIGI2NHN0YXJ0cyA9IGVsZW0uc3JjLnNlYXJjaCgvYmFzZTY0XFxzKi9pKSArIDc7XG4gICAgICAgICAgdmFyIGI2NGxlbmd0aCA9IGVsZW0uc3JjLmxlbmd0aCAtIGI2NHN0YXJ0cztcbiAgICAgICAgICBpZiAoYjY0bGVuZ3RoIDwgMTMzKSB7XG4gICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZShcInNyY1wiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYWxzbyBjaGVjayBmb3IgXCJudWxsXCIgdG8gd29yayBhcm91bmQgaHR0cHM6Ly9naXRodWIuY29tL2pzZG9tL2pzZG9tL2lzc3Vlcy8yNTgwXG4gICAgICBpZiAoKGVsZW0uc3JjIHx8IChlbGVtLnNyY3NldCAmJiBlbGVtLnNyY3NldCAhPSBcIm51bGxcIikpICYmIGVsZW0uY2xhc3NOYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImxhenlcIikgPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBlbGVtLmF0dHJpYnV0ZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgYXR0ciA9IGVsZW0uYXR0cmlidXRlc1tqXTtcbiAgICAgICAgaWYgKGF0dHIubmFtZSA9PT0gXCJzcmNcIiB8fCBhdHRyLm5hbWUgPT09IFwic3Jjc2V0XCIgfHwgYXR0ci5uYW1lID09PSBcImFsdFwiKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvcHlUbyA9IG51bGw7XG4gICAgICAgIGlmICgvXFwuKGpwZ3xqcGVnfHBuZ3x3ZWJwKVxccytcXGQvLnRlc3QoYXR0ci52YWx1ZSkpIHtcbiAgICAgICAgICBjb3B5VG8gPSBcInNyY3NldFwiO1xuICAgICAgICB9IGVsc2UgaWYgKC9eXFxzKlxcUytcXC4oanBnfGpwZWd8cG5nfHdlYnApXFxTKlxccyokLy50ZXN0KGF0dHIudmFsdWUpKSB7XG4gICAgICAgICAgY29weVRvID0gXCJzcmNcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29weVRvKSB7XG4gICAgICAgICAgLy9pZiB0aGlzIGlzIGFuIGltZyBvciBwaWN0dXJlLCBzZXQgdGhlIGF0dHJpYnV0ZSBkaXJlY3RseVxuICAgICAgICAgIGlmIChlbGVtLnRhZ05hbWUgPT09IFwiSU1HXCIgfHwgZWxlbS50YWdOYW1lID09PSBcIlBJQ1RVUkVcIikge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoY29weVRvLCBhdHRyLnZhbHVlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsZW0udGFnTmFtZSA9PT0gXCJGSUdVUkVcIiAmJiAhdGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKGVsZW0sIFtcImltZ1wiLCBcInBpY3R1cmVcIl0pLmxlbmd0aCkge1xuICAgICAgICAgICAgLy9pZiB0aGUgaXRlbSBpcyBhIDxmaWd1cmU+IHRoYXQgZG9lcyBub3QgY29udGFpbiBhbiBpbWFnZSBvciBwaWN0dXJlLCBjcmVhdGUgb25lIGFuZCBwbGFjZSBpdCBpbnNpZGUgdGhlIGZpZ3VyZVxuICAgICAgICAgICAgLy9zZWUgdGhlIG55dGltZXMtMyB0ZXN0Y2FzZSBmb3IgYW4gZXhhbXBsZVxuICAgICAgICAgICAgdmFyIGltZyA9IHRoaXMuX2RvYy5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZShjb3B5VG8sIGF0dHIudmFsdWUpO1xuICAgICAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChpbWcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIF9nZXRUZXh0RGVuc2l0eTogZnVuY3Rpb24oZSwgdGFncykge1xuICAgIHZhciB0ZXh0TGVuZ3RoID0gdGhpcy5fZ2V0SW5uZXJUZXh0KGUsIHRydWUpLmxlbmd0aDtcbiAgICBpZiAodGV4dExlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHZhciBjaGlsZHJlbkxlbmd0aCA9IDA7XG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKGUsIHRhZ3MpO1xuICAgIHRoaXMuX2ZvckVhY2hOb2RlKGNoaWxkcmVuLCAoY2hpbGQpID0+IGNoaWxkcmVuTGVuZ3RoICs9IHRoaXMuX2dldElubmVyVGV4dChjaGlsZCwgdHJ1ZSkubGVuZ3RoKTtcbiAgICByZXR1cm4gY2hpbGRyZW5MZW5ndGggLyB0ZXh0TGVuZ3RoO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDbGVhbiBhbiBlbGVtZW50IG9mIGFsbCB0YWdzIG9mIHR5cGUgXCJ0YWdcIiBpZiB0aGV5IGxvb2sgZmlzaHkuXG4gICAqIFwiRmlzaHlcIiBpcyBhbiBhbGdvcml0aG0gYmFzZWQgb24gY29udGVudCBsZW5ndGgsIGNsYXNzbmFtZXMsIGxpbmsgZGVuc2l0eSwgbnVtYmVyIG9mIGltYWdlcyAmIGVtYmVkcywgZXRjLlxuICAgKlxuICAgKiBAcmV0dXJuIHZvaWRcbiAgICoqL1xuICBfY2xlYW5Db25kaXRpb25hbGx5OiBmdW5jdGlvbihlLCB0YWcpIHtcbiAgICBpZiAoIXRoaXMuX2ZsYWdJc0FjdGl2ZSh0aGlzLkZMQUdfQ0xFQU5fQ09ORElUSU9OQUxMWSkpXG4gICAgICByZXR1cm47XG5cbiAgICAvLyBHYXRoZXIgY291bnRzIGZvciBvdGhlciB0eXBpY2FsIGVsZW1lbnRzIGVtYmVkZGVkIHdpdGhpbi5cbiAgICAvLyBUcmF2ZXJzZSBiYWNrd2FyZHMgc28gd2UgY2FuIHJlbW92ZSBub2RlcyBhdCB0aGUgc2FtZSB0aW1lXG4gICAgLy8gd2l0aG91dCBlZmZlY3RpbmcgdGhlIHRyYXZlcnNhbC5cbiAgICAvL1xuICAgIC8vIFRPRE86IENvbnNpZGVyIHRha2luZyBpbnRvIGFjY291bnQgb3JpZ2luYWwgY29udGVudFNjb3JlIGhlcmUuXG4gICAgdGhpcy5fcmVtb3ZlTm9kZXModGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKGUsIFt0YWddKSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgLy8gRmlyc3QgY2hlY2sgaWYgdGhpcyBub2RlIElTIGRhdGEgdGFibGUsIGluIHdoaWNoIGNhc2UgZG9uJ3QgcmVtb3ZlIGl0LlxuICAgICAgdmFyIGlzRGF0YVRhYmxlID0gZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdC5fcmVhZGFiaWxpdHlEYXRhVGFibGU7XG4gICAgICB9O1xuXG4gICAgICB2YXIgaXNMaXN0ID0gdGFnID09PSBcInVsXCIgfHwgdGFnID09PSBcIm9sXCI7XG4gICAgICBpZiAoIWlzTGlzdCkge1xuICAgICAgICB2YXIgbGlzdExlbmd0aCA9IDA7XG4gICAgICAgIHZhciBsaXN0Tm9kZXMgPSB0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcobm9kZSwgW1widWxcIiwgXCJvbFwiXSk7XG4gICAgICAgIHRoaXMuX2ZvckVhY2hOb2RlKGxpc3ROb2RlcywgKGxpc3QpID0+IGxpc3RMZW5ndGggKz0gdGhpcy5fZ2V0SW5uZXJUZXh0KGxpc3QpLmxlbmd0aCk7XG4gICAgICAgIGlzTGlzdCA9IGxpc3RMZW5ndGggLyB0aGlzLl9nZXRJbm5lclRleHQobm9kZSkubGVuZ3RoID4gMC45O1xuICAgICAgfVxuXG4gICAgICBpZiAodGFnID09PSBcInRhYmxlXCIgJiYgaXNEYXRhVGFibGUobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBOZXh0IGNoZWNrIGlmIHdlJ3JlIGluc2lkZSBhIGRhdGEgdGFibGUsIGluIHdoaWNoIGNhc2UgZG9uJ3QgcmVtb3ZlIGl0IGFzIHdlbGwuXG4gICAgICBpZiAodGhpcy5faGFzQW5jZXN0b3JUYWcobm9kZSwgXCJ0YWJsZVwiLCAtMSwgaXNEYXRhVGFibGUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2hhc0FuY2VzdG9yVGFnKG5vZGUsIFwiY29kZVwiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciB3ZWlnaHQgPSB0aGlzLl9nZXRDbGFzc1dlaWdodChub2RlKTtcblxuICAgICAgdGhpcy5sb2coXCJDbGVhbmluZyBDb25kaXRpb25hbGx5XCIsIG5vZGUpO1xuXG4gICAgICB2YXIgY29udGVudFNjb3JlID0gMDtcblxuICAgICAgaWYgKHdlaWdodCArIGNvbnRlbnRTY29yZSA8IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9nZXRDaGFyQ291bnQobm9kZSwgXCIsXCIpIDwgMTApIHtcbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vdCB2ZXJ5IG1hbnkgY29tbWFzLCBhbmQgdGhlIG51bWJlciBvZlxuICAgICAgICAvLyBub24tcGFyYWdyYXBoIGVsZW1lbnRzIGlzIG1vcmUgdGhhbiBwYXJhZ3JhcGhzIG9yIG90aGVyXG4gICAgICAgIC8vIG9taW5vdXMgc2lnbnMsIHJlbW92ZSB0aGUgZWxlbWVudC5cbiAgICAgICAgdmFyIHAgPSBub2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicFwiKS5sZW5ndGg7XG4gICAgICAgIHZhciBpbWcgPSBub2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW1nXCIpLmxlbmd0aDtcbiAgICAgICAgdmFyIGxpID0gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImxpXCIpLmxlbmd0aCAtIDEwMDtcbiAgICAgICAgdmFyIGlucHV0ID0gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpLmxlbmd0aDtcbiAgICAgICAgdmFyIGhlYWRpbmdEZW5zaXR5ID0gdGhpcy5fZ2V0VGV4dERlbnNpdHkobm9kZSwgW1wiaDFcIiwgXCJoMlwiLCBcImgzXCIsIFwiaDRcIiwgXCJoNVwiLCBcImg2XCJdKTtcblxuICAgICAgICB2YXIgZW1iZWRDb3VudCA9IDA7XG4gICAgICAgIHZhciBlbWJlZHMgPSB0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcobm9kZSwgW1wib2JqZWN0XCIsIFwiZW1iZWRcIiwgXCJpZnJhbWVcIl0pO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW1iZWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgLy8gSWYgdGhpcyBlbWJlZCBoYXMgYXR0cmlidXRlIHRoYXQgbWF0Y2hlcyB2aWRlbyByZWdleCwgZG9uJ3QgZGVsZXRlIGl0LlxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZW1iZWRzW2ldLmF0dHJpYnV0ZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9hbGxvd2VkVmlkZW9SZWdleC50ZXN0KGVtYmVkc1tpXS5hdHRyaWJ1dGVzW2pdLnZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRm9yIGVtYmVkIHdpdGggPG9iamVjdD4gdGFnLCBjaGVjayBpbm5lciBIVE1MIGFzIHdlbGwuXG4gICAgICAgICAgaWYgKGVtYmVkc1tpXS50YWdOYW1lID09PSBcIm9iamVjdFwiICYmIHRoaXMuX2FsbG93ZWRWaWRlb1JlZ2V4LnRlc3QoZW1iZWRzW2ldLmlubmVySFRNTCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlbWJlZENvdW50Kys7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGlua0RlbnNpdHkgPSB0aGlzLl9nZXRMaW5rRGVuc2l0eShub2RlKTtcbiAgICAgICAgdmFyIGNvbnRlbnRMZW5ndGggPSB0aGlzLl9nZXRJbm5lclRleHQobm9kZSkubGVuZ3RoO1xuXG4gICAgICAgIHZhciBoYXZlVG9SZW1vdmUgPVxuICAgICAgICAgIChpbWcgPiAxICYmIHAgLyBpbWcgPCAwLjUgJiYgIXRoaXMuX2hhc0FuY2VzdG9yVGFnKG5vZGUsIFwiZmlndXJlXCIpKSB8fFxuICAgICAgICAgICghaXNMaXN0ICYmIGxpID4gcCkgfHxcbiAgICAgICAgICAoaW5wdXQgPiBNYXRoLmZsb29yKHAvMykpIHx8XG4gICAgICAgICAgKCFpc0xpc3QgJiYgaGVhZGluZ0RlbnNpdHkgPCAwLjkgJiYgY29udGVudExlbmd0aCA8IDI1ICYmIChpbWcgPT09IDAgfHwgaW1nID4gMikgJiYgIXRoaXMuX2hhc0FuY2VzdG9yVGFnKG5vZGUsIFwiZmlndXJlXCIpKSB8fFxuICAgICAgICAgICghaXNMaXN0ICYmIHdlaWdodCA8IDI1ICYmIGxpbmtEZW5zaXR5ID4gMC4yKSB8fFxuICAgICAgICAgICh3ZWlnaHQgPj0gMjUgJiYgbGlua0RlbnNpdHkgPiAwLjUpIHx8XG4gICAgICAgICAgKChlbWJlZENvdW50ID09PSAxICYmIGNvbnRlbnRMZW5ndGggPCA3NSkgfHwgZW1iZWRDb3VudCA+IDEpO1xuICAgICAgICAvLyBBbGxvdyBzaW1wbGUgbGlzdHMgb2YgaW1hZ2VzIHRvIHJlbWFpbiBpbiBwYWdlc1xuICAgICAgICBpZiAoaXNMaXN0ICYmIGhhdmVUb1JlbW92ZSkge1xuICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gbm9kZS5jaGlsZHJlblt4XTtcbiAgICAgICAgICAgIC8vIERvbid0IGZpbHRlciBpbiBsaXN0cyB3aXRoIGxpJ3MgdGhhdCBjb250YWluIG1vcmUgdGhhbiBvbmUgY2hpbGRcbiAgICAgICAgICAgIGlmIChjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYXZlVG9SZW1vdmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBsaV9jb3VudCA9IG5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaVwiKS5sZW5ndGg7XG4gICAgICAgICAgLy8gT25seSBhbGxvdyB0aGUgbGlzdCB0byByZW1haW4gaWYgZXZlcnkgbGkgY29udGFpbnMgYW4gaW1hZ2VcbiAgICAgICAgICBpZiAoaW1nID09IGxpX2NvdW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXZlVG9SZW1vdmU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENsZWFuIG91dCBlbGVtZW50cyB0aGF0IG1hdGNoIHRoZSBzcGVjaWZpZWQgY29uZGl0aW9uc1xuICAgKlxuICAgKiBAcGFyYW0gRWxlbWVudFxuICAgKiBAcGFyYW0gRnVuY3Rpb24gZGV0ZXJtaW5lcyB3aGV0aGVyIGEgbm9kZSBzaG91bGQgYmUgcmVtb3ZlZFxuICAgKiBAcmV0dXJuIHZvaWRcbiAgICoqL1xuICBfY2xlYW5NYXRjaGVkTm9kZXM6IGZ1bmN0aW9uKGUsIGZpbHRlcikge1xuICAgIHZhciBlbmRPZlNlYXJjaE1hcmtlck5vZGUgPSB0aGlzLl9nZXROZXh0Tm9kZShlLCB0cnVlKTtcbiAgICB2YXIgbmV4dCA9IHRoaXMuX2dldE5leHROb2RlKGUpO1xuICAgIHdoaWxlIChuZXh0ICYmIG5leHQgIT0gZW5kT2ZTZWFyY2hNYXJrZXJOb2RlKSB7XG4gICAgICBpZiAoZmlsdGVyLmNhbGwodGhpcywgbmV4dCwgbmV4dC5jbGFzc05hbWUgKyBcIiBcIiArIG5leHQuaWQpKSB7XG4gICAgICAgIG5leHQgPSB0aGlzLl9yZW1vdmVBbmRHZXROZXh0KG5leHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dCA9IHRoaXMuX2dldE5leHROb2RlKG5leHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2xlYW4gb3V0IHNwdXJpb3VzIGhlYWRlcnMgZnJvbSBhbiBFbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gRWxlbWVudFxuICAgKiBAcmV0dXJuIHZvaWRcbiAgKiovXG4gIF9jbGVhbkhlYWRlcnM6IGZ1bmN0aW9uKGUpIHtcbiAgICBsZXQgaGVhZGluZ05vZGVzID0gdGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKGUsIFtcImgxXCIsIFwiaDJcIl0pO1xuICAgIHRoaXMuX3JlbW92ZU5vZGVzKGhlYWRpbmdOb2RlcywgZnVuY3Rpb24obm9kZSkge1xuICAgICAgbGV0IHNob3VsZFJlbW92ZSA9IHRoaXMuX2dldENsYXNzV2VpZ2h0KG5vZGUpIDwgMDtcbiAgICAgIGlmIChzaG91bGRSZW1vdmUpIHtcbiAgICAgICAgdGhpcy5sb2coXCJSZW1vdmluZyBoZWFkZXIgd2l0aCBsb3cgY2xhc3Mgd2VpZ2h0OlwiLCBub2RlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzaG91bGRSZW1vdmU7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoaXMgbm9kZSBpcyBhbiBIMSBvciBIMiBlbGVtZW50IHdob3NlIGNvbnRlbnQgaXMgbW9zdGx5XG4gICAqIHRoZSBzYW1lIGFzIHRoZSBhcnRpY2xlIHRpdGxlLlxuICAgKlxuICAgKiBAcGFyYW0gRWxlbWVudCAgdGhlIG5vZGUgdG8gY2hlY2suXG4gICAqIEByZXR1cm4gYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhpcyBpcyBhIHRpdGxlLWxpa2UgaGVhZGVyLlxuICAgKi9cbiAgX2hlYWRlckR1cGxpY2F0ZXNUaXRsZTogZnVuY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlLnRhZ05hbWUgIT0gXCJIMVwiICYmIG5vZGUudGFnTmFtZSAhPSBcIkgyXCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGhlYWRpbmcgPSB0aGlzLl9nZXRJbm5lclRleHQobm9kZSwgZmFsc2UpO1xuICAgIHRoaXMubG9nKFwiRXZhbHVhdGluZyBzaW1pbGFyaXR5IG9mIGhlYWRlcjpcIiwgaGVhZGluZywgdGhpcy5fYXJ0aWNsZVRpdGxlKTtcbiAgICByZXR1cm4gdGhpcy5fdGV4dFNpbWlsYXJpdHkodGhpcy5fYXJ0aWNsZVRpdGxlLCBoZWFkaW5nKSA+IDAuNzU7XG4gIH0sXG5cbiAgX2ZsYWdJc0FjdGl2ZTogZnVuY3Rpb24oZmxhZykge1xuICAgIHJldHVybiAodGhpcy5fZmxhZ3MgJiBmbGFnKSA+IDA7XG4gIH0sXG5cbiAgX3JlbW92ZUZsYWc6IGZ1bmN0aW9uKGZsYWcpIHtcbiAgICB0aGlzLl9mbGFncyA9IHRoaXMuX2ZsYWdzICYgfmZsYWc7XG4gIH0sXG5cbiAgX2lzUHJvYmFibHlWaXNpYmxlOiBmdW5jdGlvbihub2RlKSB7XG4gICAgLy8gSGF2ZSB0byBudWxsLWNoZWNrIG5vZGUuc3R5bGUgYW5kIG5vZGUuY2xhc3NOYW1lLmluZGV4T2YgdG8gZGVhbCB3aXRoIFNWRyBhbmQgTWF0aE1MIG5vZGVzLlxuICAgIHJldHVybiAoIW5vZGUuc3R5bGUgfHwgbm9kZS5zdHlsZS5kaXNwbGF5ICE9IFwibm9uZVwiKVxuICAgICAgJiYgKCFub2RlLnN0eWxlIHx8IG5vZGUuc3R5bGUudmlzaWJpbGl0eSAhPSBcImhpZGRlblwiKVxuICAgICAgJiYgIW5vZGUuaGFzQXR0cmlidXRlKFwiaGlkZGVuXCIpXG4gICAgICAvL2NoZWNrIGZvciBcImZhbGxiYWNrLWltYWdlXCIgc28gdGhhdCB3aWtpbWVkaWEgbWF0aCBpbWFnZXMgYXJlIGRpc3BsYXllZFxuICAgICAgJiYgKCFub2RlLmhhc0F0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpIHx8IG5vZGUuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgIT0gXCJ0cnVlXCIgfHwgKG5vZGUuY2xhc3NOYW1lICYmIG5vZGUuY2xhc3NOYW1lLmluZGV4T2YgJiYgbm9kZS5jbGFzc05hbWUuaW5kZXhPZihcImZhbGxiYWNrLWltYWdlXCIpICE9PSAtMSkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSdW5zIHJlYWRhYmlsaXR5LlxuICAgKlxuICAgKiBXb3JrZmxvdzpcbiAgICogIDEuIFByZXAgdGhlIGRvY3VtZW50IGJ5IHJlbW92aW5nIHNjcmlwdCB0YWdzLCBjc3MsIGV0Yy5cbiAgICogIDIuIEJ1aWxkIHJlYWRhYmlsaXR5J3MgRE9NIHRyZWUuXG4gICAqICAzLiBHcmFiIHRoZSBhcnRpY2xlIGNvbnRlbnQgZnJvbSB0aGUgY3VycmVudCBkb20gdHJlZS5cbiAgICogIDQuIFJlcGxhY2UgdGhlIGN1cnJlbnQgRE9NIHRyZWUgd2l0aCB0aGUgbmV3IG9uZS5cbiAgICogIDUuIFJlYWQgcGVhY2VmdWxseS5cbiAgICpcbiAgICogQHJldHVybiB2b2lkXG4gICAqKi9cbiAgcGFyc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBBdm9pZCBwYXJzaW5nIHRvbyBsYXJnZSBkb2N1bWVudHMsIGFzIHBlciBjb25maWd1cmF0aW9uIG9wdGlvblxuICAgIGlmICh0aGlzLl9tYXhFbGVtc1RvUGFyc2UgPiAwKSB7XG4gICAgICB2YXIgbnVtVGFncyA9IHRoaXMuX2RvYy5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikubGVuZ3RoO1xuICAgICAgaWYgKG51bVRhZ3MgPiB0aGlzLl9tYXhFbGVtc1RvUGFyc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWJvcnRpbmcgcGFyc2luZyBkb2N1bWVudDsgXCIgKyBudW1UYWdzICsgXCIgZWxlbWVudHMgZm91bmRcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVW53cmFwIGltYWdlIGZyb20gbm9zY3JpcHRcbiAgICB0aGlzLl91bndyYXBOb3NjcmlwdEltYWdlcyh0aGlzLl9kb2MpO1xuXG4gICAgLy8gRXh0cmFjdCBKU09OLUxEIG1ldGFkYXRhIGJlZm9yZSByZW1vdmluZyBzY3JpcHRzXG4gICAgdmFyIGpzb25MZCA9IHRoaXMuX2Rpc2FibGVKU09OTEQgPyB7fSA6IHRoaXMuX2dldEpTT05MRCh0aGlzLl9kb2MpO1xuXG4gICAgLy8gUmVtb3ZlIHNjcmlwdCB0YWdzIGZyb20gdGhlIGRvY3VtZW50LlxuICAgIHRoaXMuX3JlbW92ZVNjcmlwdHModGhpcy5fZG9jKTtcblxuICAgIHRoaXMuX3ByZXBEb2N1bWVudCgpO1xuXG4gICAgdmFyIG1ldGFkYXRhID0gdGhpcy5fZ2V0QXJ0aWNsZU1ldGFkYXRhKGpzb25MZCk7XG4gICAgdGhpcy5fYXJ0aWNsZVRpdGxlID0gbWV0YWRhdGEudGl0bGU7XG5cbiAgICB2YXIgYXJ0aWNsZUNvbnRlbnQgPSB0aGlzLl9ncmFiQXJ0aWNsZSgpO1xuICAgIGlmICghYXJ0aWNsZUNvbnRlbnQpXG4gICAgICByZXR1cm4gbnVsbDtcblxuICAgIHRoaXMubG9nKFwiR3JhYmJlZDogXCIgKyBhcnRpY2xlQ29udGVudC5pbm5lckhUTUwpO1xuXG4gICAgdGhpcy5fcG9zdFByb2Nlc3NDb250ZW50KGFydGljbGVDb250ZW50KTtcblxuICAgIC8vIElmIHdlIGhhdmVuJ3QgZm91bmQgYW4gZXhjZXJwdCBpbiB0aGUgYXJ0aWNsZSdzIG1ldGFkYXRhLCB1c2UgdGhlIGFydGljbGUnc1xuICAgIC8vIGZpcnN0IHBhcmFncmFwaCBhcyB0aGUgZXhjZXJwdC4gVGhpcyBpcyB1c2VkIGZvciBkaXNwbGF5aW5nIGEgcHJldmlldyBvZlxuICAgIC8vIHRoZSBhcnRpY2xlJ3MgY29udGVudC5cbiAgICBpZiAoIW1ldGFkYXRhLmV4Y2VycHQpIHtcbiAgICAgIHZhciBwYXJhZ3JhcGhzID0gYXJ0aWNsZUNvbnRlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwXCIpO1xuICAgICAgaWYgKHBhcmFncmFwaHMubGVuZ3RoID4gMCkge1xuICAgICAgICBtZXRhZGF0YS5leGNlcnB0ID0gcGFyYWdyYXBoc1swXS50ZXh0Q29udGVudC50cmltKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHRleHRDb250ZW50ID0gYXJ0aWNsZUNvbnRlbnQudGV4dENvbnRlbnQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpdGxlOiB0aGlzLl9hcnRpY2xlVGl0bGUsXG4gICAgICBieWxpbmU6IG1ldGFkYXRhLmJ5bGluZSB8fCB0aGlzLl9hcnRpY2xlQnlsaW5lLFxuICAgICAgZGlyOiB0aGlzLl9hcnRpY2xlRGlyLFxuICAgICAgbGFuZzogdGhpcy5fYXJ0aWNsZUxhbmcsXG4gICAgICBjb250ZW50OiB0aGlzLl9zZXJpYWxpemVyKGFydGljbGVDb250ZW50KSxcbiAgICAgIHRleHRDb250ZW50OiB0ZXh0Q29udGVudCxcbiAgICAgIGxlbmd0aDogdGV4dENvbnRlbnQubGVuZ3RoLFxuICAgICAgZXhjZXJwdDogbWV0YWRhdGEuZXhjZXJwdCxcbiAgICAgIHNpdGVOYW1lOiBtZXRhZGF0YS5zaXRlTmFtZSB8fCB0aGlzLl9hcnRpY2xlU2l0ZU5hbWUsXG4gICAgICBwdWJsaXNoZWRUaW1lOiBtZXRhZGF0YS5wdWJsaXNoZWRUaW1lXG4gICAgfTtcbiAgfVxufTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIpIHtcbiAgLyogZ2xvYmFsIG1vZHVsZSAqL1xuICBtb2R1bGUuZXhwb3J0cyA9IFJlYWRhYmlsaXR5O1xufVxuIiwiLyogZXNsaW50LWVudiBub2RlICovXG52YXIgUmVhZGFiaWxpdHkgPSByZXF1aXJlKFwiLi9SZWFkYWJpbGl0eVwiKTtcbnZhciBpc1Byb2JhYmx5UmVhZGVyYWJsZSA9IHJlcXVpcmUoXCIuL1JlYWRhYmlsaXR5LXJlYWRlcmFibGVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBSZWFkYWJpbGl0eTogUmVhZGFiaWxpdHksXG4gIGlzUHJvYmFibHlSZWFkZXJhYmxlOiBpc1Byb2JhYmx5UmVhZGVyYWJsZVxufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBSZWFkYWJpbGl0eSB9IGZyb20gJ0Btb3ppbGxhL3JlYWRhYmlsaXR5JztcblxuLy8gVXNlIFJlYWRhYmlsaXR5XG5jb25zdCBkb2N1bWVudENsb25lID0gZG9jdW1lbnQuY2xvbmVOb2RlKHRydWUpO1xuY29uc3QgcmVhZGVyID0gbmV3IFJlYWRhYmlsaXR5KGRvY3VtZW50Q2xvbmUpO1xuY29uc3QgYXJ0aWNsZSA9IHJlYWRlci5wYXJzZSgpO1xuY29uc29sZS5sb2coYXJ0aWNsZS50aXRsZSk7Il0sIm5hbWVzIjpbIlJlYWRhYmlsaXR5IiwiZG9jdW1lbnRDbG9uZSIsImRvY3VtZW50IiwiY2xvbmVOb2RlIiwicmVhZGVyIiwiYXJ0aWNsZSIsInBhcnNlIiwiY29uc29sZSIsImxvZyIsInRpdGxlIl0sInNvdXJjZVJvb3QiOiIifQ==